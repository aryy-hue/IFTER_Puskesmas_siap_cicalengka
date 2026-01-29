// pages/admin/pegawai/register.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../../../components/HeaderPegawai'
import Footer from '../../../../components/Footer'

export default function RegisterPegawaiPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'dokter' // default value
  })

  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validRoles = ['superadmin', 'admin', 'dokter', 'user']
  const roleLabels = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    dokter: 'Dokter',
    user: 'User'
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
    if (error) setError('')
  }

  const validateForm = () => {
    const newErrors = {}

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username wajib diisi'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter'
    } else if (formData.username.length > 100) {
      newErrors.username = 'Username maksimal 100 karakter'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
    }

    // Role validation
    const userRole = formData.role.toLowerCase()
    if (!validRoles.includes(userRole)) {
      newErrors.role = `Role tidak valid. Pilih dari: ${validRoles.join(', ')}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setErrors({})
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Prepare payload - convert role to lowercase as per backend
      const payload = {
        username: formData.username.trim(),
        password: formData.password,
        full_name: formData.full_name.trim() || null,
        role: formData.role.toLowerCase()
      }

      console.log('Sending registration request:', payload)

      // Get token if exists (for admin registration)
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      console.log('Response:', data)

      if (!res.ok) {
        // Handle specific backend errors
        if (data.message?.includes('Username sudah digunakan')) {
          throw new Error('Username sudah digunakan. Silakan pilih username lain.')
        } else if (data.message?.includes('Role tidak valid')) {
          throw new Error(data.message)
        } else if (data.message?.includes('Data terlalu panjang')) {
          throw new Error('Data terlalu panjang. Username maksimal 100 karakter.')
        } else {
          throw new Error(data.message || `Registrasi gagal (Status: ${res.status})`)
        }
      }

      setSuccess(data.message || 'Pegawai berhasil didaftarkan!')
      
      // Reset form
      setFormData({
        username: '',
        password: '',
        full_name: '',
        role: 'dokter'
      })

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/dokter')
      }, 2000)

    } catch (err) {
      console.error('Registration error:', err)
      setError(err.message || 'Terjadi kesalahan saat mendaftarkan pegawai')
      
      // If it's a duplicate error, highlight username field
      if (err.message.includes('Username sudah digunakan')) {
        setErrors(prev => ({
          ...prev,
          username: err.message
        }))
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/')
  }

  return (
    <>
      <Header />

      <main className="py-5 bg-light min-vh-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow border-0">
                <div className="card-header bg-success text-white">
                  <div className="d-flex align-items-center">
                    <i className="fas fa-user-plus me-2"></i>
                    <h4 className="mb-0 text-white">Registrasi Pegawai Baru</h4>
                  </div>
                </div>
                
                <div className="card-body p-4">
                  {/* Success/Error Messages */}
                  {success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                      <i className="fas fa-check-circle me-2"></i>
                      {success}
                      <button type="button" className="btn-close" onClick={() => setSuccess('')}></button>
                    </div>
                  )}
                  
                  {error && !Object.keys(errors).length && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                      <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Username */}
                    <div className="mb-3">
                      <label className="form-label">
                        <strong>Username</strong> <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="username"
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="Masukkan username (3-100 karakter)"
                        disabled={isLoading}
                        maxLength={100}
                      />
                      {errors.username && (
                        <div className="invalid-feedback d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.username}
                        </div>
                      )}
                      <div className="form-text">
                        {formData.username.length}/100 karakter
                      </div>
                    </div>

                    {/* Password */}
                    <div className="mb-3">
                      <label className="form-label">
                        <strong>Password</strong> <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        name="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Masukkan password (minimal 6 karakter)"
                        disabled={isLoading}
                      />
                      {errors.password && (
                        <div className="invalid-feedback d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.password}
                        </div>
                      )}
                      <div className="form-text">
                        Panjang password: {formData.password.length} karakter
                      </div>
                    </div>

                    {/* Full Name */}
                    <div className="mb-3">
                      <label className="form-label">
                        <strong>Nama Lengkap</strong>
                        <span className="text-muted small"> (opsional)</span>
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        className="form-control"
                        value={formData.full_name}
                        onChange={handleChange}
                        placeholder="Masukkan nama lengkap pegawai"
                        disabled={isLoading}
                        maxLength={150}
                      />
                      <div className="form-text">
                        {formData.full_name.length}/150 karakter
                      </div>
                    </div>

                    {/* Role Selection */}
                    <div className="mb-4">
                      <label className="form-label">
                        <strong>Role / Peran</strong> <span className="text-danger">*</span>
                      </label>
                      <select
                        name="role"
                        className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                        value={formData.role}
                        onChange={handleChange}
                        disabled={isLoading}
                      >
                        {validRoles
                          .filter(role => role !== 'user') // Filter out 'user' role for admin panel
                          .map(role => (
                            <option key={role} value={role}>
                              {roleLabels[role]}
                            </option>
                          ))
                        }
                      </select>
                      {errors.role && (
                        <div className="invalid-feedback d-block">
                          <i className="fas fa-exclamation-circle me-1"></i>
                          {errors.role}
                        </div>
                      )}
                      <div className="form-text">
                        <small>
                          <strong>Super Admin:</strong> Akses penuh sistem |{' '}
                          <strong>Admin:</strong> Administrasi umum |{' '}
                          <strong>Dokter:</strong> Tenaga medis
                        </small>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="d-flex gap-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary flex-grow-1"
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        <i className="fas fa-times me-2"></i>
                        Batal
                      </button>
                      
                      <button
                        type="submit"
                        className="btn btn-success flex-grow-1"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <i className="fas fa-spinner fa-spin me-2"></i>
                            Mendaftarkan...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-user-plus me-2"></i>
                            Daftarkan Pegawai
                          </>
                        )}
                      </button>
                    </div>

                    {/* Information */}
                    <div className="mt-4 pt-3 border-top">
                      <div className="alert alert-info mb-0">
                        <div className="d-flex">
                          <i className="fas fa-info-circle me-2 mt-1"></i>
                          <div>
                            <strong>Informasi:</strong>
                            <ul className="mb-0 mt-1">
                              <li>Password akan di-hash secara otomatis</li>
                              <li>Username harus unik dalam sistem</li>
                              <li>Pastikan role sesuai dengan kebutuhan</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        .min-vh-100 {
          min-height: calc(100vh - 120px);
        }
        
        .card {
          border-radius: 10px;
        }
        
        .card-header {
          border-radius: 10px 10px 0 0 !important;
        }
        
        .form-control:disabled,
        .form-select:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }
        
        .btn {
          padding: 10px 20px;
          font-weight: 500;
        }
        
        .btn-success {
          background-color: #28a745;
          border-color: #28a745;
        }
        
        .btn-success:hover:not(:disabled) {
          background-color: #218838;
          border-color: #1e7e34;
        }
        
        .alert {
          border-radius: 8px;
          border: none;
        }
        
        .alert-success {
          background-color: #d4edda;
          color: #155724;
        }
        
        .alert-danger {
          background-color: #f8d7da;
          color: #721c24;
        }
        
        .alert-info {
          background-color: #e7f3ff;
          color: #0c5460;
        }
        
        .invalid-feedback {
          font-size: 0.875em;
          margin-top: 0.25rem;
        }
        
        .form-text {
          font-size: 0.875em;
          color: #6c757d;
        }
      `}</style>
    </>
  )
}