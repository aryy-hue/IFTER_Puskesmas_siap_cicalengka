'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import Link from 'next/link'

export default function RegisterPasien() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    full_name: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // PENTING: Gunakan FormData untuk keseragaman dengan backend Multer
      const data = new FormData()
      data.append('username', formData.username)
      data.append('password', formData.password)
      data.append('full_name', formData.full_name)
      data.append('role', 'user') // Hardcode role sebagai 'user' (pasien)
      // Kita TIDAK meng-append 'img', jadi backend akan menyimpannya sebagai NULL/Default

      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        // Jangan set 'Content-Type' header secara manual saat pakai FormData!
        // Browser akan otomatis mengaturnya.
        body: data 
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.message || 'Gagal mendaftar')

      // Redirect ke login setelah sukses
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
                  <h4 className="mb-0 text-white"><i className="fas fa-user-injured me-2 "></i>Daftar Pasien Baru</h4>
                </div>
                <div className="card-body p-4">
                  
                  {error && <div className="alert alert-danger">{error}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Nama Lengkap</label>
                      <input 
                        type="text" 
                        name="full_name"
                        className="form-control" 
                        placeholder="Contoh: Budi Santoso"
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
                    
                    {/* Info Default Image */}
                    <div className="alert alert-info py-2 small">
                      <i className="fas fa-info-circle me-1"></i>
                      Foto profil akan menggunakan gambar default sistem.
                    </div>

                    <button type="submit" className="btn btn-success w-100 mt-3" disabled={isLoading}>
                      {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
                    </button>
                  </form>
                  
                  <div className="text-center mt-3">
                    <small>Sudah punya akun? <Link href="/login" className="text-success fw-bold">Login disini</Link></small>
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
