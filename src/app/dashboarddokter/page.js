'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import DokterLayout from './dokterLayout';
import Footer from '../../../components/Footer';
import '../globals.css';

export default function DokterPage() {
  const [userData, setUserData] = useState({ full_name: 'Memuat...' });
  const [schedules, setSchedules] = useState([]);
  
  // State utama untuk tombol dan status teks
  const [statusKehadiran, setStatusKehadiran] = useState({
    text: 'Memuat...',
    time: 'Menghubungkan ke server...',
    buttonText: 'Tunggu',
    buttonClass: 'btn btn-secondary',
    disabled: true
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [doctorName, setDoctorName] = useState('');

  // --- LOGIKA REFRESH DATA (DIPANGGIL BERKALA) ---
  const refreshData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // 1. Ambil Profil
      const resProfile = await fetch('http://localhost:5001/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resProfile.ok) {
        const data = await resProfile.json();
        setUserData({ full_name: data.full_name });
      }

      // 2. Ambil Jadwal untuk Tabel
      const resSchedule = await fetch('http://localhost:5001/api/dokter/my-schedule', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resSchedule.ok) {
        const data = await resSchedule.json();
        setSchedules(data);
      }

      // 3. Ambil Status Kehadiran (Logika Auto-Off ada di Backend)
      const resStatus = await fetch('http://localhost:5001/api/dokter/current-status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const statusData = await resStatus.json();

      // LOGIKA PERUBAHAN UI OTOMATIS
      if (statusData.status === 'Aktif') {
        setStatusKehadiran({
          text: 'Tersedia',
          time: `Anda sedang aktif hingga jam ${statusData.jam_selesai.substring(0, 5)}`,
          buttonText: 'Sudah Aktif',
          buttonClass: 'btn btn-outline-success btn-lg px-4',
          disabled: true
        });
      } else if (statusData.status === 'Belum Waktunya') {
        setStatusKehadiran({
          text: 'Belum Jam Praktek',
          time: statusData.message,
          buttonText: 'Belum Bisa Absen',
          buttonClass: 'btn btn-secondary btn-lg px-4', // ABU-ABU (Disabled)
          disabled: true
        });
      } else if (statusData.status === 'Selesai' || statusData.status === 'Libur' || statusData.status === 'Tidak Aktif') {
        setStatusKehadiran({
          text: 'Praktek Tutup',
          time: statusData.message || 'Jadwal praktek telah berakhir.',
          buttonText: 'Praktek Tutup',
          buttonClass: 'btn btn-secondary btn-lg px-4', // ABU-ABU (Disabled)
          disabled: true
        });
      } else {
        // HANYA HIJAU JIKA DALAM JAM MASUK & BELUM KLIK
        setStatusKehadiran({
          text: 'Siap Melayani',
          time: 'Silakan klik tombol jika Anda sudah sampai di puskesmas.',
          buttonText: 'Saya Sudah Sampai',
          buttonClass: 'btn btn-success btn-lg px-4', // HIJAU (Enabled)
          disabled: false
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // --- AUTO REFRESH SETIAP 10 DETIK ---
  useEffect(() => {
    refreshData(); // Jalankan pertama kali saat load
    
    // Interval ini akan memastikan tombol berubah warna otomatis saat jam berganti
    const interval = setInterval(() => {
      refreshData();
    }, 10000); // 10 detik sekali cek ke server

    return () => clearInterval(interval); // Bersihkan interval saat pindah halaman
  }, []);

  const handleUpdateStatus = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5001/api/dokter/status', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'Aktif' })
      });

      const data = await res.json();
      if (res.ok) {
        setAlert({ show: true, msg: 'Status berhasil diaktifkan!', type: 'success' });
        refreshData();
      } else {
        setAlert({ show: true, msg: data.message, type: 'danger' });
      }
      setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 5000);
    } catch (error) {
      setAlert({ show: true, msg: 'Terjadi kesalahan koneksi.', type: 'danger' });
    }

    // Ambil nama dokter dari localStorage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setDoctorName(user.name || 'Dokter');
      } catch (e) {
        setDoctorName('Dokter');
      }
    }
  }, []);

  return (
    <DokterLayout>
      {/* Notifikasi Alert */}
      {alert.show && (
        <div className={`alert alert-${alert.type} position-fixed`} style={{ top: '100px', right: '20px', zIndex: 1050, minWidth: '300px' }}>
          <i className={`fas fa-${alert.type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
          {alert.msg}
        </div>
      )}

      <main className="py-4">
        <div className="container">
          {/* Welcome Section */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <h2 className="text-success mb-2">Selamat Datang, {doctorName}!</h2>
                      <p className="text-muted mb-0">
                        Selamat bertugas di Puskesmas Cicalengka. 
                        Mari berikan pelayanan terbaik untuk kesehatan masyarakat.
                      </p>
                    </div>
                    <div className="col-md-4 text-md-end">
                      <div className="avatar bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center">
                        <i className="fas fa-user-md"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Kehadiran Section */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-success text-white py-3">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-user-clock me-2"></i>Status Kehadiran Hari Ini
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="row align-items-center">
                    <div className="col-md-6">
                      <h4 id="statusText" className={statusKehadiran.text === 'Tersedia' ? 'text-success' : 'text-warning'}>
                        {statusKehadiran.text}
                      </h4>
                      <p id="statusTime" className="text-muted mb-0">{statusKehadiran.time}</p>
                    </div>
                    <div className="col-md-6 text-md-end">
                      <button 
                        id="btnKehadiran"
                        className={statusKehadiran.buttonClass}
                        onClick={ubahStatusKehadiran}
                        disabled={statusKehadiran.disabled}
                      >
                        <i className="fas fa-check-circle me-2"></i>
                        {statusKehadiran.buttonText}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

      {/* Kartu Status (Tombol) */}
      <div className="card border-0 shadow-sm mb-5">
        <div className="card-header bg-success text-white py-3">
          <h5 className="mb-0 fw-bold"><i className="fas fa-clock me-2"></i>Status Kehadiran Hari Ini</h5>
        </div>
        <div className="card-body p-4 d-flex justify-content-between align-items-center">
          <div>
            <h3 className={`fw-bold ${statusKehadiran.text === 'Tersedia' ? 'text-success' : 'text-warning'}`}>
              {statusKehadiran.text}
            </h3>
            <p className="text-muted mb-0">{statusKehadiran.time}</p>
          </div>
          <button 
            className={statusKehadiran.buttonClass} 
            onClick={handleUpdateStatus} 
            disabled={statusKehadiran.disabled}
          >
            <i className="fas fa-check-circle me-2"></i>{statusKehadiran.buttonText}
          </button>
        </div>
      </div>

      {/* Tabel Jadwal (Desain Original) */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-success text-white py-3">
          <h5 className="mb-0 fw-bold"><i className="fas fa-calendar-alt me-2"></i>Jadwal Praktek Saya</h5>
        </div>
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Waktu</th>
                  <th>Poliklinik</th>
                  <th>Status Database</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s, i) => (
                  <tr key={i}>
                    <td className="fw-bold">{s.hari}</td>
                    <td>{s.jam_mulai.substring(0, 5)} - {s.jam_selesai.substring(0, 5)}</td>
                    <td>{s.nama_poli}</td>
                    <td>
                      <span className={`badge rounded-pill px-3 py-2 ${s.status === 'Aktif' ? 'bg-success' : 'bg-secondary'}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DokterLayout>
  );
}