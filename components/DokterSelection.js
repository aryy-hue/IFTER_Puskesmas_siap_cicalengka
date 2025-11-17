'use client'

import { useState } from 'react'
import poliData from '../data/poli-data'

export default function DokterSection() {
  const [selectedPoli, setSelectedPoli] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const handlePoliClick = (poli) => {
    setSelectedPoli(poli)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedPoli(null)
  }

  return (
    <>
      <section id="dokter" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-title">Dokter Hari Ini</h2>
            <p className="section-subtitle">Tim medis profesional siap melayani Anda</p>
          </div>
          <div className="row">
            {poliData.map((poli) => (
              <div key={poli.id} className="col-md-6 col-lg-4 mb-4">
                <div 
                  className="card poli-card h-100 cursor-pointer"
                  onClick={() => handlePoliClick(poli)}
                >
                  <div className="card-body text-center">
                    <div className="poli-icon">
                      <i className={poli.icon}></i>
                    </div>
                    <h5 className="card-title text-success">{poli.name}</h5>
                    <p className="card-text text-muted">{poli.description}</p>
                    <div className="mt-3">
                      <span className="badge bg-success">
                        {poli.doctors.length} Dokter Tersedia
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
      {showModal && selectedPoli && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  Daftar Dokter - {selectedPoli.name}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  {selectedPoli.doctors.map((doctor, index) => (
                    <div key={index} className="col-md-6 mb-3">
                      <div className="card">
                        <div className="card-body">
                          <h6 className="card-title">{doctor.name}</h6>
                          <p className="card-text text-muted mb-1">
                            <small>{doctor.specialization}</small>
                          </p>
                          <p className="card-text">
                            <small className="text-success">
                              <i className="fas fa-clock me-1"></i>
                              {doctor.schedule}
                            </small>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <div className="modal-action-buttons w-100">
                  <a 
                    href="https://ilp.pkmcicalengkadtp.com/daftaronline/" 
                    className="btn btn-success flex-fill" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className="fas fa-calendar-check me-2"></i>Daftar Poli Online
                  </a>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary flex-fill" 
                    onClick={closeModal}
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
  )
}
