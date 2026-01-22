'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalKegiatan: 0,
    totalLaporan: 0,
    totalPasien: 0
  })

  useEffect(() => {
    // Load data dari localStorage untuk statistik
    const savedKegiatan = localStorage.getItem('kegiatanPuskesmas')
    const savedLaporan = localStorage.getItem('laporanPuskesmas')
    
    setStats({
      totalKegiatan: savedKegiatan ? JSON.parse(savedKegiatan).length : 0,
      totalLaporan: savedLaporan ? JSON.parse(savedLaporan).length : 0,
      totalPasien: 124 // Sample data
    })
  }, [])

  const quickActions = [
    {
      title: 'Kelola Dokter',
      description: 'Kelola data dan jadwal dokter',
      icon: 'fas fa-user-md',
      href: '/admin/kelola-dokter',
      color: 'primary'
    },
    {
      title: 'Tambah Kegiatan',
      description: 'Buat kegiatan baru puskesmas',
      icon: 'fas fa-calendar-plus',
      href: '/admin/kegiatan',
      color: 'primary'
    },
    {
      title: 'Buat Laporan',
      description: 'Buat laporan kegiatan',
      icon: 'fas fa-file-medical',
      href: '/admin/laporan',
      color: 'success'
    },
    {
      title: 'Riwayat Pasien',
      description: 'Lihat riwayat kunjungan pasien',
      icon: 'fas fa-user-friends',
      href: '/admin/riwayat-pasien',
      color: 'info'
    },
    {
      title: 'Cetak Laporan',
      description: 'Cetak laporan kegiatan',
      icon: 'fas fa-print',
      href: '/admin/laporan',
      color: 'warning'
    }
  ]

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 text-success">Dashboard Admin</h1>
          <p className="text-muted mb-0">Selamat datang di panel admin Puskesmas Cicalengka</p>
        </div>
        <div className="d-none d-md-block">
          <span className="badge bg-success">
            <i className="fas fa-circle me-1"></i>Online
          </span>
        </div>
      </div>
      
      {/* Statistik Cards */}
      <div className="row mb-5">
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="text-primary mb-0">{stats.totalKegiatan}</h3>
                  <p className="text-muted mb-0">Total Kegiatan</p>
                </div>
                <div className="bg-primary bg-opacity-10 rounded-circle p-3">
                  <i className="fas fa-calendar-alt fa-2x text-primary"></i>
                </div>
              </div>
              <div className="mt-3">
                <small className="text-success">
                  <i className="fas fa-arrow-up me-1"></i>
                  {stats.totalKegiatan > 0 ? 'Aktif' : 'Belum ada kegiatan'}
                </small>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="text-success mb-0">{stats.totalLaporan}</h3>
                  <p className="text-muted mb-0">Total Laporan</p>
                </div>
                <div className="bg-success bg-opacity-10 rounded-circle p-3">
                  <i className="fas fa-file-alt fa-2x text-success"></i>
                </div>
              </div>
              <div className="mt-3">
                <small className="text-success">
                  <i className="fas fa-arrow-up me-1"></i>
                  {stats.totalLaporan > 0 ? 'Terkumpul' : 'Belum ada laporan'}
                </small>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="text-info mb-0">{stats.totalPasien}</h3>
                  <p className="text-muted mb-0">Total Pasien</p>
                </div>
                <div className="bg-info bg-opacity-10 rounded-circle p-3">
                  <i className="fas fa-users fa-2x text-info"></i>
                </div>
              </div>
              <div className="mt-3">
                <small className="text-success">
                  <i className="fas fa-arrow-up me-1"></i>
                  Terdaftar
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="card-title mb-0 text-white">
                <i className="fas fa-bolt me-2"></i>Quick Actions
              </h5>
              <p className="text-muted mb-0">Akses cepat ke fitur admin</p>
            </div>
            <div className="card-body">
              <div className="row">
                {quickActions.map((action, index) => (
                  <div key={index} className="col-md-6 col-lg-4 mb-3">
                    <Link 
                      href={action.href} 
                      className="card action-card h-100 text-decoration-none border-0 shadow-sm"
                    >
                      <div className="card-body text-center p-4">
                        <div className={`text-${action.color} mb-3`}>
                          <i className={`${action.icon} fa-3x`}></i>
                        </div>
                        <h6 className="card-title text-dark">{action.title}</h6>
                        <p className="card-text text-muted small">{action.description}</p>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .action-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        
        .action-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
      `}</style>
    </div>
  )
}
