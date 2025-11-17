'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import 'src/app/globals.css';

export default function HomePage() {
  const [poliData, setPoliData] = useState([]);
  const [selectedPoli, setSelectedPoli] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Data poli dan dokter (dipindahkan dari poli-data.js)
  useEffect(() => {
    const data = [
      {
        id: 1,
        name: "Poli Umum",
        icon: "fas fa-user-md",
        color: "primary",
        description: "Pelayanan kesehatan umum untuk semua usia",
        doctors: [
          {
            name: "Dr. Ahmad Wijaya, Sp.PD",
            specialty: "Penyakit Dalam",
            schedule: "Senin - Jumat: 08:00 - 14:00",
            status: "Tersedia"
          },
          {
            name: "Dr. Sari Indah, Sp.PD",
            specialty: "Penyakit Dalam",
            schedule: "Senin - Sabtu: 08:00 - 12:00",
            status: "Belum Hadir"
          }
        ]
      },
      {
        id: 2,
        name: "Poli Anak",
        icon: "fas fa-baby",
        color: "info",
        description: "Khusus pelayanan kesehatan anak dan balita",
        doctors: [
          {
            name: "Dr. Siti Rahayu, Sp.A",
            specialty: "Anak",
            schedule: "Senin - Jumat: 09:00 - 15:00",
            status: "Tersedia"
          },
          {
            name: "Dr. Budi Santoso, Sp.A",
            specialty: "Anak",
            schedule: "Selasa - Kamis: 10:00 - 16:00",
            status: "Belum Hadir"
          }
        ]
      },
      {
        id: 3,
        name: "Poli Gigi",
        icon: "fas fa-tooth",
        color: "warning",
        description: "Pelayanan kesehatan gigi dan mulut",
        doctors: [
          {
            name: "Drg. Maya Sari",
            specialty: "Konservasi Gigi",
            schedule: "Senin - Jumat: 08:00 - 14:00",
            status: "Tersedia"
          },
          {
            name: "Drg. Rizki Pratama",
            specialty: "Bedah Mulut",
            schedule: "Rabu - Sabtu: 09:00 - 15:00",
            status: "Belum Hadir"
          }
        ]
      },
      {
        id: 4,
        name: "Poli Kandungan",
        icon: "fas fa-female",
        color: "danger",
        description: "Kesehatan ibu dan kandungan",
        doctors: [
          {
            name: "Dr. Linda Suryani, Sp.OG",
            specialty: "Kandungan",
            schedule: "Senin, Rabu, Jumat: 08:00 - 12:00",
            status: "Tersedia"
          }
        ]
      },
      {
        id: 5,
        name: "Poli Mata",
        icon: "fas fa-eye",
        color: "success",
        description: "Pelayanan kesehatan mata",
        doctors: [
          {
            name: "Dr. Andi Wijaya, Sp.M",
            specialty: "Mata",
            schedule: "Selasa & Kamis: 09:00 - 14:00",
            status: "Tersedia"
          }
        ]
      },
      {
        id: 6,
        name: "UGD",
        icon: "fas fa-ambulance",
        color: "dark",
        description: "Unit Gawat Darurat 24 jam",
        doctors: [
          {
            name: "Tim Dokter Jaga",
            specialty: "Emergency",
            schedule: "24 Jam",
            status: "Tersedia"
          }
        ]
      }
    ];
    setPoliData(data);
  }, []);

  const openPoliModal = (poli) => {
    setSelectedPoli(poli);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPoli(null);
  };

  return (
    <div className="home-page">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-50 py-5">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold text-success mb-4 animate-fade-in">
                Selamat Datang di Puskesmas Cicalengka
              </h1>
              <p className="lead mb-4 animate-slide-up">
                Melayani dengan hati untuk kesehatan masyarakat Cicalengka dan sekitarnya.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <img 
                  src="../img/puskesmas.jpg" 
                  alt="Puskesmas Cicalengka" 
                  className="img-fluid rounded shadow-lg"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zMDAgMjAwTDM1MCAxNTBINDUwTDUwMCAyMDBINDUwTDM1MCAzMDBIMzAwTDI1MCAyMDBIMjAwTDE1MCAxNTBIMjUwTDMwMCAyMDBaIiBmaWxsPSIjMTk4NzU0IiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8dGV4dCB4PSIzMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiBmb250LXdlaWdodD0iYm9sZCI+UHVza2VzbWFzIENpY2FsZW5na2E8L3RleHQ+Cjwvc3ZnPg==';
                  }}
                />
                <div className="floating-elements">
                  <div className="floating-element element-2">
                    <i className="fas fa-heart"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dokter Hari Ini */}
      <section id="dokter" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Dokter Hari Ini</h2>
            <p className="section-subtitle">Tim medis profesional siap melayani Anda</p>
          </div>
          <div className="row" id="poli-container">
            {poliData.map((poli) => (
              <div key={poli.id} className="col-md-6 col-lg-4 mb-4">
                <div 
                  className={`card doctor-card h-100 border-${poli.color}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => openPoliModal(poli)}
                >
                  <div className={`card-header bg-${poli.color} text-white py-3`}>
                    <div className="d-flex align-items-center">
                      <i className={`${poli.icon} fa-2x me-3`}></i>
                      <div>
                        <h5 className="card-title mb-0">{poli.name}</h5>
                        <small>{poli.doctors.length} dokter tersedia</small>
                      </div>
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text">{poli.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {poli.doctors.filter(d => d.status === 'Tersedia').length} tersedia
                      </small>
                      <span className="badge bg-success">Buka</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal untuk Daftar Dokter Poli */}
      {showModal && selectedPoli && (
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Daftar Dokter - {selectedPoli.name}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div id="modalDoctorList">
                  {selectedPoli.doctors.map((doctor, index) => (
                    <div key={index} className="modal-doctor-item">
                      <div className="modal-doctor-avatar">
                        <i className="fas fa-user-md"></i>
                      </div>
                      <div className="modal-doctor-info flex-grow-1">
                        <h5>{doctor.name}</h5>
                        <div className="modal-doctor-specialty">{doctor.specialty}</div>
                        <div className="modal-doctor-schedule">
                          <small>{doctor.schedule}</small>
                          <span className={`badge ${doctor.status === 'Tersedia' ? 'bg-success' : 'bg-secondary'}`}>
                            {doctor.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <div className="modal-action-buttons w-100">
                  <a 
                    href="https://ilp.pkmcicalengkadtp.com/daftaronline/?page=cari&kode=P3204100101&simpus=CICALENGKA%20DTP&fbclid=PAT01DUANxPJFleHRuA2FlbQIxMAABp5UCy_5gqDW3o0z_W-8kRb48ws7EoDPv7kkCCH4rGd3qkGkS4xXqaJhoRyTW_aem_pCk-gdahGjNhj-xvc8aIaw" 
                    className="btn btn-success flex-fill" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-calendar-check me-2"></i>Daftar Poli Online
                  </a>
                  <button type="button" className="btn btn-outline-secondary flex-fill" onClick={closeModal}>
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kontak */}
      <section id="kontak" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Hubungi Kami</h2>
            <p className="section-subtitle">Kami siap melayani kebutuhan kesehatan Anda</p>
          </div>
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card h-100 contact-card animate-slide-up">
                <div className="card-body text-center">
                  <i className="fas fa-map-marker-alt fa-2x text-success mb-3"></i>
                  <h5>Alamat</h5>
                  <p>Jl. Raya Cicalengka No. 123, Kec. Cicalengka, Kab. Bandung, Jawa Barat 40395</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100 contact-card animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="card-body text-center">
                  <i className="fas fa-phone fa-2x text-success mb-3"></i>
                  <h5>Telepon</h5>
                  <p>(022) 1234567</p>
                  <p>081234567890 (WhatsApp)</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100 contact-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="card-body text-center">
                  <i className="fas fa-envelope fa-2x text-success mb-3"></i>
                  <h5>Email</h5>
                  <p>puskesmas.cicalengka@email.com</p>
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card h-100 contact-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
                <div className="card-body text-center">
                  <i className="fas fa-clock fa-2x text-success mb-3"></i>
                  <h5>Jam Operasional</h5>
                  <p>Senin - Jumat: 07.00 - 16.00</p>
                  <p>Sabtu: 07.00 - 14.00</p>
                  <p>UGD: 24 Jam</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Bootstrap JS */}
      <script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" 
        async
      ></script>
    </div>
  );
}