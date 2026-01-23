'use client'

import { useEffect, useState } from 'react'

export default function KelolaKegiatanPage() {
  const [kegiatanList, setKegiatanList] = useState([])
  const [lokasiOptions, setLokasiOptions] = useState([])
  const [adminOptions, setAdminOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('add')

  const [formData, setFormData] = useState({
    id: '',
    judul: '',
    deskripsi: '',
    jenis_kegiatan_id: '',
    tanggal: '',
    lokasi: '',
    user_id: '',
    jam_mulai: '',
    jam_selesai: ''
  })

  const jenisKegiatanOptions = [
    { id: 1, nama: 'Penyuluhan', code: 'PY' },
    { id: 2, nama: 'Vaksinasi', code: 'VK' },
    { id: 3, nama: 'Rapat', code: 'RP' },
    { id: 4, nama: 'Posyandu', code: 'PS' }
  ]

// ================= FETCH =================
const fetchData = async () => {
  try {
    const token = localStorage.getItem('token')

    const [kegiatanRes, lokasiRes, adminRes] = await Promise.all([
      fetch('http://localhost:5001/api/admin/kegiatan', {
        headers: { Authorization: `Bearer ${token}` }
      }),
      fetch('http://localhost:5001/api/lokasi'),
      fetch('http://localhost:5001/api/users?role=admin', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])

    // Parse responses dengan benar
    const kegiatanData = await kegiatanRes.json()
    const lokasiData = await lokasiRes.json()
    const adminData = await adminRes.json()

    console.log('Response dari API users:', adminData) // Debug

    // Set state dengan struktur yang benar
    setKegiatanList(Array.isArray(kegiatanData) ? kegiatanData : [])
    setLokasiOptions(Array.isArray(lokasiData) ? lokasiData : [])
    
    // ADMIN DATA: Perhatikan struktur response
    if (adminData && adminData.success && Array.isArray(adminData.data)) {
      console.log('Admin data array:', adminData.data) // Debug
      setAdminOptions(adminData.data)
    } else {
      console.warn('Struktur admin data tidak sesuai:', adminData)
      setAdminOptions([])
    }

  } catch (err) {
    console.error('Fetch error:', err)
    alert('Gagal mengambil data')
    setKegiatanList([])
    setLokasiOptions([])
    setAdminOptions([])
  } finally {
    setLoading(false)
  }
}



  useEffect(() => {
    fetchData()
  }, [])

  // ================= FILTER =================
  const filteredList = kegiatanList.filter(k =>
    k.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    k.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ================= GENERATE ID =================
  const handleJenisChange = (e) => {
    const jenisId = parseInt(e.target.value)
    const jenis = jenisKegiatanOptions.find(j => j.id === jenisId)
    if (!jenis) return

    const related = kegiatanList.filter(k => k.id?.startsWith(jenis.code))
    let max = 0
    related.forEach(k => {
      const num = parseInt(k.id.split('-')[1])
      if (!isNaN(num) && num > max) max = num
    })

    setFormData({
      ...formData,
      jenis_kegiatan_id: jenisId,
      id: `${jenis.code}-${String(max + 1).padStart(3, '0')}`
    })
  }

  // ================= MODAL =================
  const openAddModal = () => {
    setModalType('add')
    setFormData({
      id: '',
      judul: '',
      deskripsi: '',
      jenis_kegiatan_id: '',
      tanggal: '',
      lokasi: '',
      user_id: '',
      jam_mulai: '',
      jam_selesai: ''
    })
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setModalType('edit')
    setFormData({
      id: item.id,
      judul: item.judul,
      deskripsi: item.deskripsi,
      jenis_kegiatan_id: item.jenis_kegiatan_id,
      tanggal: item.tanggal?.slice(0, 10),
      lokasi: item.lokasi,
      user_id: item.user_id,
      jam_mulai: item.jam_mulai?.slice(0, 5),
      jam_selesai: item.jam_selesai?.slice(0, 5)
    })
    setShowModal(true)
  }

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    // Validasi data sebelum dikirim
    if (!formData.judul || !formData.jenis_kegiatan_id || !formData.tanggal || 
        !formData.lokasi || !formData.user_id) {
      alert('Harap isi semua field yang wajib diisi!')
      return
    }

    // Siapkan payload sesuai dengan yang diharapkan backend
    const payload = {
      judul: formData.judul.trim(),
      deskripsi: formData.deskripsi.trim() || null, // Bisa null jika kosong
      jenis_kegiatan_id: parseInt(formData.jenis_kegiatan_id),
      tanggal: formData.tanggal,
      lokasi_id: parseInt(formData.lokasi), // PERUBAHAN: lokasi_id, bukan lokasi
      user_id: parseInt(formData.user_id),
      jam_mulai: formData.jam_mulai ? `${formData.jam_mulai}:00` : '08:00:00',
      jam_selesai: formData.jam_selesai ? `${formData.jam_selesai}:00` : '10:00:00'
    }

    // Untuk ADD, tambahkan id ke payload
    if (modalType === 'add') {
      payload.id = formData.id
    }

    console.log('Payload yang akan dikirim:', payload) // Debug

    const url = modalType === 'add'
      ? 'http://localhost:5001/api/admin/kegiatan'
      : `http://localhost:5001/api/admin/kegiatan/${formData.id}`

    const method = modalType === 'add' ? 'POST' : 'PUT'

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const responseData = await res.json()
      
      if (!res.ok) {
        // Tampilkan error detail dari backend
        console.error('Error response:', responseData)
        throw new Error(responseData.message || responseData.error || `Error ${res.status}: Gagal menyimpan data`)
      }

      // Success
      alert(modalType === 'add'
        ? 'Kegiatan berhasil ditambahkan'
        : 'Kegiatan berhasil diperbarui'
      )

      setShowModal(false)
      fetchData()

    } catch (error) {
      console.error('Submit error:', error)
      
      // Tampilkan error yang lebih informatif
      if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
        alert('Koneksi ke server gagal. Periksa koneksi internet atau pastikan server berjalan.')
      } else if (error.message.includes('401')) {
        alert('Sesi telah berakhir. Silakan login kembali.')
        localStorage.removeItem('token')
        // Redirect ke login jika diperlukan
      } else {
        alert(error.message || 'Terjadi kesalahan saat menyimpan data')
      }
    }
  }


  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
      </div>
    )
  }

  // ================= RENDER =================
  return (
    <div className="container-fluid p-4">

      {/* STATISTIK */}
      <div className="row mb-4">
        {[
          { label: 'Total', value: kegiatanList.length, icon: 'calendar', color: 'primary' },
          { label: 'Menunggu', value: kegiatanList.filter(k=>k.status==='menunggu').length, icon: 'clock', color: 'secondary' },
          { label: 'Disetujui', value: kegiatanList.filter(k=>k.status==='disetujui').length, icon: 'check-circle', color: 'success' }
        ].map((s,i)=>(
          <div key={i} className="col-md-4 mb-3">
            <div className="card shadow-sm border-0 h-100">
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h3 className={`text-${s.color}`}>{s.value}</h3>
                  <p className="text-muted mb-0">{s.label} Kegiatan</p>
                </div>
                <div className={`bg-${s.color} bg-opacity-10 p-3 rounded-circle`}>
                  <i className={`fas fa-${s.icon} fa-2x text-${s.color}`}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ACTION */}
      <div className="d-flex justify-content-between mb-3">
        <input
          className="form-control w-50"
          placeholder="Cari ID / Judul / Status"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <button className="btn btn-success" onClick={openAddModal}>
          <i className="fas fa-plus me-2"></i>Tambah
        </button>
      </div>

      {/* TABLE */}
      <div className="card border-0 shadow-sm">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-success">
            <tr>
              <th>ID</th>
              <th>Judul</th>
              <th>Tanggal</th>
              <th>Lokasi</th>
              <th>Admin</th>
              <th>Status</th>
              <th width="70" className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.judul}</td>
                <td>{item.tanggal?.slice(0,10)}</td>
                <td>{item.nama_lokasi || '-'}</td>
                <td>{item.nama_admin || '-'}</td>
                <td>
                  <span className={`badge ${
                    item.status === 'menunggu' ? 'bg-secondary'
                    : item.status === 'disetujui' ? 'bg-success'
                    : 'bg-danger'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={()=>openEditModal(item)}
                    title="Edit"
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal fade show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header bg-success text-white">
                <h5>{modalType === 'add' ? 'Tambah' : 'Edit'} Kegiatan</h5>
              </div>

              <div className="modal-body">
                <select className="form-select mb-2"
                  value={formData.jenis_kegiatan_id}
                  onChange={handleJenisChange}
                  disabled={modalType==='edit'}
                  required>
                  <option value="">-- Pilih Jenis --</option>
                  {jenisKegiatanOptions.map(j=>(
                    <option key={j.id} value={j.id}>{j.nama}</option>
                  ))}
                </select>

                <input className="form-control mb-2" value={formData.id} readOnly />
                <input className="form-control mb-2" placeholder="Judul"
                  value={formData.judul}
                  onChange={e=>setFormData({...formData, judul:e.target.value})}
                  required />

                <textarea className="form-control mb-2" placeholder="Deskripsi"
                  value={formData.deskripsi}
                  onChange={e=>setFormData({...formData, deskripsi:e.target.value})} />

                <input type="date" className="form-control mb-2"
                  value={formData.tanggal}
                  onChange={e=>setFormData({...formData, tanggal:e.target.value})}
                  required />

                <select className="form-select mb-2"
                  value={formData.lokasi}
                  onChange={e=>setFormData({...formData, lokasi:e.target.value})}
                  required>
                  <option value="">-- Pilih Lokasi --</option>
                  {lokasiOptions.map(l=>(
                    <option key={l.id} value={l.id}>{l.nama_lokasi}</option>
                  ))}
                </select>

                <select className="form-select mb-2"
                  value={formData.user_id}
                  onChange={e => setFormData({...formData, user_id: e.target.value})}
                  required>
                  <option value="">-- Pilih Admin --</option>
                  {adminOptions.length > 0 ? (
                    adminOptions.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.name || a.full_name || `Admin ${a.id}`}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>
                      {loading ? 'Memuat admin...' : 'Tidak ada admin tersedia'}
                    </option>
                  )}
                </select>

                <div className="row">
                  <div className="col">
                    <input type="time" className="form-control"
                      value={formData.jam_mulai}
                      onChange={e=>setFormData({...formData, jam_mulai:e.target.value})}
                      required />
                  </div>
                  <div className="col">
                    <input type="time" className="form-control"
                      value={formData.jam_selesai}
                      onChange={e=>setFormData({...formData, jam_selesai:e.target.value})}
                      required />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary"
                  onClick={()=>setShowModal(false)}>Batal</button>
                <button className="btn btn-success">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .card:hover {
          transform: translateY(-4px);
          transition: 0.2s;
        }
      `}</style>
    </div>
  )
}
