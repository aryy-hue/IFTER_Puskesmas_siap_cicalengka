'use client';
import { useState, useEffect } from 'react';

export default function DokterComponent() {
  // 1. Gunakan state untuk data yang berubah
  const [status, setStatus] = useState({
    text: 'Belum Mulai',
    time: 'Status akan berubah...',
    buttonText: 'Saya Sudah Sampai',
    buttonClass: 'btn btn-success btn-lg px-4',
    disabled: false
  });

  // 2. Fungsi handler untuk event
  const ubahStatusKehadiran = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Update state, bukan DOM langsung
    setStatus({
      text: 'Tersedia',
      time: `Sudah sampai di puskesmas sejak ${timeString}`,
      buttonText: 'Sudah Di Puskesmas',
      buttonClass: 'btn btn-outline-success btn-lg px-4',
      disabled: true
    });

    localStorage.setItem('dokterStatus', 'Tersedia');
    localStorage.setItem('dokterWaktu', timeString);
  };

  // 3. useEffect untuk side effects (load dari localStorage)
  useEffect(() => {
    const savedStatus = localStorage.getItem('dokterStatus');
    const savedTime = localStorage.getItem('dokterWaktu');
    
    if (savedStatus === 'Tersedia') {
      setStatus({
        text: 'Tersedia',
        time: `Sudah sampai di puskesmas sejak ${savedTime}`,
        buttonText: 'Sudah Di Puskesmas',
        buttonClass: 'btn btn-outline-success btn-lg px-4',
        disabled: true
      });
    }
  }, []);

  return (
    <div>
      {/* 4. Render UI berdasarkan state */}
      <h4 className={status.text === 'Tersedia' ? 'text-success' : 'text-warning'}>
        {status.text}
      </h4>
      <p className="text-muted mb-0">{status.time}</p>
      
      <button 
        className={status.buttonClass}
        onClick={ubahStatusKehadiran}
        disabled={status.disabled}
      >
        <i className="fas fa-check-circle me-2"></i>
        {status.buttonText}
      </button>
    </div>
  );
}