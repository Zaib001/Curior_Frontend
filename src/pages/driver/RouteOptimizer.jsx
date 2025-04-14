import React, { useState } from 'react';
import { getDriverParcels, optimizeRoute } from '../../services/driverService';
import toast from 'react-hot-toast';

const RouteOptimizer = () => {
  const [parcels, setParcels] = useState([]);
  const [optimized, setOptimized] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOptimize = async () => {
    setLoading(true);
    try {
      const fetchedParcels = await getDriverParcels();

      const withLocations = fetchedParcels.filter(p => p.currentLocation?.lat && p.currentLocation?.lng);
      if (withLocations.length === 0) {
        toast.error('No parcels with valid locations.');
        setLoading(false);
        return;
      }

      setParcels(withLocations);

      const optimizedRoute = await optimizeRoute(withLocations);
      setOptimized(optimizedRoute);
      toast.success('Route optimized successfully!');
    } catch (err) {
      toast.error('Route optimization failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-primary">Route Optimization</h2>

      <button
        onClick={handleOptimize}
        className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
        disabled={loading}
      >
        {loading ? 'Optimizing...' : 'Optimize Route'}
      </button>

      {optimized.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Optimized Delivery Order</h3>
          <ol className="list-decimal pl-6 space-y-2">
            {optimized.map((stop, idx) => (
              <li key={stop.id}>
                <strong>{stop.address}</strong> — {stop.lat.toFixed(5)}, {stop.lng.toFixed(5)}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default RouteOptimizer;
