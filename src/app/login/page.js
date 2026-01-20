'use client'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2' // 1. Import SweetAlert2

export default function LoginPage() {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login gagal')

      const { token, user } = data

      // Simpan Data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        name: user.full_name,
        role: user.role,
        img: user.img || '/img/default-avatar.png'
      }))

      document.cookie = `user=${encodeURIComponent(JSON.stringify({
        id: user.id,
        role: user.role
      }))}; path=/`;

      // --- 2. TAMPILKAN NOTIFIKASI SUKSES DISINI ---
      await Swal.fire({
        title: 'Login Berhasil!',
        text: `Selamat datang kembali, ${user.full_name}`, // Menyapa nama user
        icon: 'success',
        timer: 1500, // Otomatis tutup dalam 1.5 detik
        showConfirmButton: false,
        timerProgressBar: true,
      })
      // ----------------------------------------------

      // Redirect Sesuai Role
      if (user.role === 'dokter') {
        router.replace('/dashboarddokter')
      } else if (user.role === 'admin' || user.role === 'superadmin') {
        router.replace('/admin')
      } else {
        router.replace('/')
      }

    } catch (err) {
      // --- 3. (Opsional) NOTIFIKASI ERROR MENARIK ---
      // Jika ingin errornya juga pakai popup, gunakan ini:
      /*
      Swal.fire({
        icon: 'error',
        title: 'Gagal Masuk',
        text: err.message,
        confirmButtonColor: '#d33'
      })
      */
      
      // Atau tetap pakai state error biasa (teks merah)
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main className="py-5 bg-light min-vh-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="card shadow border-0 rounded-3"> {/* Sedikit styling tambahan */}
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <div className="logo-container mx-auto mb-3">
                      <i className="fas fa-heartbeat logo-icon fa-2x text-success"></i>
                    </div>
                    <h3 className="card-title fw-bold text-success">Login</h3>
                    <p className="text-muted small">Masuk ke sistem Puskesmas</p>
                  </div>
                  
                  {error && (
                    <div className="alert alert-danger d-flex align-items-center" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      <div>{error}</div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label fw-bold small">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        placeholder="Masukkan username anda"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="password" className="form-label fw-bold small">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-success w-100 py-2 fw-bold shadow-sm"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                         <span><i className="fas fa-spinner fa-spin me-2"></i>Memproses...</span>
                      ) : (
                         <span><i className="fas fa-sign-in-alt me-2"></i>Masuk Sekarang</span>
                      )}
                    </button>
                  </form>
                </div>
              </div>
              <div className="text-center mt-3 text-muted small">
                 Belum punya akun? <a href="/register/pasien" className="text-success text-decoration-none fw-bold">Daftar disini</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}