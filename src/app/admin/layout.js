'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()

  const [isMounted, setIsMounted] = useState(false)
  const [authorized, setAuthorized] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // =============================
  // AUTH & ROLE GUARD
  // =============================
  useEffect(() => {
    setIsMounted(true)

    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')

    if (!token || !user) {
      router.replace('/login')
      return
    }

    const parsedUser = JSON.parse(user)

    if (!['admin', 'superadmin'].includes(parsedUser.role)) {
      router.replace('/')
      return
    }

    setAuthorized(true)
  }, [router])

  if (!isMounted || !authorized) return null

  // =============================
  // MENU ADMIN
  // =============================
  const isActive = (href) => pathname === href

  return (
    <div className="d-flex flex-column min-vh-100">

      {/* ================= HEADER ================= */}
      <header className="bg-success text-white py-3 shadow sticky-top">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">

            <div className="d-flex align-items-center">
              <i className="fas fa-heartbeat fa-2x me-2"></i>
              <div>
                <h1 className="h5 mb-0 fw-bold">SIAPCicalengka</h1>
                <small>Puskesmas Cicalengka</small>
              </div>
            </div>

            {/* DESKTOP MENU */}
            <nav className="d-none d-lg-flex gap-3">
              <Link className={`nav-link text-white ${isActive('/admin') && 'fw-bold'}`} href="/admin">
                Dashboard
              </Link>
              <Link className={`nav-link text-white ${isActive('/admin/kegiatan') && 'fw-bold'}`} href="/admin/kegiatan">
                Kegiatan
              </Link>
              <Link className={`nav-link text-white ${isActive('/admin/laporan') && 'fw-bold'}`} href="/admin/laporan">
                Laporan
              </Link>
              <Link className={`nav-link text-white ${isActive('/admin/riwayat-pasien') && 'fw-bold'}`} href="/admin/riwayat-pasien">
                Riwayat Pasien
              </Link>
              <button
                className="btn btn-sm btn-light"
                onClick={() => {
                  localStorage.clear()
                  router.replace('/login')
                }}
              >
                Logout
              </button>
            </nav>

            {/* MOBILE BUTTON */}
            <button
              className="btn btn-outline-light d-lg-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </header>

      {/* ================= MOBILE MENU ================= */}
      {mobileMenuOpen && (
        <div className="bg-white shadow p-3 d-lg-none">
          <Link className="d-block mb-2" href="/admin" onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
          <Link className="d-block mb-2" href="/admin/kegiatan" onClick={() => setMobileMenuOpen(false)}>Kegiatan</Link>
          <Link className="d-block mb-2" href="/admin/laporan" onClick={() => setMobileMenuOpen(false)}>Laporan</Link>
          <Link className="d-block mb-2" href="/admin/riwayat-pasien" onClick={() => setMobileMenuOpen(false)}>Riwayat Pasien</Link>
          <button
            className="btn btn-danger w-100 mt-2"
            onClick={() => {
              localStorage.clear()
              router.replace('/login')
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* ================= MAIN ================= */}
      <main className="flex-grow-1 bg-light p-4">
        {children}
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="bg-dark text-white text-center py-3">
        <small>© 2024 SIAPCicalengka</small>
      </footer>

    </div>
  )
}
