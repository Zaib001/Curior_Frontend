import React, { useEffect, useState, useRef } from 'react';
import DataTable from '../../components/DataTable';
import Modal from '../../components/Modal';
import { QRCodeCanvas } from 'qrcode.react';
import { getParcels, exportParcelsCSV, createParcelsBulk } from '../../services/api';
import checkIfWithinM25 from '../../utils/checkM25';
import toast from 'react-hot-toast';
import Papa from 'papaparse';
import { FaDownload, FaUpload, FaFileCsv, FaSearch } from 'react-icons/fa';

const Parcels = () => {
  const [parcels, setParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [filterM25, setFilterM25] = useState(false);
  const [search, setSearch] = useState('');
  const fileInputRef = useRef();

  useEffect(() => {
    fetchParcels();
  }, []);

  const fetchParcels = async () => {
    try {
      const data = await getParcels();
      const tagged = data.map(p => ({
        ...p,
        isWithinM25: checkIfWithinM25(p.postcode),
      }));
      setParcels(tagged);
      setFilteredParcels(tagged);
    } catch {
      toast.error('Failed to fetch parcels');
    }
  };

  useEffect(() => {
    const filtered = parcels.filter(p => {
      const matches = search === '' || p.trackingId?.toLowerCase().includes(search.toLowerCase()) || p.receiver?.toLowerCase().includes(search.toLowerCase());
      return matches && (!filterM25 || p.isWithinM25);
    });
    setFilteredParcels(filtered);
  }, [search, filterM25, parcels]);

  const getBadge = (status) => {
    const base = 'px-3 py-1 rounded-full text-xs font-medium ';
    switch (status) {
      case 'In Transit': return base + 'bg-yellow-100 text-yellow-700';
      case 'Delivered': return base + 'bg-green-100 text-green-700';
      case 'Pending Pickup': return base + 'bg-blue-100 text-blue-700';
      default: return base + 'bg-gray-200 text-gray-600';
    }
  };

  const handleExportCSV = async () => {
    try {
      await exportParcelsCSV();
      toast.success('CSV exported!');
    } catch {
      toast.error('Failed to export CSV.');
    }
  };

  const handleTemplateDownload = () => {
    const headers = ['trackingId', 'receiver', 'address', 'postcode', 'phone', 'deliveryType'];
    const row = ['TRK123456', 'John Doe', '123 London Street', 'E1 6AN', '07123456789', 'Standard'];
    const csvContent = [headers.join(','), row.join(',')].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'parcel_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };


  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    console.log('Selected file:', file);
  
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async ({ data }) => {
        console.log('Parsed data:', data); // ✅ Step 1
  
        const errors = [];
  
        data.forEach((row, i) => {
          if (!row.trackingId || !row.receiver || !row.address || !row.postcode) {
            errors.push(`❌ Row ${i + 2} is missing required fields.`);
          }
        });
  
        if (errors.length > 0) {
          console.warn('CSV validation errors:', errors); // ✅ Step 2
          errors.forEach(msg => toast.error(msg));
          e.target.value = ''; // reset input
          return;
        }
  
        try {
          const res = await createParcelsBulk(data); // ✅ Step 3
          console.log('Upload success:', res); // ✅ Step 4
          toast.success('📦 Parcels created!');
          fetchParcels();
        } catch (err) {
          console.error('Upload failed:', err); // ✅ Step 5
          toast.error('Upload failed.');
        } finally {
          e.target.value = '';
        }
      },
      error: (error) => {
        console.error('Parsing error:', error); // ✅ Step 6
        toast.error('CSV parsing failed.');
      }
    });
  };
  


  const columns = [
    { header: 'Tracking ID', accessor: 'trackingId' },
    { header: 'Receiver', accessor: 'receiver' },
    { header: 'Address', accessor: 'address' },
    {
      header: 'M25 Zone',
      cell: (row) => (
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${row.isWithinM25 ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          {row.isWithinM25 ? 'Within M25' : 'Outside M25'}
        </span>
      ),
    },
    {
      header: 'Status',
      cell: (row) => <span className={getBadge(row.currentStatus)}>{row.currentStatus}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by Tracking ID or Receiver"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md text-sm"
          />
        </div>

        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={filterM25} onChange={(e) => setFilterM25(e.target.checked)} />
          <span>Show Only M25 Parcels</span>
        </label>

        <div className="flex gap-2 flex-wrap">
          <button onClick={handleExportCSV} className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark">
            <FaDownload /> Export CSV
          </button>

          <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
            <FaUpload /> Upload CSV
          </button>

          <input type="file" accept=".csv" ref={fileInputRef} onChange={handleCSVUpload} className="hidden" />

          <button onClick={handleTemplateDownload} className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800">
            <FaFileCsv /> Download Template
          </button>
        </div>
      </div>

      <DataTable title="Parcels" columns={columns} data={filteredParcels} onRowClick={setSelectedParcel} />

      <Modal isOpen={!!selectedParcel} onClose={() => setSelectedParcel(null)} title={`Parcel: ${selectedParcel?.trackingId}`}>
        {selectedParcel && (
          <div className="text-sm space-y-3 text-gray-700">
            <p><strong>Receiver:</strong> {selectedParcel.receiver}</p>
            <p><strong>Address:</strong> {selectedParcel.address}</p>
            <p><strong>Status:</strong> {selectedParcel.currentStatus}</p>
            <div className="mt-4">
              <strong>QR Code:</strong>
              <div className="mt-2 border p-3 w-fit bg-gray-50 rounded-md">
                <QRCodeCanvas value={selectedParcel.trackingId} size={128} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Parcels;
