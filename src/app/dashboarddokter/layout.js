'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

const MENU = [
  { label: 'Dashboard', href: '/dokter', icon: 'fa-home' },
  { label: 'Pengajuan Izin', href: '/dokter/izin', icon: 'fa-file-medical' },]

export default function DokterLayout({ children }) {
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

      // 🔐 KHUSUS DOKTER
      if (parsedUser.role !== 'dokter') {
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

            <div className="d-flex align-items-center">
              <div className="me-3">
                <i className="fas fa-user-md fa-2x"></i>
              </div>
              <div>
                <h1 className="h5 mb-0 fw-bold">SIAPCICALENGKA</h1>
                <small>Dokter</small>
              </div>
            </div>

            <nav className="d-none d-lg-block">
              <ul className="navbar-nav d-flex flex-row align-items-center gap-2">
                {MENU.map(item => (
                  <li key={item.href} className="nav-item">
                    <Link
                      href={item.href}
                      className={`nav-link ${
                        isActive(item.href)
                          ? 'fw-bold text-white'
                          : 'text-white'
                      }`}
                    >
                      <i className={`fas ${item.icon} me-1`}></i>
                      {item.label}
                    </Link>
                  </li>
                ))}

                <li className="nav-item position-relative ms-3">
                  <button
                    className="btn btn-light text-success fw-bold rounded-pill"
                    onClick={() => setProfileOpen(!profileOpen)}
                  >
                    <i className="fas fa-user-md me-1"></i>
                    {user?.name ?? 'Dokter'}
                  </button>

                  {profileOpen && (
                    <div className="dropdown-menu dropdown-menu-end show mt-2">
                      <span className="dropdown-item-text text-muted">
                        Role: {user?.role}
                      </span>
                      <hr />
                      <button className="dropdown-item text-danger" onClick={logout}>
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </li>
              </ul>
            </nav>

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
        <div className="offcanvas offcanvas-end show mobile-offcanvas">
          <div className="offcanvas-header mobile-header">
            <h6 className="mb-0 mobile-username">
              {user?.name}
            </h6>
            <button
              className="btn-close"
              onClick={() => setMobileMenuOpen(false)}
            />
          </div>

          <div className="offcanvas-body">
            <nav className="navbar-nav">
              {MENU.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mobile-nav-link ${
                    isActive(item.href) ? 'active' : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <i className={`fas ${item.icon}`}></i>
                  {item.label}
                </Link>
              ))}

              <hr />

              <button
                className="mobile-nav-link logout"
                onClick={logout}
              >
                <i className="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* ================= MAIN ================= */}
      <main className="bg-light min-vh-100 py-4">
        <div className="container">{children}</div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-dark text-white text-center py-3">
        <small>© 2024 SIAPCicalengka</small>
      </footer>

      {/* ================= CSS ================= */}
      <style jsx>{`
        .mobile-offcanvas {
          background-color: #ffffff;
        }

        .mobile-header {
          background-color: #ffffff;
          border-bottom: 1px solid #e5e7eb;
        }

        .mobile-username {
          color: #198754;
          font-weight: 700;
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          margin-bottom: 6px;
          border-radius: 8px;
          text-decoration: none;
          color: #198754;
          font-weight: 500;
        }

        .mobile-nav-link.active {
          background-color: rgba(25, 135, 84, 0.15);
          font-weight: 700;
        }

        .mobile-nav-link:hover {
          background-color: rgba(25, 135, 84, 0.1);
        }

        .mobile-nav-link.logout {
          color: #dc3545;
        }

        .mobile-nav-link.logout i {
          color: #dc3545;
        }
      `}</style>
    </>
  )
}
