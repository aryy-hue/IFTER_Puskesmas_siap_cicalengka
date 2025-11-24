'use client'

import { useState, useEffect } from 'react'
import TambahKegiatan from '../../../../components/TambahKegiatan';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalKegiatan: 0,
    totalLaporan: 0,
    totalPasien: 0
  })

  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Simulasi data statistik
    setStats({
      totalKegiatan: 15,
      totalLaporan: 8,
      totalPasien: 124
    })
  }, [])

  const handleTambahKegiatan = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleSuccess = () => {
    // Refresh data atau tampilkan notifikasi
    console.log('Kegiatan berhasil ditambahkan')
    // Bisa tambahkan toast notification di sini
  }

  return (
    <div>
      <h1 className="h3 mb-4">Dashboard Admin</h1>
      
      {/* Statistik Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{stats.totalKegiatan}</h4>
                  <p className="mb-0">Total Kegiatan</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-calendar-alt fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{stats.totalLaporan}</h4>
                  <p className="mb-0">Total Laporan</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-file-alt fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <h4>{stats.totalPasien}</h4>
                  <p className="mb-0">Total Pasien</p>
                </div>
                <div className="align-self-center">
                  <i className="fas fa-users fa-2x"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={handleTambahKegiatan}
                  >
                    <i className="fas fa-plus me-2"></i>Tambah Kegiatan
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/laporan" className="btn btn-outline-success w-100">
                    <i className="fas fa-file me-2"></i>Buat Laporan
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/riwayat-pasien" className="btn btn-outline-info w-100">
                    <i className="fas fa-search me-2"></i>Cari Pasien
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-warning w-100">
                    <i className="fas fa-print me-2"></i>Cetak Laporan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Kegiatan */}
      <TambahKegiatan 
        show={showModal}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </div>
  )
}