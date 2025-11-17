'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import '../globals.css';

export default function DokterPage() {
  const [statusKehadiran, setStatusKehadiran] = useState({
    text: 'Belum Mulai',
    time: 'Status akan berubah setelah Anda menekan tombol "Saya Sudah Sampai"',
    buttonText: 'Saya Sudah Sampai',
    buttonClass: 'btn btn-success btn-lg px-4',
    disabled: false
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');

  // Fungsi untuk mengubah status kehadiran - DARI Component/Dokter.js
  const ubahStatusKehadiran = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Update status menjadi Tersedia
    setStatusKehadiran({
      text: 'Tersedia',
      time: `Sudah sampai di puskesmas sejak ${timeString}`,
      buttonText: 'Sudah Di Puskesmas',
      buttonClass: 'btn btn-outline-success btn-lg px-4',
      disabled: true
    });

    // Simpan status ke localStorage
    localStorage.setItem('dokterStatus', 'Tersedia');
    localStorage.setItem('dokterWaktu', timeString);

    // Tampilkan notifikasi sukses
    showAlertMessage('Status kehadiran berhasil diubah menjadi "Tersedia"', 'success');
  };

  // Fungsi untuk menampilkan alert - DARI Component/Dokter.js
  const showAlertMessage = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);

    // Auto dismiss setelah 5 detik
    setTimeout(() => {
      setShowAlert(false);
    }, 5000);
  };

  // Load status dari localStorage saat komponen mount - DARI Component/Dokter.js
  useEffect(() => {
    const savedStatus = localStorage.getItem('dokterStatus');
    const savedTime = localStorage.getItem('dokterWaktu');
    
    if (savedStatus === 'Tersedia') {
      setStatusKehadiran({
        text: 'Tersedia',
        time: `Sudah sampai di puskesmas sejak ${savedTime}`,
        buttonText: 'Sudah Di Puskesmas',
        buttonClass: 'btn btn-outline-success btn-lg px-4',
        disabled: true
      });
    }
  }, []);

  return (
    <div className="dokter-page">
      <Header />
      
      {/* Alert Notification */}
      {showAlert && (
        <div 
          className={`alert alert-${alertType} alert-dismissible fade show position-fixed`}
          style={{ top: '100px', right: '20px', zIndex: 1050, minWidth: '300px' }}
        >
          <div className="d-flex align-items-center">
            <i className={`fas fa-${alertType === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
            <div>{alertMessage}</div>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setShowAlert(false)}
          ></button>
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
                      <h2 className="text-success mb-2">Selamat Datang, Dr. Siti Rahayu!</h2>
                      <p className="text-muted mb-0">
                        Spesialis Anak - Selamat bertugas di Puskesmas Cicalengka. 
                        Mari berikan pelayanan terbaik untuk kesehatan anak.
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

          {/* Jadwal Praktek Section */}
          <div className="row mb-5">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-success text-white py-3">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-calendar-alt me-2"></i>Jadwal Praktek Saya
                  </h5>
                </div>
                <div className="card-body p-4">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Hari</th>
                          <th>Waktu</th>
                          <th>Poli</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Senin - Jumat</td>
                          <td>09:00 - 15:00</td>
                          <td>Poli Anak</td>
                          <td><span className="badge bg-success">Aktif</span></td>
                        </tr>
                        <tr>
                          <td>Sabtu</td>
                          <td>09:00 - 13:00</td>
                          <td>Poli Anak</td>
                          <td><span className="badge bg-success">Aktif</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Poli Section */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-success text-white py-3">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-info-circle me-2"></i>Informasi Poli Anak
                  </h5>
                </div>
                <div className="card-body">
                  <p><strong>Lokasi:</strong> Gedung B, Lantai 1</p>
                  <p><strong>Kapasitas:</strong> 15 pasien per hari</p>
                  <p><strong>Fasilitas:</strong></p>
                  <ul>
                    <li>2 Ruang Pemeriksaan Anak</li>
                    <li>Area bermain anak</li>
                    <li>Alat pemeriksaan tumbuh kembang</li>
                    <li>Ruangan ber-AC dan colorful</li>
                  </ul>
                  <p><strong>Layanan:</strong></p>
                  <ul>
                    <li>Pemeriksaan kesehatan anak</li>
                    <li>Imunisasi</li>
                    <li>Konsultasi tumbuh kembang</li>
                    <li>Pemeriksaan bayi baru lahir</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-success text-white py-3">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-bell me-2"></i>Pengumuman
                  </h5>
                </div>
                <div className="card-body">
                  <div className="alert alert-info">
                    <h6><i className="fas fa-exclamation-circle me-2"></i>Rapat Bulanan</h6>
                    <p className="mb-0">
                      Akan diadakan rapat bulanan pada Jumat, 15 Desember 2023 pukul 14:00 di Aula Puskesmas.
                    </p>
                  </div>
                  <div className="alert alert-warning">
                    <h6><i className="fas fa-syringe me-2"></i>Program Imunisasi</h6>
                    <p className="mb-0">
                      Minggu depan akan ada program imunisasi campak dan rubella untuk anak usia 9 bulan - 15 tahun.
                    </p>
                  </div>
                  <div className="alert alert-success">
                    <h6><i className="fas fa-baby me-2"></i>Kelas Ibu Hamil</h6>
                    <p className="mb-0">
                      Kelas ibu hamil minggu ini akan membahas tentang perawatan bayi baru lahir dan ASI eksklusif.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}