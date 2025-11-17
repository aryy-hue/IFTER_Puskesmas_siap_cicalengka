'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Data desa (sama dengan yang di script.js)
const dataDesa = [
  {
    id: 1,
    nama: "Desa Cicalengka Kulon",
    lat: -6.984948981921765,
    lng: 107.83652157538909,
    kegiatan: [
      {
        id: 1,
        nama: "Sosialisasi Kesehatan Reproduksi Remaja",
        tanggal: "2023-06-12",
        waktu: "09:00 - 11:00",
        status: "selesai",
        deskripsi: "Edukasi tentang kesehatan reproduksi bagi remaja di Desa Cicalengka Kulon"
      },
      // ... tambahkan kegiatan lainnya sesuai data asli
    ]
  },
  // ... tambahkan desa lainnya sesuai data asli
  {
    id: 7,
    nama: "Puskesmas Cicalengka",
    lat: -6.9862238061846975,
    lng: 107.83858829543657,
  }
];

export default function PetaInteraktif() {
  const [selectedDesa, setSelectedDesa] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'kegiatan' atau 'puskesmas'
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Format tanggal helper function
  const formatTanggal = (tanggal) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(tanggal).toLocaleDateString('id-ID', options);
  };

  // Custom icon untuk marker
  const createCustomIcon = (isPuskesmas = false) => {
    return L.divIcon({
      className: `custom-marker ${isPuskesmas ? 'puskesmas-marker' : 'desa-marker'}`,
      html: `
        <div class="marker-container">
          <i class="fas ${isPuskesmas ? 'fa-hospital' : 'fa-map-marker-alt'}"></i>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });
  };

  const handleMarkerClick = (desa) => {
    setSelectedDesa(desa);
    if (desa.id === 7) {
      setModalType('puskesmas');
    } else {
      setModalType('kegiatan');
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDesa(null);
    setModalType('');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const resetView = () => {
    // Reset view logic akan diimplementasikan dengan useMap hook nanti
    console.log('Reset view');
  };

  return (
    <>
      <section id="peta-interaktif" className="py-5">
        <div className="container-fluid">
          <div className="text-center mb-4">
            <h2 className="section-title">Peta Interaktif Wilayah Cicalengka</h2>
            <p className="section-subtitle">Klik pada marker desa untuk melihat kegiatan yang telah dan akan dilakukan</p>
          </div>
          
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    <i className="fas fa-map-marked-alt me-2"></i>Peta Desa di Wilayah Cicalengka
                  </h5>
                  <div className="map-controls">
                    <button className="btn btn-sm btn-light" onClick={resetView}>
                      <i className="fas fa-sync-alt me-1"></i>Reset Peta
                    </button>
                    <button className="btn btn-sm btn-light" onClick={toggleFullscreen}>
                      <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'} me-1`}></i>
                      {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                    </button>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className={`peta-container-large ${isFullscreen ? 'fullscreen' : ''}`}>
                    <MapContainer
                      center={[-6.986, 107.841]}
                      zoom={14}
                      style={{ height: '500px', width: '100%' }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      {dataDesa.map((desa) => (
                        <Marker
                          key={desa.id}
                          position={[desa.lat, desa.lng]}
                          icon={createCustomIcon(desa.id === 7)}
                          eventHandlers={{
                            click: () => handleMarkerClick(desa),
                          }}
                        >
                          <Popup>
                            <div className="marker-popup">
                              <h6>{desa.nama}</h6>
                              <p>{desa.kegiatan ? `${desa.kegiatan.length} kegiatan terdaftar` : 'Puskesmas Utama'}</p>
                              {desa.kegiatan ? (
                                <button 
                                  className="btn btn-success btn-sm w-100"
                                  onClick={() => handleMarkerClick(desa)}
                                >
                                  <i className="fas fa-eye me-1"></i>Lihat Kegiatan
                                </button>
                              ) : (
                                <button 
                                  className="btn btn-info btn-sm w-100"
                                  onClick={() => handleMarkerClick(desa)}
                                >
                                  <i className="fas fa-info-circle me-1"></i>Info Puskesmas
                                </button>
                              )}
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                    </MapContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-md-3 col-6 mb-3">
                      <div className="info-stat">
                        <i className="fas fa-map-marker-alt fa-2x text-success mb-2"></i>
                        <h4 className="text-success mb-1">5</h4>
                        <small className="text-muted">Desa Terlayani</small>
                      </div>
                    </div>
                    <div className="col-md-3 col-6 mb-3">
                      <div className="info-stat">
                        <i className="fas fa-check-circle fa-2x text-success mb-2"></i>
                        <h4 className="text-success mb-1">24</h4>
                        <small className="text-muted">Kegiatan Selesai</small>
                      </div>
                    </div>
                    <div className="col-md-3 col-6 mb-3">
                      <div className="info-stat">
                        <i className="fas fa-clock fa-2x text-warning mb-2"></i>
                        <h4 className="text-warning mb-1">16</h4>
                        <small className="text-muted">Kegiatan Mendatang</small>
                      </div>
                    </div>
                    <div className="col-md-3 col-6 mb-3">
                      <div className="info-stat">
                        <i className="fas fa-users fa-2x text-primary mb-2"></i>
                        <h4 className="text-primary mb-1">2,500+</h4>
                        <small className="text-muted">Warga Terlayani</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && selectedDesa && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className={`fas ${modalType === 'puskesmas' ? 'fa-hospital' : 'fa-tasks'} me-2`}></i>
                  {modalType === 'puskesmas' ? 'Puskesmas Cicalengka' : `Kegiatan di ${selectedDesa.nama}`}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                {modalType === 'puskesmas' ? (
                  <div className="puskesmas-info">
                    <div className="text-center mb-4">
                      <i className="fas fa-heartbeat fa-3x text-success mb-3"></i>
                      <h5 className="text-success">Puskesmas Cicalengka</h5>
                      <p className="text-muted">Pusat Layanan Kesehatan Masyarakat</p>
                    </div>
                    
                    <div className="info-section">
                      <h6 className="text-success"><i className="fas fa-clock me-2"></i>Jam Operasional</h6>
                      <ul className="list-unstyled ps-3">
                        <li><i className="fas fa-circle text-success me-2" style={{fontSize: '0.5rem'}}></i>Senin - Jumat: 07.00 - 16.00</li>
                        <li><i className="fas fa-circle text-success me-2" style={{fontSize: '0.5rem'}}></i>Sabtu: 07.00 - 14.00</li>
                        <li><i className="fas fa-circle text-success me-2" style={{fontSize: '0.5rem'}}></i>UGD: 24 Jam</li>
                      </ul>
                    </div>
                    
                    <div className="info-section">
                      <h6 className="text-success"><i className="fas fa-phone me-2"></i>Kontak</h6>
                      <ul className="list-unstyled ps-3">
                        <li><i className="fas fa-phone text-success me-2"></i>Telepon: (022) 1234567</li>
                        <li><i className="fab fa-whatsapp text-success me-2"></i>WhatsApp: 081234567890</li>
                        <li><i className="fas fa-envelope text-success me-2"></i>Email: puskesmas.cicalengka@email.com</li>
                      </ul>
                    </div>
                    
                    <div className="info-section">
                      <h6 className="text-success"><i className="fas fa-map-marker-alt me-2"></i>Alamat</h6>
                      <p className="ps-3">
                        <i className="fas fa-location-dot text-success me-2"></i>
                        Jl. Raya Cicalengka No. 123, Kec. Cicalengka, Kab. Bandung, Jawa Barat 40395
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="kegiatan-modal-list">
                    {selectedDesa.kegiatan?.map((kegiatan) => (
                      <div key={kegiatan.id} className={`kegiatan-modal-item ${kegiatan.status}`}>
                        <span className={`kegiatan-status badge ${kegiatan.status === 'selesai' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          <i className={`fas ${kegiatan.status === 'selesai' ? 'fa-check' : 'fa-clock'} me-1`}></i>
                          {kegiatan.status === 'selesai' ? 'Selesai' : 'Akan Datang'}
                        </span>
                        <h6 className="kegiatan-title">{kegiatan.nama}</h6>
                        <p className="kegiatan-description">{kegiatan.deskripsi}</p>
                        <div className="kegiatan-meta">
                          <div className="kegiatan-date">
                            <i className="far fa-calendar me-1"></i>
                            {formatTanggal(kegiatan.tanggal)}
                          </div>
                          <div className="kegiatan-time">
                            <i className="far fa-clock me-1"></i>
                            {kegiatan.waktu}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={closeModal}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}