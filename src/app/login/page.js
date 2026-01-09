'use client'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { useState } from 'react'
import { useRouter } from 'next/navigation' // Import router untuk redirect

export default function LoginPage() {
  const router = useRouter()
  
  // State untuk form
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  // State untuk feedback user (loading & error)
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

      // 🔑 AMBIL DARI data.user (INI PENTING)
      const { token, user } = data

      // SIMPAN SEKALI SAJA
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        name: user.full_name,
        role: user.role,
        img: user.img || '/img/default-avatar.png'
      }))

      // SIMPAN COOKIE UNTUK MIDDLEWARE
      document.cookie = `user=${encodeURIComponent(JSON.stringify({
        id: user.id,
        role: user.role
      }))}; path=/`;


      // REDIRECT SESUAI ROLE
      if (user.role === 'dokter') {
        router.replace('/dashboarddokter')
      } else if (user.role === 'admin' || user.role === 'superadmin') {
        router.replace('/admin')
      } else {
        router.replace('/')
      }

    } catch (err) {
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
              <div className="card shadow">
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <div className="logo-container mx-auto mb-3">
                      <i className="fas fa-heartbeat logo-icon"></i>
                    </div>
                    <h3 className="card-title text-success">Login</h3>
                    <p className="text-muted">Masuk ke akun Anda</p>
                  </div>
                  
                  {/* Tampilkan Error Alert jika ada error */}
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">Username</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={isLoading} // Disable saat loading
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading} // Disable saat loading
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-success w-100"
                      disabled={isLoading} // Cegah double klik
                    >
                      {isLoading ? (
                         <span><i className="fas fa-spinner fa-spin me-2"></i>Loading...</span>
                      ) : (
                         <span><i className="fas fa-sign-in-alt me-2"></i>Login</span>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
