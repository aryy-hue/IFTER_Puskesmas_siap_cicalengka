'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import Link from 'next/link'

export default function RegisterPasien() {
  const router = useRouter()
  
  // State form
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: "user",
  })
  
  const [fieldErrors, setFieldErrors] = useState({
    full_name: '',
    username: '',
    password: ''
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error saat user mulai mengetik
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const errors = {}
    const nameRegex = /^[a-zA-Z\s]{3,50}$/
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/

    if (!nameRegex.test(formData.full_name)) {
      errors.full_name = 'Nama hanya boleh huruf dan spasi (3-50 karakter)'
    }
    
    if (!usernameRegex.test(formData.username)) {
      errors.username = 'Username hanya boleh huruf, angka, underscore (4-20 karakter)'
    }
    
    if (!passwordRegex.test(formData.password)) {
      errors.password = 'Password minimal 8 karakter dengan kombinasi huruf besar, kecil, dan angka'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    let error = ''
    
    switch(name) {
      case 'full_name':
        if (!/^[a-zA-Z\s]{3,50}$/.test(value)) {
          error = 'Nama hanya boleh huruf dan spasi (3-50 karakter)'
        }
        break
      case 'username':
        if (!/^[a-zA-Z0-9_]{4,20}$/.test(value)) {
          error = 'Username hanya boleh huruf, angka, underscore (4-20 karakter)'
        }
        break
      case 'password':
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(value)) {
          error = 'Password minimal 8 karakter dengan kombinasi huruf besar, kecil, dan angka'
        }
        break
      default:
        break
    }
    
    setFieldErrors(prev => ({ ...prev, [name]: error }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
  
    // Validasi dulu
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    setError('')

    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name,
        role: 'user'
      }

      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.message || 'Gagal mendaftar')

      alert('Registrasi Pasien Berhasil! Silakan Login.')
      router.push('/login')

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
            <div className="col-md-6 col-lg-5">
              <div className="card shadow border-0">
                <div className="card-header bg-success text-white text-center py-3">
                  <h4 className="mb-0 text-white"><i className="fas fa-user-injured me-2"></i>Daftar Pasien Baru</h4>
                </div>
                <div className="card-body p-4">
                  
                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      {error}
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setError('')}
                        aria-label="Close"
                      ></button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} noValidate>
                    <div className="mb-3">
                      <label className="form-label">Nama Lengkap</label>
                      <input 
                        type="text" 
                        name="full_name"
                        className={`form-control ${fieldErrors.full_name ? 'is-invalid' : ''}`}
                        placeholder="Contoh: Budi Santoso"
                        value={formData.full_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required 
                      />
                      {fieldErrors.full_name && (
                        <div className="invalid-feedback">
                          {fieldErrors.full_name}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Username</label>
                      <input 
                        type="text" 
                        name="username"
                        className={`form-control ${fieldErrors.username ? 'is-invalid' : ''}`}
                        placeholder="Username unik"
                        value={formData.username}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required 
                      />
                      {fieldErrors.username && (
                        <div className="invalid-feedback">
                          {fieldErrors.username}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input 
                        type="password" 
                        name="password"
                        className={`form-control ${fieldErrors.password ? 'is-invalid' : ''}`}
                        placeholder="Password rahasia"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required 
                      />
                      {fieldErrors.password && (
                        <div className="invalid-feedback">
                          {fieldErrors.password}
                        </div>
                      )}
                      <small className="text-muted">
                        Password minimal 8 karakter dengan kombinasi huruf besar, kecil, dan angka
                      </small>
                    </div>
                    
                    <div className="alert alert-info py-2 small">
                      <i className="fas fa-info-circle me-1"></i>
                      Foto profil akan menggunakan gambar default sistem.
                    </div>

                    <button 
                      type="submit" 
                      className="btn btn-success w-100 mt-3" 
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Memproses...
                        </>
                      ) : 'Daftar Sekarang'}
                    </button>
                  </form>
                  
                  <div className="text-center mt-3">
                    <small>
                      Sudah punya akun?{' '}
                      <Link href="/login" className="text-success fw-bold text-decoration-none">
                        Login disini
                      </Link>
                    </small>
                  </div>
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