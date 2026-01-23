'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DokterLayout({ children }) {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState({ username: '', role: '' })

  useEffect(() => {
    setIsMounted(true)
    const token = localStorage.getItem('token')

    if (!token) {
      router.replace('/login')
      return
    }

    const fetchLatestUserData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          
          if (data.role !== 'dokter') {
            router.replace('/')
            return
          }

          setUser({
            username: data.username,
            role: data.role
          })
          setAuthorized(true)
        } else {
          router.replace('/login')
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error)
        router.replace('/login')
      }
    }

    fetchLatestUserData()
  }, [router])

  const logout = () => {
    localStorage.clear()
    router.replace('/login')
  }

  if (!isMounted || !authorized) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <>
      <header className="bg-success text-white py-3 shadow sticky-top">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            {/* LOGO */}
            <div className="d-flex align-items-center">
              <div className="me-3">
                <i className="fas fa-user-md fa-2x"></i>
              </div>
              <div>
                <h1 className="h5 mb-0 fw-bold">SIAPCICALENGKA</h1>
                <small>Panel Dokter</small>
              </div>
            </div>

            {/* DESKTOP PROFILE */}
            <nav className="d-none d-lg-block">
              <div className="position-relative">
                <button
                  className="btn btn-light text-success fw-bold rounded-pill shadow-sm"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <i className="fas fa-user-circle me-1"></i>
                  {user.username} 
                </button>

                {profileOpen && (
                  <div className="dropdown-menu dropdown-menu-end show mt-2 shadow border-0" style={{ position: 'absolute', right: 0, minWidth: '160px' }}>
                    <div className="px-3 py-2">
                      {/* ROLE: FONT THIN DAN HITAM */}
                      <span className="fw-light text-dark">Role: </span>
                      <span className="fw-light text-dark text-capitalize">{user.role}</span>
                    </div>
                    <hr className="dropdown-divider" />
                    <button className="dropdown-item text-danger py-2" onClick={logout}>
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* MOBILE BUTTON */}
            <button className="btn btn-outline-light border-0 d-lg-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <i className="fas fa-bars fa-lg"></i>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="bg-white border-bottom d-lg-none p-3 shadow-sm">
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-user-circle fa-2x text-success me-2"></i>
            <div>
              <div className="fw-bold text-success">{user.username}</div>
              {/* MOBILE ROLE: FONT THIN DAN HITAM */}
              <div className="fw-light text-dark text-capitalize">Role: {user.role}</div>
            </div>
          </div>
          <button className="btn btn-danger w-100" onClick={logout}>
            Logout
          </button>
        </div>
      )}

      <main className="bg-light min-vh-100 py-4">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="bg-dark text-white text-center py-3">
        <small>© 2026 SIAPCicalengka - Sistem Informasi Puskesmas</small>
      </footer>
    </>
  )
}