export const styles = {
  dashboard: {
    height: '100vh',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
    display: 'flex',
    position: 'relative',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    color: 'white',
    overflow: 'hidden'
  },
  
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0.95) 100%)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid #333'
  },
  
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    height: '60px'
  },
  
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  
  logo: {
    fontSize: '24px',
    fontWeight: '900',
    color: 'white',
    letterSpacing: '2px',
    textTransform: 'uppercase'
  },
  
  connectionStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    animation: 'pulse 2s infinite'
  },
  
  statusDotConnected: {
    background: '#10b981',
    boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
  },
  
  statusDotDisconnected: {
    background: '#ef4444',
    boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
  },
  
  statusText: {
    fontSize: '12px',
    color: '#9ca3af',
    fontWeight: '500'
  },
  
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  
  userDetails: {
    textAlign: 'right'
  },
  
  userName: {
    fontSize: '13px',
    color: 'white',
    fontWeight: '600'
  },
  
  userRole: {
    fontSize: '11px',
    color: '#6b7280',
    marginTop: '2px'
  },
  
  notificationBadge: {
    width: '32px',
    height: '32px',
    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    boxShadow: '0 4px 15px rgba(220, 38, 38, 0.4)',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  
  sidebar: {
    width: '380px',
    background: 'linear-gradient(180deg, #000000 0%, #0d1117 100%)',
    borderRight: '1px solid #21262d',
    paddingTop: '60px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  },
  
  sidebarHeader: {
    padding: '24px',
    borderBottom: '1px solid #21262d',
    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, transparent 100%)'
  },
  
  sidebarTitleSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px'
  },
  
  sidebarIcon: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
  },
  
  sidebarTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#f97316',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  },
  
  sidebarTabs: {
    display: 'flex',
    gap: '32px',
    borderBottom: '1px solid #21262d'
  },
  
  tabButton: {
    background: 'none',
    border: 'none',
    color: '#6b7280',
    fontSize: '13px',
    fontWeight: '600',
    padding: '0 0 16px 0',
    cursor: 'pointer',
    position: 'relative',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  
  tabButtonActive: {
    color: '#dc2626',
    borderBottom: '2px solid #dc2626'
  },
  
  navigationMenu: {
    padding: '16px 24px'
  },
  
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '4px',
    fontSize: '13px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#6b7280'
  },
  
  navItemActive: {
    background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)',
    color: '#f97316'
  },
  
  navIcon: {
    width: '16px',
    height: '16px',
    opacity: '0.7'
  },
  
  droneListContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '0 24px 24px 24px',
    mask: 'linear-gradient(to bottom, black calc(100% - 40px), transparent)'
  },
  
  droneList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingTop: '16px'
  },
  
  droneCard: {
    background: 'linear-gradient(135deg, #0d1117 0%, #161b22 100%)',
    border: '1px solid #21262d',
    borderRadius: '12px',
    padding: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden'
  },
  
  droneCardSelected: {
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)',
    borderColor: '#3b82f6',
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.2)'
  },
  
  droneCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  
  droneModel: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'white',
    marginBottom: '4px'
  },
  
  droneName: {
    fontSize: '12px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  
  droneStatusIndicator: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    position: 'relative'
  },
  
  droneStatusAllowed: {
    background: '#10b981',
    boxShadow: '0 0 15px rgba(16, 185, 129, 0.6)'
  },
  
  droneStatusForbidden: {
    background: '#ef4444',
    boxShadow: '0 0 15px rgba(239, 68, 68, 0.6)'
  },
  
  droneDetails: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '10px'
  },
  
  droneDetailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  
  droneDetailLabel: {
    fontSize: '11px',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    fontWeight: '600'
  },
  
  droneDetailValue: {
    fontSize: '12px',
    color: 'white',
    fontWeight: '600',
    fontFamily: "'JetBrains Mono', monospace"
  },
  
  droneDetailValueAllowed: {
    color: '#10b981',
    fontWeight: '700'
  },
  
  droneDetailValueForbidden: {
    color: '#ef4444',
    fontWeight: '700'
  },
  
  mapContainer: {
    flex: 1,
    position: 'relative',
    paddingTop: '60px',
    background: '#000'
  },
  
  mapWrapper: {
    width: '100%',
    height: 'calc(100vh - 60px)',
    position: 'relative'
  },
  
  flightStats: {
    position: 'absolute',
    top: '80px',
    right: '24px',
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(13, 17, 23, 0.9) 100%)',
    backdropFilter: 'blur(10px)',
    border: '1px solid #21262d',
    borderRadius: '12px',
    padding: '20px',
    minWidth: '200px',
    zIndex: 500
  },
  
  flightStatsTitle: {
    color: '#f97316',
    fontWeight: '700',
    marginBottom: '16px',
    fontSize: '14px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  
  flightStatRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '12px'
  },
  
  flightStatLabel: {
    color: '#9ca3af',
    fontWeight: '500'
  },
  
  flightStatValueTotal: {
    fontWeight: '700',
    color: 'white'
  },
  
  flightStatValueAllowed: {
    fontWeight: '700',
    color: '#10b981'
  },
  
  flightStatValueForbidden: {
    fontWeight: '700',
    color: '#ef4444'
  },
  
  bottomControls: {
    position: 'absolute',
    bottom: '24px',
    right: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    zIndex: 500
  },
  
  redDroneCounter: {
    width: '48px',
    height: '48px',
    background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '700',
    color: 'white',
    boxShadow: '0 8px 25px rgba(220, 38, 38, 0.4)',
    border: '2px solid rgba(255, 255, 255, 0.1)'
  },
  
  droneFlyingLabel: {
    background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(13, 17, 23, 0.9) 100%)',
    backdropFilter: 'blur(10px)',
    border: '1px solid #21262d',
    borderRadius: '8px',
    padding: '12px 16px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }
};