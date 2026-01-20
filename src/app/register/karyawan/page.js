'use client'

import Header from '../../../../components/HeaderPegawai'
import Footer from '../../../../components/Footer'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPegawaiPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: '',
    role: 'dokter'
  })

  const [photo, setPhoto] = useState(null)
  const [preview, setPreview] = useState(null)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setPhoto(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const payload = new FormData()
      payload.append('username', formData.username)
      payload.append('password', formData.password)
      payload.append('full_name', formData.full_name)
      payload.append('role', formData.role)
      if (photo) payload.append('img', photo)

      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: payload
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registrasi gagal')

      setSuccess('Pegawai berhasil didaftarkan')

      setFormData({
        username: '',
        password: '',
        full_name: '',
        role: 'dokter'
      })
      setPhoto(null)
      setPreview(null)

      setTimeout(() => {
        router.push('/admin/pegawai')
      }, 1500)

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
                <div className="card-body p-4">

                  <div className="text-center mb-4">
                    <i className="fas fa-user-plus fa-3x text-success mb-2"></i>
                    <h3 className="text-success">Registrasi Pegawai</h3>
                    <p className="text-muted">Tambah akun pegawai baru</p>
                  </div>

                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}

                  <form onSubmit={handleSubmit} encType="multipart/form-data">

                    {/* FOTO */}
                    <div className="mb-3 text-center">
                      <img
                        src={preview || '/img/default-avatar.png'}
                        alt="Preview"
                        className="rounded-circle mb-2"
                        width="120"
                        height="120"
                        style={{ objectFit: 'cover' }}
                      />
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        disabled={isLoading}
                      />
                      <small className="text-muted">
                        JPG / PNG (maks 2MB)
                      </small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Username</label>
                      <input
                        type="text"
                        name="username"
                        className="form-control"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Nama Lengkap</label>
                      <input
                        type="text"
                        name="full_name"
                        className="form-control"
                        value={formData.full_name}
                        onChange={handleChange}
                        disabled={isLoading}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Role</label>
                      <select
                        name="role"
                        className="form-select"
                        value={formData.role}
                        onChange={handleChange}
                        required
                        disabled={isLoading}
                      >
                        <option value="superadmin">Super Admin</option>
                        <option value="admin">Admin</option>
                        <option value="dokter">Dokter</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-success w-100"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span>
                          <i className="fas fa-spinner fa-spin me-2"></i>
                          Menyimpan...
                        </span>
                      ) : (
                        <span>
                          <i className="fas fa-save me-2"></i>
                          Daftarkan Pegawai
                        </span>
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
