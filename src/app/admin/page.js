'use client'

import Link from 'next/link'

export default function AdminDashboard() {

const quickActions = [
  {
    title: 'Kelola Jadwal',
    description: 'Kelola data dan jadwal dokter',
    icon: 'fas fa-user-clock',
    href: '/admin/kelola-dokter',
    color: 'primary'
  },
    {
    title: 'Kelola Poli',
    description: 'Kelola data poli layanan',
    icon: 'fas fa-hospital',
    href: '/admin/kelola-poli',
    color: 'secondary'
  },
  {
    title: 'Kelola Lokasi',
    description: 'Kelola data lokasi puskesmas',
    icon: 'fas fa-map-marker-alt',
    href: '/admin/kelola-lokasi',
    color: 'warning'
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
      
      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 py-3">
              <h5 className="card-title mb-0 text-white">
                <i className="fas fa-bolt me-2"></i>Quick Actions
              </h5>
                <p className="text-white mb-0">
                  Akses cepat ke fitur admin
                </p>
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
