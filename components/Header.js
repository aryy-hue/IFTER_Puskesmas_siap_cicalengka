'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
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
            
            {/* Desktop Navigation */}
            <nav className="d-none d-lg-block">
              <ul className="navbar-nav nav-desktop d-flex flex-row">
                <li className="nav-item">
                  <Link className="nav-link active" href="/">
                    <i className="fas fa-home me-1"></i>Beranda
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/peta">
                    <i className="fas fa-map-marked-alt me-1"></i>Peta Interaktif
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link login-btn" href="/login">
                    <i className="fas fa-user me-1"></i>Login
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

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="offcanvas offcanvas-end show" tabIndex="-1" style={{visibility: 'visible', position: 'fixed'}}>
          <div className="offcanvas-header bg-success text-white">
            <div className="d-flex align-items-center">
              <div className="logo-container me-3">
                <i className="fas fa-heartbeat logo-icon"></i>
              </div>
              <div>
                <h5 className="offcanvas-title mb-0 fw-bold">SIAPCicalengka</h5>
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
                <Link className="nav-link mobile-nav-item" href="/" onClick={() => setMobileMenuOpen(false)}>
                  <div className="nav-icon">
                    <i className="fas fa-home"></i>
                  </div>
                  <div className="nav-text">
                    <span>Beranda</span>
                    <small className="text-muted">Halaman utama</small>
                  </div>
                </Link>
                <Link className="nav-link mobile-nav-item" href="/peta" onClick={() => setMobileMenuOpen(false)}>
                  <div className="nav-icon">
                    <i className="fas fa-map-marked-alt"></i>
                  </div>
                  <div className="nav-text">
                    <span>Peta Interaktif</span>
                    <small className="text-muted">Kegiatan puskesmas</small>
                  </div>
                </Link>
              </div>

              <div className="nav-section">
                <h6 className="text-muted mb-3 px-3">AKUN</h6>
                <Link className="nav-link mobile-nav-item login-mobile" href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <div className="nav-icon">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="nav-text">
                    <span>Login</span>
                    <small className="text-muted">Masuk Akun</small>
                  </div>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
