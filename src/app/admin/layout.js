'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Hindari hydration error dengan menunggu component mount di client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const menuItems = [
    {
      name: 'Beranda',
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

  // Helper function untuk cek active menu
  const isActive = (href) => {
    if (!isMounted) return false
    return pathname === href
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <header className="bg-success text-white py-3 shadow sticky-top">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="logo-container me-3">
                <i className="fas fa-heartbeat logo-icon"></i>
              </div>
              <div>
                <h1 className="h4 mb-0 fw-bold">SIAPCICALENGKA</h1>
                <small className="text-light">Puskesmas Cicalengka</small>
              </div>
            </div>
            
            {/* Desktop Navigation - Menu Admin */}
            <nav className="d-none d-lg-block">
              <ul className="navbar-nav d-flex flex-row gap-3">
                <li className="nav-item">
                  <Link 
                    className={`nav-link text-white d-flex align-items-center py-2 px-3 rounded ${
                      isActive('/admin') ? 'active' : ''
                    }`} 
                    href="/admin"
                  >
                    <i className="fas fa-tachometer-alt me-2"></i>
                    <span>Beranda</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link text-white d-flex align-items-center py-2 px-3 rounded ${
                      isActive('/admin/kegiatan') ? 'active' : ''
                    }`} 
                    href="/admin/kegiatan"
                  >
                    <i className="fas fa-calendar-alt me-2"></i>
                    <span>Kelola Kegiatan</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className={`nav-link text-white d-flex align-items-center py-2 px-3 rounded ${
                      isActive('/admin/laporan') ? 'active' : ''
                    }`} 
                    href="/admin/laporan"
                  >
                    <i className="fas fa-file-alt me-2"></i>
                    <span>Laporan</span>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white d-flex align-items-center py-2 px-3 rounded login-btn" href="/login">
                    <i className="fas fa-sign-out-alt me-2"></i>
                    <span>Logout</span>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Mobile Menu Button */}
            <div className="d-lg-none">
              <button 
                className="btn btn-outline-light border-0" 
                type="button"
                onClick={() => setMobileMenuOpen(true)}
              >
                <i className="fas fa-bars fa-lg"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow-1 bg-light">
        <div className="container-fluid py-4">
          {children}
        </div>
      </main>

{/* Mobile Menu - hanya render di client setelah mount */}
{isMounted && mobileMenuOpen && (
  <div className="offcanvas offcanvas-end show" tabIndex="-1" style={{visibility: 'visible', position: 'fixed'}}>
    <div className="offcanvas-header bg-success text-white">
      <div className="d-flex align-items-center">
        <div className="logo-container me-3">
          <i className="fas fa-heartbeat logo-icon"></i>
        </div>
        <div>
          <h5 className="offcanvas-title mb-0 fw-bold text-white">SIAPCicalengka</h5>
          <small className="text-light">Puskesmas Cicalengka</small>
        </div>
      </div>
      <button 
        type="button" 
        className="btn-close btn-close-white" 
        onClick={() => setMobileMenuOpen(false)}
      ></button>
    </div>
    <div className="offcanvas-body">
      <nav className="navbar-nav">
        <div className="nav-section mb-4">
          <h6 className="text-muted mb-3 px-3">MENU ADMIN</h6>       
          {/* Menu Admin Tambahan */}
          <Link className="nav-link mobile-nav-item" href="/admin/kegiatan" onClick={() => setMobileMenuOpen(false)}>
            <div className="nav-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="nav-text">
              <span>Kelola Kegiatan</span>
              <small className="text-muted">Manajemen kegiatan</small>
            </div>
          </Link>
          
          <Link className="nav-link mobile-nav-item" href="/admin/laporan" onClick={() => setMobileMenuOpen(false)}>
            <div className="nav-icon">
              <i className="fas fa-file-alt"></i>
            </div>
            <div className="nav-text">
              <span>Buat Laporan</span>
              <small className="text-muted">Buat laporan baru</small>
            </div>
          </Link>
          
          <Link className="nav-link mobile-nav-item" href="/admin/riwayat-pasien" onClick={() => setMobileMenuOpen(false)}>
            <div className="nav-icon">
              <i className="fas fa-history"></i>
            </div>
            <div className="nav-text">
              <span>Riwayat Pasien</span>
              <small className="text-muted">Data riwayat pasien</small>
            </div>
          </Link>
        </div>

        <div className="nav-section">
          <h6 className="text-muted mb-3 px-3">AKUN</h6>
          <Link className="nav-link mobile-nav-item login-mobile" href="/login" onClick={() => setMobileMenuOpen(false)}>
            <div className="nav-icon">
              <i className="fas fa-sign-out-alt"></i>
            </div>
            <div className="nav-text">
              <span>Logout</span>
              <small className="text-muted">Keluar Akun</small>
            </div>
          </Link>
        </div>
      </nav>
    </div>
  </div>
)}

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
    </div>
  )
}