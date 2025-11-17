"use client";

import { useState } from 'react';

export default function DokterSelection() {
  const [showModal, setShowModal] = useState(false);
  const [selectedPoli, setSelectedPoli] = useState('');

  const poliData = [
    { id: 1, name: 'Poli Umum', icon: 'user-md', doctors: ['Dr. Ahmad Wijaya', 'Dr. Siti Rahma'] },
    { id: 2, name: 'Poli Anak', icon: 'baby', doctors: ['Dr. Maya Sari', 'Dr. Budi Santoso'] },
    { id: 3, name: 'Poli Gigi', icon: 'tooth', doctors: ['Dr. Rina Melati', 'Dr. Agus Pratama'] },
    { id: 4, name: 'Poli Kandungan', icon: 'baby-carriage', doctors: ['Dr. Diana Putri'] },
    { id: 5, name: 'Poli Mata', icon: 'eye', doctors: ['Dr. Farid Hidayat'] },
    { id: 6, name: 'UGD', icon: 'ambulance', doctors: ['Dr. Emergency Team'] }
  ];

  const openModal = (poliName) => {
    setSelectedPoli(poliName);
    setShowModal(true);
  };

  return (
    <>
      <div className="row" id="poli-container">
        {poliData.map((poli) => (
          <div key={poli.id} className="col-md-4 mb-4">
            <div 
              className="card h-100 cursor-pointer"
              onClick={() => openModal(poli.name)}
              style={{cursor: 'pointer', transition: 'transform 0.2s'}}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div className="card-body text-center">
                <i className={`fas fa-${poli.icon} fa-3x text-success mb-3`}></i>
                <h5 className="card-title">{poli.name}</h5>
                <p className="card-text">Klik untuk lihat jadwal dokter</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal untuk Daftar Dokter Poli */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">Daftar Dokter - {selectedPoli}</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div id="modalDoctorList">
                  {poliData
                    .find(poli => poli.name === selectedPoli)
                    ?.doctors.map((doctor, index) => (
                      <div key={index} className="doctor-item mb-3 p-3 border rounded">
                        <div className="d-flex align-items-center">
                          <i className="fas fa-user-md text-success me-3"></i>
                          <div>
                            <h6 className="mb-1">{doctor}</h6>
                            <small className="text-muted">Spesialis {selectedPoli}</small>
                          </div>
                        </div>
                      </div>
                    ))
                  }
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
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary flex-fill" 
                    onClick={() => setShowModal(false)}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}