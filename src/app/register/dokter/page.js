'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import Link from 'next/link'

export default function RegisterDokter() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: ''
  })
  const [file, setFile] = useState(null) // State khusus untuk file gambar
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    // Ambil file pertama yang dipilih user
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Gunakan FormData untuk upload file
      const data = new FormData()
      data.append('username', formData.username)
      data.append('password', formData.password)
      data.append('full_name', formData.full_name)
      data.append('role', 'dokter') // Hardcode role sebagai 'dokter'
      
      // Jika user memilih file, masukkan ke FormData dengan key 'img'
      if (file) {
        data.append('img', file) 
      }

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        body: data // FormData otomatis mengatur headers multipart
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.message || 'Gagal mendaftar')

      alert('Registrasi Dokter Berhasil! Silakan Login.')
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
                <div className="card-header bg-primary text-white text-center py-3">
                  <h4 className="mb-0"><i className="fas fa-user-md me-2"></i>Registrasi Dokter</h4>
                </div>
                <div className="card-body p-4">
                  
                  {error && <div className="alert alert-danger">{error}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Nama Lengkap & Gelar</label>
                      <input 
                        type="text" 
                        name="full_name"
                        className="form-control" 
                        placeholder="Contoh: Dr. Fauzan Aryawardhana"
                        value={formData.full_name}
                        onChange={handleChange}
                        required 
                      />
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
                      />
                    </div>

                    {/* Input Khusus Upload Foto */}
                    <div className="mb-3">
                      <label className="form-label">Foto Profil Dokter</label>
                      <div className="input-group">
                        <span className="input-group-text"><i className="fas fa-camera"></i></span>
                        <input 
                          type="file" 
                          className="form-control" 
                          accept="image/*" // Hanya terima gambar
                          onChange={handleFileChange}
                          required // Wajib upload foto bagi dokter
                        />
                      </div>
                      <div className="form-text text-muted">Format: JPG, PNG. Maks 2MB.</div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-3" disabled={isLoading}>
                      {isLoading ? 'Mengupload...' : 'Daftar Sebagai Dokter'}
                    </button>
                  </form>
                  
                  <div className="text-center mt-3">
                    <small>Sudah punya akun? <Link href="/login" className="text-primary fw-bold">Login disini</Link></small>
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
