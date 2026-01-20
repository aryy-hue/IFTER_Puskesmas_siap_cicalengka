'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SuperAdminLayout({ children }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const isActive = (href) => {
    if (!isMounted) return false
    return pathname === href
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* HEADER */}
      <header className="bg-success text-white py-3 shadow sticky-top">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            {/* Logo & Title */}
            <div className="d-flex align-items-center">
              <i className="fas fa-user-shield fa-2x me-3"></i>
              <div>
                <h1 className="h4 mb-0">SIAPCICALENGKA</h1>
                <small>Panel Super Admin</small>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="d-none d-lg-block">
              <ul className="navbar-nav d-flex flex-row gap-3">
                <li className="nav-item">
                  <Link
                    href="/superadmin"
                    className={`nav-link text-white ${isActive('/superadmin') ? 'active fw-bold' : ''}`}
                  >
                    <i className="fas fa-home me-2"></i>
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    href="/superadmin/approval-pegawai"
                    className={`nav-link text-white ${isActive('/superadmin/approval-pegawai') ? 'active fw-bold' : ''}`}
                  >
                    <i className="fas fa-user-check me-2"></i>
                    Approval Pegawai
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    href="/superadmin/approval-laporan"
                    className={`nav-link text-white ${isActive('/superadmin/approval-laporan') ? 'active fw-bold' : ''}`}
                  >
                    <i className="fas fa-file-signature me-2"></i>
                    Approval Laporan
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    href="/superadmin/approval-kegiatan"
                    className={`nav-link text-white ${isActive('/superadmin/approval-kegiatan') ? 'active fw-bold' : ''}`}
                  >
                    <i className="fas fa-calendar-check me-2"></i>
                    Approval Kegiatan
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/login" className="nav-link text-white">
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Logout
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Mobile Button */}
            <div className="d-lg-none">
              <button
                className="btn btn-outline-light"
                onClick={() => setMobileMenuOpen(true)}
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="flex-grow-1 bg-light">
        <div className="container-fluid py-4">
          {children}
        </div>
      </main>

      {/* MOBILE MENU */}
      {isMounted && mobileMenuOpen && (
        <div
          className="offcanvas offcanvas-end show"
          style={{ visibility: 'visible' }}
        >
          <div className="offcanvas-header bg-success text-white">
            <h5>Menu Super Admin</h5>
            <button
              className="btn-close btn-close-white"
              onClick={() => setMobileMenuOpen(false)}
            ></button>
          </div>

          <div className="offcanvas-body">
            <Link
              href="/superadmin"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>

            <Link
              href="/superadmin/approval-pegawai"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Approval Pegawai
            </Link>

            <Link
              href="/superadmin/approval-laporan"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Approval Laporan
            </Link>

            <Link
              href="/superadmin/approval-kegiatan"
              className="nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              Approval Kegiatan
            </Link>

            <Link
              href="/login"
              className="nav-link text-danger"
              onClick={() => setMobileMenuOpen(false)}
            >
              Logout
            </Link>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-dark text-white text-center py-3">
        <small>© 2025 SIAPCicalengka - Panel Super Admin</small>
      </footer>
    </div>
  )
}
