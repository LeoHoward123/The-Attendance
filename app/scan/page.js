
'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { QrReader } from 'react-qr-reader';

export default function ScanPage() {
  const [inputBuffer, setInputBuffer] = useState('');
  const [statusMsg, setStatusMsg] = useState('Ready to Scan...');
  const [statusType, setStatusType] = useState('neutral');
  const [showQr, setShowQr] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        if (inputBuffer.length > 0) {
          processScan(inputBuffer, 'RFID');
          setInputBuffer('');
        }
      } else {
        setInputBuffer((prev) => prev + e.key);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputBuffer]);

  const processScan = async (tag, method) => {
    setStatusMsg('Processing...');
    try {
      const res = await axios.post('/api/attendance', { rfidTag: tag, method });
      setStatusMsg(`✅ Welcome, ${res.data.student.name}!`);
      setStatusType('success');
      setTimeout(() => {
        setStatusType('neutral');
        setStatusMsg('Ready to Scan...');
      }, 3000);
    } catch (err) {
      setStatusMsg(`❌ ${err.response?.data?.error || 'Error'}`);
      setStatusType('error');
    }
  };

  return (
    <div style={{ padding: '50px', textAlign: 'center', backgroundColor: statusType === 'success' ? '#d1fae5' : statusType === 'error' ? '#fee2e2' : '#f3f4f6', minHeight: '100vh' }}>
      <h1>RFID Attendance Scanner</h1>
      <div style={{ fontSize: '2rem', margin: '20px' }}>{statusMsg}</div>
      
      <button onClick={() => setShowQr(!showQr)} style={{ padding: '10px', cursor: 'pointer' }}>
        {showQr ? 'Close Camera' : 'Use QR Camera'}
      </button>

      {showQr && (
        <div style={{ width: '300px', margin: '20px auto' }}>
          <QrReader
            onResult={(result, error) => {
              if (!!result) processScan(result?.text, 'QR');
            }}
            constraints={{ facingMode: 'user' }}
          />
        </div>
      )}
    </div>
  );
}
