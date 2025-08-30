import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const DroneWebSocketTest = () => {
  const [droneData, setDroneData] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:9013', {
      transports: ['polling'],
      cors: {
        origin: "*",
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setConnectionStatus('Connected');
      setSocket(newSocket);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setConnectionStatus('Disconnected');
    });

    newSocket.on('message', (data) => {
      console.log('Received drone data:', data);
      setDroneData(data);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnectionStatus('Connection Error');
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const renderDroneInfo = (drone) => {
    if (!drone) return null;

    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {drone.properties.Name}
        </h3>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-medium text-gray-600">Serial:</span>
            <span className="ml-1 text-gray-800">{drone.properties.serial}</span>
          </div>
          
          <div>
            <span className="font-medium text-gray-600">Registration:</span>
            <span className={`ml-1 font-semibold ${
              drone.properties.registration.startsWith('SD-B') ? 'text-green-600' : 'text-red-600'
            }`}>
              {drone.properties.registration}
            </span>
          </div>
          
          <div>
            <span className="font-medium text-gray-600">Altitude:</span>
            <span className="ml-1 text-gray-800">{drone.properties.altitude}m</span>
          </div>
          
          <div>
            <span className="font-medium text-gray-600">Pilot:</span>
            <span className="ml-1 text-gray-800">{drone.properties.pilot}</span>
          </div>
          
          <div>
            <span className="font-medium text-gray-600">Organization:</span>
            <span className="ml-1 text-gray-800">{drone.properties.organization}</span>
          </div>
          
          <div>
            <span className="font-medium text-gray-600">Yaw:</span>
            <span className="ml-1 text-gray-800">{drone.properties.yaw}°</span>
          </div>
          
          <div className="col-span-2">
            <span className="font-medium text-gray-600">Location:</span>
            <span className="ml-1 text-gray-800">
              [{drone.geometry.coordinates[0].toFixed(6)}, {drone.geometry.coordinates[1].toFixed(6)}]
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Drone WebSocket Test
        </h1>
        
        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Connection Status
          </h2>
          <div className="flex items-center">
            <div className={`w-3 h-3 rounded-full mr-2 ${
              connectionStatus === 'Connected' ? 'bg-green-500' : 
              connectionStatus === 'Connection Error' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></div>
            <span className={`font-medium ${
              connectionStatus === 'Connected' ? 'text-green-600' : 
              connectionStatus === 'Connection Error' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {connectionStatus}
            </span>
          </div>
        </div>

        {/* Raw Data Display */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Raw WebSocket Data
          </h2>
          <pre className="bg-gray-100 p-3 rounded text-xs overflow-auto max-h-40">
            {droneData ? JSON.stringify(droneData, null, 2) : 'No data received yet...'}
          </pre>
        </div>

        {/* Parsed Drone Information */}
        {droneData && droneData.features && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Drone Information ({droneData.features.length} drone{droneData.features.length !== 1 ? 's' : ''})
            </h2>
            {droneData.features.map((drone, index) => (
              <div key={index}>
                {renderDroneInfo(drone)}
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Instructions
          </h3>
          <ul className="text-blue-700 space-y-1">
            <li>• Make sure your Express server is running on port 9013</li>
            <li>• The WebSocket should connect automatically</li>
            <li>• You should see drone data updating every second</li>
            <li>• Green registration numbers start with 'B' (allowed to fly)</li>
            <li>• Red registration numbers don't start with 'B' (not allowed)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DroneWebSocketTest;