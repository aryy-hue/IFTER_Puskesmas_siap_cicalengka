'use client'
import { useState, useEffect } from 'react'

export default function IzinPage() {
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState(null) // State untuk menyimpan ID user
  const [form, setForm] = useState({
    jenis_izin: 'Sakit',
    tanggal_awal: '',
    tanggal_akhir: '',
    alasan: ''
  })

  // Ambil user_id saat komponen dimuat
  useEffect(() => {
    // Ambil data user dari localStorage (asumsi data disimpan saat login)
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUserId(userData.id) // Pastikan key 'id' sesuai dengan data login Anda
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!userId) {
      alert("Error: User ID tidak ditemukan. Silakan login kembali.")
      return
    }

    setLoading(true)
    const token = localStorage.getItem('token')

    try {
      const res = await fetch('http://localhost:5001/api/izin', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        // GABUNGKAN data form dengan user_id
        body: JSON.stringify({
          ...form,
          user_id: userId 
        })
      })

      const result = await res.json()

      if (res.ok) {
        alert("✅ Izin berhasil diajukan!")
        // Reset form
        setForm({
          jenis_izin: 'Sakit',
          tanggal_awal: '',
          tanggal_akhir: '',
          alasan: ''
        })
      } else {
        // Tampilkan pesan error spesifik dari backend (misal: field kosong)
        alert("❌ Gagal: " + result.message)
      }
    } catch (err) {
      console.error("Fetch error:", err)
      alert("❌ Terjadi kesalahan koneksi ke server.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body p-4">
        <h3 className="fw-bold text-success mb-4">Form Pengajuan Izin</h3>
        
        {/* Tambahkan notif jika userId tidak ada */}
        {!userId && <div className="alert alert-danger">Sesi tidak valid. Silakan login ulang.</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Jenis Izin</label>
            <select 
              className="form-select" 
              value={form.jenis_izin} 
              onChange={(e) => setForm({...form, jenis_izin: e.target.value})}
            >
              <option value="Sakit">Sakit</option>
              <option value="Cuti">Cuti</option>
              <option value="Pulang Cepat">Pulang Cepat</option>
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Tanggal Mulai</label>
              <input 
                type="date" 
                className="form-control" 
                value={form.tanggal_awal}
                onChange={(e) => setForm({...form, tanggal_awal: e.target.value})} 
                required 
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Tanggal Berakhir</label>
              <input 
                type="date" 
                className="form-control" 
                value={form.tanggal_akhir}
                onChange={(e) => setForm({...form, tanggal_akhir: e.target.value})} 
                required 
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Alasan / Keterangan</label>
            <textarea 
              className="form-control" 
              rows="3" 
              value={form.alasan}
              placeholder="Contoh: Demam tinggi, perlu istirahat" 
              onChange={(e) => setForm({...form, alasan: e.target.value})} 
              required
            ></textarea>
          </div>

          <button type="submit" className="btn btn-success w-100 fw-bold py-2" disabled={loading || !userId}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Mengirim...
              </>
            ) : 'Kirim Pengajuan'}
          </button>
        </form>
      </div>
    </div>
  )
}