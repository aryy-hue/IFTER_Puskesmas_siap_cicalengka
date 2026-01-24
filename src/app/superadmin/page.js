'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SuperAdminDashboard() {
  // Statistik khusus approval (dummy dulu, bisa disambung API)
  const [stats] = useState({
    pendingUser: 5,
    pendingKegiatan: 3,
    pendingLaporan: 4,
    pendingIzin: 2
  })

  const quickActions = [
    {
      title: 'Approval Akun Karyawan',
      description: 'Setujui atau tolak pendaftaran akun karyawan',
      icon: 'fas fa-user-check',
      href: '/superadmin/approval-akun',
      color: 'primary'
    },
    {
      title: 'Approval Kegiatan',
      description: 'Persetujuan kegiatan yang diajukan admin',
      icon: 'fas fa-calendar-check',
      href: '/superadmin/approval-kegiatan',
      color: 'success'
    },
    {
      title: 'Approval Laporan',
      description: 'Validasi laporan kegiatan',
      icon: 'fas fa-file-signature',
      href: '/superadmin/approval-laporan',
      color: 'info'
    },
    {
      title: 'Approval Izin',
      description: 'Izin sakit / pulang cepat karyawan',
      icon: 'fas fa-notes-medical',
      href: '/superadmin/approval-izin',
      color: 'warning'
    }
  ]

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 text-success">Dashboard Super Admin</h1>
          <p className="text-muted mb-0">
            Panel persetujuan & kontrol penuh sistem Puskesmas
          </p>
        </div>
        <span className="badge bg-success">
          <i className="fas fa-circle me-1"></i>Online
        </span>
      </div>

      {/* STATISTIK APPROVAL */}
      <div className="row mb-5">
        {[
          {
            label: 'Akun Karyawan Pending',
            value: stats.pendingUser,
            icon: 'user-clock',
            color: 'primary'
          },
          {
            label: 'Kegiatan Pending',
            value: stats.pendingKegiatan,
            icon: 'calendar-times',
            color: 'success'
          },
          {
            label: 'Laporan Pending',
            value: stats.pendingLaporan,
            icon: 'file-alt',
            color: 'info'
          },
          {
            label: 'Izin Pending',
            value: stats.pendingIzin,
            icon: 'notes-medical',
            color: 'warning'
          }
        ].map((item, index) => (
          <div key={index} className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h3 className={`text-${item.color} mb-0`}>
                      {item.value}
                    </h3>
                    <p className="text-muted mb-0">{item.label}</p>
                  </div>
                  <div
                    className={`bg-${item.color} bg-opacity-10 rounded-circle p-3`}
                  >
                    <i
                      className={`fas fa-${item.icon} fa-2x text-${item.color}`}
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="mb-3">
                <i className="fas fa-bolt me-2"></i>Approval Menu
              </h5>
              <div className="row">
                {quickActions.map((action, index) => (
                  <div key={index} className="col-md-6 col-lg-3 mb-3">
                    <Link
                      href={action.href}
                      className="card action-card h-100 text-decoration-none border-0 shadow-sm"
                    >
                      <div className="card-body text-center p-4">
                        <div className={`text-${action.color} mb-3`}>
                          <i className={`${action.icon} fa-3x`}></i>
                        </div>
                        <h6 className="card-title text-dark">
                          {action.title}
                        </h6>
                        <p className="card-text text-muted small">
                          {action.description}
                        </p>
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
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  )
}