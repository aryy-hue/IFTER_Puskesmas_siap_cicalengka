'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function HeaderAfterLogin() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef(null)

  // Contoh nama user (nanti ambil dari token / session)
  const userName = 'Pengguna'

  const handleLogout = () => {
    // localStorage.removeItem('token')
    router.push('/login')
  }

  // 🔒 Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <>
      <header
        className="bg-success text-white py-3 shadow sticky-top"
        style={{ overflow: 'visible' }}
      >
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">

            {/* LOGO */}
            <div className="d-flex align-items-center">
              <div className="logo-container me-3">
                <i className="fas fa-heartbeat logo-icon"></i>
              </div>
              <div>
                <h1 className="h4 mb-0 fw-bold">SIAPCICALENGKA</h1>
                <small className="text-light">Puskesmas Cicalengka</small>
              </div>
            </div>

            {/* DESKTOP NAV */}
            <nav className="d-none d-lg-block">
              <ul className="navbar-nav d-flex flex-row align-items-center">

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

                {/* MENU AKUN */}
                <li
                  className="nav-item ms-3 position-relative"
                  ref={dropdownRef}
                >
                  <button
                    className="btn btn-light text-success fw-bold rounded-pill px-4"
                    onClick={(e) => {
                      e.stopPropagation()
                      setDropdownOpen(!dropdownOpen)
                    }}
                  >
                    <i className="fas fa-user-circle me-1"></i>
                    {userName}
                  </button>

                  {dropdownOpen && (
                    <ul
                      className="dropdown-menu show"
                      style={{
                        position: 'absolute',
                        top: '100%',
                        right: 0,
                        marginTop: '8px',
                        zIndex: 9999,
                        minWidth: '200px',
                        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                        borderRadius: '8px'
                      }}
                    >

                      <li>
                        <Link
                          className="dropdown-item"
                          href="/user/profil"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <i className="fas fa-user me-2"></i>Profil
                        </Link>
                      </li>

                      <li><hr className="dropdown-divider" /></li>

                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={handleLogout}
                        >
                          <i className="fas fa-sign-out-alt me-2"></i>Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </li>
              </ul>
            </nav>

            {/* MOBILE BUTTON */}
            <div className="d-lg-none">
              <button
                className="btn btn-outline-light border-0"
                onClick={() => setMobileMenuOpen(true)}
              >
                <i className="fas fa-bars fa-lg"></i>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div
          className="offcanvas offcanvas-end show"
          style={{ visibility: 'visible', position: 'fixed', zIndex: 1050 }}
        >
          <div className="offcanvas-header bg-success text-white">
            <h5 className="mb-0 fw-bold">Menu Akun</h5>
            <button
              className="btn-close btn-close-white"
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>

          <div className="offcanvas-body">
            <nav className="navbar-nav">
              <Link className="nav-link" href="/" onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-home me-2"></i>Beranda
              </Link>
              <Link className="nav-link" href="/peta" onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-map-marked-alt me-2"></i>Peta Interaktif
              </Link>

              <hr />
              <Link className="nav-link" href="/user/profil" onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-user me-2"></i>Profil
              </Link>

              <button className="btn btn-danger mt-3" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt me-2"></i>Logout
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
