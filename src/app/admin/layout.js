'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }) {
  const pathname = usePathname()

  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: 'fas fa-tachometer-alt'
    },
    {
      name: 'Kelola Kegiatan',
      href: '/admin/kegiatan',
      icon: 'fas fa-calendar-alt'
    },
    {
      name: 'Laporan',
      href: '/admin/laporan',
      icon: 'fas fa-file-alt'
    },
    {
      name: 'Riwayat Pasien',
      href: '/admin/riwayat-pasien',
      icon: 'fas fa-history'
    }
  ]

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header dengan Navigation */}
      <header className="bg-success text-white shadow">
        {/* Top Header */}
        <div className="py-2">
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="logo-container me-3">
                  <i className="fas fa-heartbeat logo-icon"></i>
                </div>
                <div>
                  <h1 className="h4 mb-0 fw-bold">SIAPCICALENGKA</h1>
                  <small className="text-light">Puskesmas Cicalengka - Admin Panel</small>
                </div>
              </div>
              
              <div className="d-flex align-items-center">
                <span className="me-3 d-none d-md-block">
                  <i className="fas fa-user-circle me-1"></i>Halo, Admin!
                </span>
                <Link href="/" className="btn btn-outline-light btn-sm">
                  <i className="fas fa-sign-out-alt me-1"></i>Logout
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="bg-success-dark">
          <div className="container">
            <div className="nav-scroller">
              <ul className="nav nav-underline">
                {menuItems.map((item) => (
                  <li key={item.href} className="nav-item">
                    <Link
                      href={item.href}
                      className={`nav-link text-white ${pathname === item.href ? 'active' : ''}`}
                    >
                      <i className={`${item.icon} me-2`}></i>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 bg-light">
        <div className="container-fluid py-4">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-auto">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="d-flex align-items-center mb-3">
                <div className="logo-container me-3">
                  <i className="fas fa-heartbeat logo-icon"></i>
                </div>
                <div>
                  <h5 className="mb-0">SIAPCicalengka</h5>
                  <small className="text-light">Puskesmas Cicalengka</small>
                </div>
              </div>
              <p>Melayani dengan hati untuk kesehatan masyarakat.</p>
              <div className="social-links">
                <a href="#" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
                <a href="#" className="text-white me-3"><i className="fab fa-instagram"></i></a>
                <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-white"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
            <div className="col-md-3 mb-3 mb-md-0">
              <h5>Menu Admin</h5>
              <ul className="list-unstyled">
                <li><Link href="/admin/kegiatan" className="text-white text-decoration-none">Kelola Kegiatan</Link></li>
                <li><Link href="/admin/laporan" className="text-white text-decoration-none">Buat Laporan</Link></li>
                <li><Link href="/admin/riwayat-pasien" className="text-white text-decoration-none">Riwayat Pasien</Link></li>
                <li><Link href="/" className="text-white text-decoration-none">Kembali ke Beranda</Link></li>
              </ul>
            </div>
            <div className="col-md-3">
              <h5>Layanan</h5>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white text-decoration-none">Poli Umum</a></li>
                <li><a href="#" className="text-white text-decoration-none">Poli Anak</a></li>
                <li><a href="#" className="text-white text-decoration-none">Poli Gigi</a></li>
                <li><a href="#" className="text-white text-decoration-none">UGD</a></li>
              </ul>
            </div>
          </div>
          <hr className="my-4" />
          <div className="text-center">
            <p className="mb-0">&copy; 2023 SIAPCicalengka - Puskesmas Cicalengka. Semua hak dilindungi.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .bg-success-dark {
          background-color: #146c43 !important;
        }
        
        .nav-scroller {
          position: relative;
          z-index: 2;
          height: 2.75rem;
          overflow-y: hidden;
        }
        
        .nav-scroller .nav {
          display: flex;
          flex-wrap: nowrap;
          padding-bottom: 1rem;
          margin-top: -1px;
          overflow-x: auto;
          text-align: center;
          white-space: nowrap;
          -webkit-overflow-scrolling: touch;
        }
        
        .nav-link {
          padding: 0.75rem 1rem;
          border-bottom: 3px solid transparent;
          transition: all 0.3s ease;
        }
        
        .nav-link:hover {
          border-bottom-color: rgba(255, 255, 255, 0.5);
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .nav-link.active {
          border-bottom-color: #fff;
          background-color: rgba(255, 255, 255, 0.1);
          font-weight: 600;
        }
      `}</style>
    </div>
  )
}
