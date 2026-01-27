'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [isClient, setIsClient] = useState(false) // Track client-side hydration
  const router = useRouter()
  const pathname = usePathname()

  // Initialize client-side state
  useEffect(() => {
    setIsClient(true)
    
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    if (token && userData) {
      setIsLoggedIn(true)
      try {
        const parsedUser = JSON.parse(userData)
        
        // Debug log
        console.log("Data User Login:", parsedUser)
        
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
        localStorage.removeItem('token')
        setIsLoggedIn(false)
      }
    }
  }, [])

  // Update state when pathname changes (user might have logged in/out on another page)
  useEffect(() => {
    if (isClient) {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        setIsLoggedIn(true)
        try {
          setUser(JSON.parse(userData))
        } catch (error) {
          console.error('Error parsing user data:', error)
        }
      } else {
        setIsLoggedIn(false)
        setUser(null)
      }
    }
  }, [pathname, isClient])

  const handleLogout = () => {
    // Hapus data dari localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
    // Update state
    setIsLoggedIn(false)
    setUser(null)
    setProfileOpen(false)
    
    // Tutup mobile menu jika terbuka
    setMobileMenuOpen(false)
    
    // Redirect ke halaman login
    router.push('/login')
  }

  // Show loading state during initial render to avoid hydration mismatch
  if (!isClient) {
    return (
      <header className="bg-success text-white py-3 shadow sticky-top">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="logo-container me-3">
                <i className="fas fa-heartbeat logo-icon"></i>
              </div>
              <div>
                <h1 className="h4 mb-0 fw-bold">SIAPCicalengka</h1>
                <small className="text-light">Puskesmas Cicalengka</small>
              </div>
            </div>
            
            {/* Desktop Navigation - Skeleton */}
            <nav className="d-none d-lg-block">
              <div className="d-flex align-items-center">
                <div className="placeholder-glow">
                  <div className="placeholder col-6"></div>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
    )
  }

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
                <h1 className="h4 mb-0 fw-bold">SIAPCicalengka</h1>
                <small className="text-light">Puskesmas Cicalengka</small>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="d-none d-lg-block">
              <ul className="navbar-nav nav-desktop d-flex flex-row align-items-center">
                {/* MENU BERANDA */}
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${pathname === '/' ? 'active' : ''}`} 
                    href="/"
                  >
                    <i className="fas fa-home me-1"></i>Beranda
                  </Link>
                </li>

                {/* MENU PETA INTERAKTIF */}
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${pathname === '/peta' ? 'active' : ''}`} 
                    href="/peta"
                  >
                    <i className="fas fa-map-marked-alt me-1"></i>Pelayanan Luar Gedung
                  </Link>
                </li>
                
                {isLoggedIn && user ? (
                  <li className="nav-item position-relative ms-3">
                    <button
                      className="btn btn-light text-success fw-bold rounded-pill"
                      onClick={() => setProfileOpen(!profileOpen)}
                    >
                      <i className="fas fa-user-circle me-1"></i>
                      {user?.full_name || user?.name || user?.username || 'Dokter'}
                    </button>

                    {profileOpen && (
                      <div
                        className="dropdown-menu dropdown-menu-end show mt-2 shadow"
                        style={{ position: 'absolute', right: 0, minWidth: '220px' }}
                      >
                        <div className="px-3 py-2">
                          <small className="text-muted d-block">Nama Akun:</small>
                          <span className="fw-bold">{user?.name}</span>
                        </div>
                        <hr className="dropdown-divider" />
                        <button
                          className="dropdown-item text-danger"
                          onClick={handleLogout}
                        >
                          <i className="fas fa-sign-out-alt me-2"></i>
                          Logout
                        </button>
                      </div>
                    )}
                  </li>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link login-btn" href="/login">
                        <i className="fas fa-user me-1"></i>Login
                      </Link>
                    </li>
                    <li className="nav-item ms-2">
                      <Link className="btn btn-light text-success fw-bold rounded-pill px-4" href="/register/pasien">
                        <i className="fas fa-user-plus me-1"></i>Daftar
                      </Link>
                    </li>
                  </>
                )}
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
                    <span>Pelayanan Luar Gedung</span>
                    <small className="text-muted">Kegiatan puskesmas</small>
                  </div>
                </Link>
              </div>

              {isLoggedIn && user ? (
                <div className="nav-section">
                  {/* Profile User di Mobile */}
                  <div className="user-profile-mobile mb-4 p-3 bg-light rounded">
                    <div className="d-flex align-items-center">
                      <div className="user-avatar-mobile me-3">
                        <i className="fas fa-user-circle fa-2x text-success"></i>
                      </div>
                      <div>
                        <div className="fw-bold text-dark">{user?.full_name || user?.name || user?.username || 'User'}</div>
                        <div className="text-muted small">
                          {user?.role || 'Pasien'}
                        </div>
                      </div>
                    </div>
                  </div>
                                    
                  <hr className="my-3" />
                  
                  <button 
                    className="nav-link mobile-nav-item text-danger w-100 text-start" 
                    onClick={handleLogout}
                    style={{ background: 'none', border: 'none' }}
                  >
                    <div className="nav-icon">
                      <i className="fas fa-sign-out-alt"></i>
                    </div>
                    <div className="nav-text">
                      <span>Logout</span>
                      <small className="text-muted">Keluar dari akun</small>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="nav-section">
                  <h6 className="text-muted mb-3 px-3">AKUN</h6>
                  <Link className="nav-link mobile-nav-item login-mobile" href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <div className="nav-icon">
                      <i className="fas fa-sign-in-alt"></i>
                    </div>
                    <div className="nav-text">
                      <span>Login</span>
                      <small className="text-muted">Masuk Akun</small>
                    </div>
                  </Link>
                  
                  <Link className="nav-link mobile-nav-item" href="/register/pasien" onClick={() => setMobileMenuOpen(false)}>
                    <div className="nav-icon">
                      <i className="fas fa-user-plus"></i>
                    </div>
                    <div className="nav-text">
                      <span>Daftar Akun</span>
                      <small className="text-muted">Buat akun baru</small>
                    </div>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}