'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const MENU = [
  { label: 'Dashboard', href: '/admin', icon: 'fa-tachometer-alt' },
  { label: 'Kegiatan', href: '/admin/kegiatan', icon: 'fa-calendar-check' },
  { label: 'Laporan', href: '/admin/laporan', icon: 'fa-file-alt' },
  { label: 'Riwayat Pasien', href: '/admin/riwayat-pasien', icon: 'fa-notes-medical' },
]

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  const [isMounted, setIsMounted] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [user, setUser] = useState(null)


  useEffect(() => {
    setIsMounted(true)

    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')

    if (!token || !userData) {
      router.replace('/login')
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (!['admin', 'superadmin'].includes(parsedUser.role)) {
        router.replace('/')
        return
      }

      setUser(parsedUser)
      setAuthorized(true)
    } catch {
      router.replace('/login')
    }
  }, [router])

  if (!isMounted || !authorized) return null

  const logout = () => {
    localStorage.clear()
    router.replace('/login')
  }

  const isActive = (href) => pathname === href

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="bg-success text-white py-3 shadow sticky-top">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">

            {/* LOGO */}
            <div className="d-flex align-items-center">
              <div className="me-3">
                <i className="fas fa-heartbeat fa-2x"></i>
              </div>
              <div>
                <h1 className="h5 mb-0 fw-bold">SIAPCICALENGKA</h1>
                <small>Puskesmas Cicalengka</small>
              </div>
            </div>

            {/* DESKTOP NAV */}
            <nav className="d-none d-lg-block">
              <ul className="navbar-nav d-flex flex-row align-items-center gap-2">
                {MENU.map((item) => (
                  <li className="nav-item" key={item.href}>
                    <Link
                      href={item.href}
                      className={`nav-link ${
                        isActive(item.href) ? 'fw-bold text-white' : 'text-white'
                      }`}
                    >
                      <i className={`fas ${item.icon} me-1`}></i>
                      {item.label}
                    </Link>
                  </li>
                ))}

                {/* PROFILE DROPDOWN */}
                <li className="nav-item position-relative ms-3">
                  <button
                    className="btn btn-light text-success fw-bold rounded-pill"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <i className="fas fa-user-shield me-1"></i>
                    {user?.name ?? 'Admin'}
                  </button>

                  {profileOpen && (
                    <div
                      className="dropdown-menu dropdown-menu-end show mt-2"
                      style={{ position: 'absolute', right: 0 }}
                    >
                      <span className="dropdown-item-text text-muted">
                        Role: {user?.role}
                      </span>

                      <hr className="dropdown-divider" />

                      <button
                        className="dropdown-item text-danger"
                        onClick={logout}
                      >
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              </ul>
            </nav>

            {/* MOBILE BUTTON */}
            <button
              className="btn btn-outline-light border-0 d-lg-none"
              onClick={() => setMobileMenuOpen(true)}
            >
              <i className="fas fa-bars fa-lg"></i>
            </button>

          </div>
        </div>
      </header>

      {/* ================= MOBILE OFFCANVAS ================= */}
      {mobileMenuOpen && (
        <div className="offcanvas offcanvas-end show" style={{ visibility: 'visible' }}>
          <div className="offcanvas-header bg-success text-white">
            <h5 className="mb-0">{user?.name}</h5>
            <button
              className="btn-close btn-close-white"
              onClick={() => setMobileMenuOpen(false)}
            ></button>
          </div>

          <div className="offcanvas-body">
            <nav className="navbar-nav">
              {MENU.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${
                    isActive(item.href) ? 'fw-bold text-success' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className={`fas ${item.icon} me-2`}></i>
                  {item.label}
                </Link>
              ))}

              <hr />

              <button className="nav-link text-danger" onClick={logout}>
                <i className="fas fa-sign-out-alt me-2"></i>
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* ================= MAIN ================= */}
      <main className="bg-light min-vh-100 py-4">
        <div className="container">
          {children}
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-dark text-white text-center py-3">
        <small>© 2024 SIAPCicalengka</small>
      </footer>
    </>
  )
}
