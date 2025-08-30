import React, { useState, useEffect, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './DroneTrackerStyle.css';
import { styles } from './styles.js';

const DroneTrackingDashboard = () => {
  const [drones, setDrones] = useState({});
  const [selectedDroneId, setSelectedDroneId] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [flightTime, setFlightTime] = useState(0);
  const [activeTab, setActiveTab] = useState('drones');
  const [activeNavItem, setActiveNavItem] = useState('dashboard');
  const [mapError, setMapError] = useState(null);
  
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
  const pathsRef = useRef({});
  const socketRef = useRef(null);

  // Map configuration - Choose ONE of these options:
  const MAP_CONFIG = {
    // Option 1: OpenStreetMap (Free, no API key required)
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    },
    
    // Option 2: CartoDB Dark (Free, no API key required)
    cartodb: {
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '© OpenStreetMap contributors © CARTO',
      maxZoom: 19,
      subdomains: 'abcd'
    },
    
    // Option 3: MapBox (Requires API key)
    mapbox: {
      url: 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      attribution: '© Mapbox © OpenStreetMap',
      maxZoom: 19,
      id: 'mapbox/dark-v10', // or 'mapbox/streets-v11'
      accessToken: process.env.REACT_APP_MAPBOX_TOKEN || 'YOUR_MAPBOX_TOKEN_HERE'
    },
    
    // Option 4: Google Maps (Requires API key)
    google: {
      url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key={apikey}',
      attribution: '© Google',
      maxZoom: 20,
      apikey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY_HERE'
    }
  };

  useEffect(() => {
    if (!map.current && mapContainer.current) {
      try {
        map.current = L.map(mapContainer.current, {
          center: [31.9454, 35.9284], // Jordan coordinates
          zoom: 12,
          zoomControl: true,
          attributionControl: true
        });

        // Use CartoDB dark theme (no API key required)
        const tileLayer = L.tileLayer(MAP_CONFIG.cartodb.url, {
          attribution: MAP_CONFIG.cartodb.attribution,
          subdomains: MAP_CONFIG.cartodb.subdomains,
          maxZoom: MAP_CONFIG.cartodb.maxZoom
        });

        tileLayer.addTo(map.current);
        
        // Handle tile load errors
        tileLayer.on('tileerror', (error) => {
          console.error('Tile loading error:', error);
          setMapError('Failed to load map tiles. Check your internet connection.');
        });

        tileLayer.on('tileload', () => {
          setMapError(null);
        });

        console.log('Leaflet map initialized successfully');
        
      } catch (error) {
        console.error('Map initialization error:', error);
        setMapError('Failed to initialize map');
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const socket = io('http://localhost:9013', {
      transports: ['polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('Connected');
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('Disconnected');
      console.log('WebSocket disconnected');
    });

    socket.on('message', (data) => {
      console.log('Received data:', data);
      if (data.features && data.features.length > 0) {
        const timestamp = Date.now();
        const newDrones = {};
        
        data.features.forEach((drone) => {
          const droneId = drone.properties.serial;
          const registrationParts = drone.properties.registration.split('-');
          const isAllowed = registrationParts[1]?.startsWith('B') || false;

          const [lng, lat] = drone.geometry.coordinates;
          const newCoord = [lng, lat];

          const existingDrone = drones[droneId];

          newDrones[droneId] = {
            ...drone,
            id: droneId,
            isAllowed,
            lastSeen: timestamp,
            geometry: {
              ...drone.geometry,
              coordinates: newCoord,
            },
            path: existingDrone
              ? [...existingDrone.path.slice(-30), newCoord]
              : [newCoord],
            altitude: drone.properties.altitude,
            flightTime: existingDrone
              ? existingDrone.flightTime + 1
              : 0,
          };
        });

        setDrones(prev => ({ ...prev, ...newDrones }));
        updateMapMarkers(newDrones);
        updateDronePaths(newDrones);
      }
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      setConnectionStatus('Connection Error');
    });

    const timeInterval = setInterval(() => {
      setFlightTime(prev => prev + 1);
    }, 1000);

    return () => {
      if (socket) {
        socket.disconnect();
      }
      clearInterval(timeInterval);
    };
  }, [drones]);

  const createDroneIcon = useCallback((drone) => {
    const color = drone.isAllowed ? '#10b981' : '#ef4444';
    const yaw = drone.properties.yaw || 0;
    const shadowColor = drone.isAllowed ? '16, 185, 129' : '239, 68, 68';
    
    return L.divIcon({
      html: `
        <div class="drone-marker ${selectedDroneId === drone.id ? 'selected' : ''}" style="
          width: 24px; 
          height: 24px; 
          background: ${color}; 
          border-radius: 50%; 
          border: 3px solid rgba(255, 255, 255, 0.9);
          position: relative;
          cursor: pointer;
          transform: rotate(${yaw}deg);
          box-shadow: 0 0 20px rgba(${shadowColor}, 0.8);
          transition: all 0.3s ease;
        ">
          <div style="
            position: absolute;
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-bottom: 12px solid ${color};
            filter: drop-shadow(0 0 4px rgba(${shadowColor}, 0.6));
          "></div>
        </div>
      `,
      className: 'custom-drone-icon',
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
  }, [selectedDroneId]);

  const updateMapMarkers = useCallback((newDrones) => {
    if (!map.current) return;

    Object.values(newDrones).forEach(drone => {
      const droneId = drone.id;
      const coordinates = [drone.geometry.coordinates[1], drone.geometry.coordinates[0]];
      
      if (markersRef.current[droneId]) {
        map.current.removeLayer(markersRef.current[droneId]);
      }

      const marker = L.marker(coordinates, {
        icon: createDroneIcon(drone)
      }).addTo(map.current);

      const popupContent = `
        <div style="color: white; min-width: 180px;">
          <div style="font-weight: 700; color: #f97316; margin-bottom: 12px; font-size: 14px;">
            ${drone.properties.Name || 'Unknown Drone'}
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px;">
            <span style="color: #9ca3af; font-weight: 500;">Registration:</span>
            <span style="color: ${drone.isAllowed ? '#10b981' : '#ef4444'}; font-weight: 600;">
              ${drone.properties.registration}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px;">
            <span style="color: #9ca3af; font-weight: 500;">Altitude:</span>
            <span style="color: white; font-weight: 600;">${drone.altitude}m</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px;">
            <span style="color: #9ca3af; font-weight: 500;">Flight Time:</span>
            <span style="color: white; font-weight: 600;">${formatTime(drone.flightTime)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 12px;">
            <span style="color: #9ca3af; font-weight: 500;">Pilot:</span>
            <span style="color: white; font-weight: 600;">${drone.properties.pilot}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        setSelectedDroneId(droneId);
        marker.openPopup();
      });

      markersRef.current[droneId] = marker;
    });
  }, [createDroneIcon]);

  const updateDronePaths = useCallback((newDrones) => {
    if (!map.current) return;

    Object.values(newDrones).forEach(drone => {
      const droneId = drone.id;
      
      if (pathsRef.current[droneId]) {
        map.current.removeLayer(pathsRef.current[droneId]);
      }

      if (drone.path && drone.path.length > 1) {
        const pathCoordinates = drone.path.map(coord => [coord[1], coord[0]]);
        
        const polyline = L.polyline(pathCoordinates, {
          color: drone.isAllowed ? '#10b981' : '#ef4444',
          weight: 3,
          opacity: 0.8,
          dashArray: '5, 5'
        }).addTo(map.current);

        pathsRef.current[droneId] = polyline;
      }
    });
  }, []);

  const moveToDrone = useCallback((drone) => {
    if (map.current && drone.geometry) {
      const coordinates = [drone.geometry.coordinates[1], drone.geometry.coordinates[0]];
      map.current.setView(coordinates, 16, { animate: true, duration: 1.5 });
      
      setSelectedDroneId(drone.id);
      
      setTimeout(() => {
        const marker = markersRef.current[drone.id];
        if (marker) {
          marker.openPopup();
        }
      }, 1600);
    }
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalDrones = () => Object.keys(drones).length;
  const getAuthorizedDrones = () => Object.values(drones).filter(drone => drone.isAllowed).length;
  const getUnauthorizedDrones = () => Object.values(drones).filter(drone => !drone.isAllowed).length;

  const handleNavigation = (item) => {
    setActiveNavItem(item);
  };

  const DroneCard = ({ drone }) => (
    <div
      style={{
        ...styles.droneCard,
        ...(selectedDroneId === drone.id ? styles.droneCardSelected : {}),
      }}
      onClick={() => moveToDrone(drone)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && moveToDrone(drone)}
      onMouseEnter={(e) => {
        if (selectedDroneId !== drone.id) {
          e.target.style.transform = 'translateY(-4px)';
          e.target.style.background = 'linear-gradient(135deg, #161b22 0%, #1c2128 100%)';
          e.target.style.borderColor = '#30363d';
          e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        if (selectedDroneId !== drone.id) {
          e.target.style.transform = 'translateY(0)';
          e.target.style.background = 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)';
          e.target.style.borderColor = '#21262d';
          e.target.style.boxShadow = 'none';
        }
      }}
    >
      <div style={styles.droneCardHeader}>
        <div>
          <div style={styles.droneModel}>{drone.properties.Name || 'DJI Mavic 3 Pro'}</div>
          <div style={styles.droneName}>Drone Model</div>
        </div>
        <div 
          style={{
            ...styles.droneStatusIndicator,
            ...(drone.isAllowed ? styles.droneStatusAllowed : styles.droneStatusForbidden),
          }}
        ></div>
      </div>
      
      <div style={styles.droneDetails}>
        <div style={styles.droneDetailRow}>
          <span style={styles.droneDetailLabel}>Serial #</span>
          <span style={styles.droneDetailValue}>{drone.properties.serial}</span>
        </div>
        <div style={styles.droneDetailRow}>
          <span style={styles.droneDetailLabel}>Registration #</span>
          <span style={{
            ...styles.droneDetailValue,
            ...(drone.isAllowed ? styles.droneDetailValueAllowed : styles.droneDetailValueForbidden),
          }}>
            {drone.properties.registration}
          </span>
        </div>
        <div style={styles.droneDetailRow}>
          <span style={styles.droneDetailLabel}>Pilot</span>
          <span style={styles.droneDetailValue}>{drone.properties.pilot}</span>
        </div>
        <div style={styles.droneDetailRow}>
          <span style={styles.droneDetailLabel}>Organization</span>
          <span style={styles.droneDetailValue}>{drone.properties.organization}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.dashboard}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.headerLeft}>
            <div style={styles.logo}>SAGER</div>
            <div style={styles.connectionStatus}>
              <div style={{
                ...styles.statusDot,
                ...(connectionStatus === 'Connected' ? styles.statusDotConnected : styles.statusDotDisconnected),
              }}></div>
              <span style={styles.statusText}>{connectionStatus}</span>
            </div>
          </div>
          
          <div style={styles.headerRight}>
            <div style={styles.userInfo}>
              <div style={styles.userDetails}>
                <div style={styles.userName}>Hello, Mohammed Omar</div>
                <div style={styles.userRole}>Technical Support</div>
              </div>
            </div>
            <div 
              style={styles.notificationBadge}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 6px 20px rgba(220, 38, 38, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(220, 38, 38, 0.4)';
              }}
            >
              {getUnauthorizedDrones()}
            </div>
          </div>
        </div>
      </header>

      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <div style={styles.sidebarTitleSection}>
            <div style={styles.sidebarIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 22L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
              </svg>
            </div>
            <h2 style={styles.sidebarTitle}>Drone Flying</h2>
          </div>
          
          <nav style={styles.sidebarTabs}>
            <button 
              style={{
                ...styles.tabButton,
                ...(activeTab === 'drones' ? styles.tabButtonActive : {}),
              }}
              onClick={() => setActiveTab('drones')}
              onMouseEnter={(e) => {
                if (activeTab !== 'drones') e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'drones') e.target.style.color = '#6b7280';
              }}
            >
              Drones
            </button>
            <button 
              style={{
                ...styles.tabButton,
                ...(activeTab === 'history' ? styles.tabButtonActive : {}),
              }}
              onClick={() => setActiveTab('history')}
              onMouseEnter={(e) => {
                if (activeTab !== 'history') e.target.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                if (activeTab !== 'history') e.target.style.color = '#6b7280';
              }}
            >
              Flights History
            </button>
          </nav>
        </div>

        <div style={styles.navigationMenu}>
          <div 
            style={{
              ...styles.navItem,
              ...(activeNavItem === 'dashboard' ? styles.navItemActive : {}),
            }}
            onClick={() => handleNavigation('dashboard')}
            role="button"
            tabIndex={0}
            onMouseEnter={(e) => {
              if (activeNavItem !== 'dashboard') {
                e.target.style.background = 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)';
                e.target.style.color = '#f97316';
              }
            }}
            onMouseLeave={(e) => {
              if (activeNavItem !== 'dashboard') {
                e.target.style.background = 'transparent';
                e.target.style.color = '#6b7280';
              }
            }}
          >
            <svg style={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
            <span>Dashboard</span>
          </div>
          
          <div 
            style={{
              ...styles.navItem,
              ...(activeNavItem === 'map' ? styles.navItemActive : {}),
            }}
            onClick={() => handleNavigation('map')}
            role="button"
            tabIndex={0}
            onMouseEnter={(e) => {
              if (activeNavItem !== 'map') {
                e.target.style.background = 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(249, 115, 22, 0.05) 100%)';
                e.target.style.color = '#f97316';
              }
            }}
            onMouseLeave={(e) => {
              if (activeNavItem !== 'map') {
                e.target.style.background = 'transparent';
                e.target.style.color = '#6b7280';
              }
            }}
          >
            <svg style={styles.navIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z"/>
            </svg>
            <span>Map</span>
          </div>
        </div>

        <div style={styles.droneListContainer}>
          {getTotalDrones() === 0 ? (
            <div className="loading-spinner"></div>
          ) : (
            <div style={styles.droneList}>
              {Object.values(drones).map((drone) => (
                <DroneCard key={drone.id} drone={drone} />
              ))}
            </div>
          )}
        </div>
      </aside>

      <main style={styles.mapContainer}>
        <div style={styles.mapWrapper}>
          {mapError && (
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(239, 68, 68, 0.9)',
              color: 'white',
              padding: '16px 24px',
              borderRadius: '8px',
              zIndex: 1000,
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {mapError}
            </div>
          )}
          <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
        </div>
        
        <div style={styles.flightStats}>
          <h3 style={styles.flightStatsTitle}>Flight Statistics</h3>
          <div style={styles.flightStatRow}>
            <span style={styles.flightStatLabel}>Total Drones:</span>
            <span style={styles.flightStatValueTotal}>{getTotalDrones()}</span>
          </div>
          <div style={styles.flightStatRow}>
            <span style={styles.flightStatLabel}>Authorized:</span>
            <span style={styles.flightStatValueAllowed}>{getAuthorizedDrones()}</span>
          </div>
          <div style={styles.flightStatRow}>
            <span style={styles.flightStatLabel}>Unauthorized:</span>
            <span style={styles.flightStatValueForbidden}>{getUnauthorizedDrones()}</span>
          </div>
          <div style={styles.flightStatRow}>
            <span style={styles.flightStatLabel}>Total Flight Time:</span>
            <span style={styles.flightStatValueTotal}>{formatTime(flightTime)}</span>
          </div>
        </div>

        <div style={styles.bottomControls}>
          <div style={styles.redDroneCounter} title="Unauthorized Drones">
            {getUnauthorizedDrones()}
          </div>
          <div style={styles.droneFlyingLabel}>
            Drone Flying
          </div>
        </div>
      </main>
    </div>
  );
};

export default DroneTrackingDashboard;