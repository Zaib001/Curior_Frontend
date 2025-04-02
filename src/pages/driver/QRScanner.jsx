import React, { useState, useRef } from 'react';
import { QrReader } from 'react-qr-reader';
import { Toaster, toast } from 'react-hot-toast';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { FileDown, MapPin } from 'lucide-react';
import { updateParcelStatus, getRealTimeLocation } from '../../services/driverService';

const QRScanner = () => {
  const [status, setStatus] = useState('Delivered');
  const [scanLogs, setScanLogs] = useState([]);
  const [trackingLocation, setTrackingLocation] = useState(null);

  const scannedSet = useRef(new Set());
  const beepRef = useRef();

  // ✅ Handle Scan
  const handleScan = async (result) => {
    const scanned = result?.text;
    if (!scanned || scannedSet.current.has(scanned)) return;

    scannedSet.current.add(scanned);
    beepRef.current?.play();
    if (navigator.vibrate) navigator.vibrate(100);

    const timestamp = new Date().toLocaleString();

    const newLog = { parcelId: scanned, status, timestamp };

    try {
      // ✅ Update Parcel Status via API
      await updateParcelStatus(scanned, status);
      toast.success(`✅ ${scanned} → ${status}`);
      setScanLogs(prev => [newLog, ...prev]);
    } catch (error) {
      toast.error(`❗ Failed to update status for ${scanned}`);
    }
  };

  // ✅ Track Location
  const handleTrackLocation = async (parcelId) => {
    try {
      const location = await getRealTimeLocation(parcelId);
      setTrackingLocation(location);
      toast.success(`📍 Location fetched for ${parcelId}`);
    } catch (error) {
      toast.error(`❗ Failed to get location for ${parcelId}`);
    }
  };

  // ✅ Export to CSV
  const handleExportCSV = () => {
    const csv = Papa.unparse(scanLogs);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'scan-history.csv');
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6 bg-white rounded-xl shadow-card">
      <Toaster position="top-right" />
      <audio ref={beepRef} src="/beep.mp3" preload="auto" />

      <h2 className="text-2xl font-bold text-primary">QR Scanner + Scan History</h2>

      {/* Scanner Section */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="border aspect-video rounded-lg">
          <QrReader
            scanDelay={300}
            constraints={{ facingMode: 'environment' }}
            onResult={handleScan}
            onError={(err) => toast.error('Camera error')}
            style={{ width: '100%' }}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium block">Select Status to Apply</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border px-4 py-2 rounded-md text-sm"
          >
            <option value="Delivered">Delivered</option>
            <option value="Picked Up">Picked Up</option>
            <option value="In Transit">In Transit</option>
          </select>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition text-sm mt-4"
          >
            <FileDown size={16} />
            Export Logs as CSV
          </button>
        </div>
      </div>

      {/* Scan Logs Table */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-3">Scanned Parcels History</h3>
        <div className="overflow-auto max-h-[300px] rounded-md border bg-white">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left font-medium">Parcel ID</th>
                <th className="p-3 text-left font-medium">Status</th>
                <th className="p-3 text-left font-medium">Time</th>
                <th className="p-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scanLogs.map((log, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3">{log.parcelId}</td>
                  <td className="p-3">{log.status}</td>
                  <td className="p-3">{log.timestamp}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleTrackLocation(log.parcelId)}
                      className="text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <MapPin size={16} />
                      Track Location
                    </button>
                  </td>
                </tr>
              ))}
              {scanLogs.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center text-gray-400 p-6">
                    No parcels scanned yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-Time Location Display */}
      {trackingLocation && (
        <div className="mt-4 bg-blue-50 p-4 rounded-md">
          <h4 className="font-semibold">Real-Time Location</h4>
          <p>Latitude: {trackingLocation.latitude}</p>
          <p>Longitude: {trackingLocation.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
