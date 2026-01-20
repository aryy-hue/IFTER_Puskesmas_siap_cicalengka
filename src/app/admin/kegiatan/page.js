'use client'

import { useState, useEffect } from 'react'

export default function KelolaKegiatanPage() {
  const [kegiatanList, setKegiatanList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  // State untuk Modal
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('add') 

  // State Form Kegiatan
  const [formData, setFormData] = useState({
    id: '',
    judul: '',
    deskripsi: '',
    jenis_kegiatan_id: '',
    tanggal: '',
    lokasi: '',
    penanggung_jawab: '',
    jam_mulai: '',
    jam_selesai: ''
  })

  // State Form Laporan
  const [laporanData, setLaporanData] = useState({
    kegiatan_id: '',
    judul_laporan: '',
    detail_kegiatan: '',
    file: null
  })

  // Master Data Jenis Kegiatan
  const jenisKegiatanOptions = [
    { id: 1, nama: 'Penyuluhan', code: 'PY' },
    { id: 2, nama: 'Vaksinasi', code: 'VK' },
    { id: 3, nama: 'Rapat', code: 'RP' },
    { id: 4, nama: 'Posyandu', code: 'PS' }
  ]

  // Data dropdown master
  const [lokasiOptions, setLokasiOptions] = useState([])
  const [adminOptions, setAdminOptions] = useState([])

  // Fetch data kegiatan, lokasi, admin
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')

      // Kegiatan
      const resKegiatan = await fetch('http://localhost:5001/api/kegiatan', {
        headers: { 'Authorization': `Bearer ${token}` }
      })  
      if (!resKegiatan.ok) throw new Error('Gagal mengambil data kegiatan')
      const dataKegiatan = await resKegiatan.json()
      setKegiatanList(dataKegiatan)

      // Lokasi
      const resLokasi = await fetch('http://localhost:5001/api/lokasi', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!resLokasi.ok) throw new Error('Gagal mengambil data lokasi')
      const dataLokasi = await resLokasi.json()
      setLokasiOptions(dataLokasi)

      // Admin
      const resAdmin = await fetch('http://localhost:5001/api/users?role=admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!resAdmin.ok) throw new Error('Gagal mengambil data admin')
      const dataAdmin = await resAdmin.json()
      setAdminOptions(dataAdmin)

    } catch (err) {
      setError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Generate ID kegiatan
  const handleJenisChange = (e) => {
    const selectedId = parseInt(e.target.value)
    const selectedJenis = jenisKegiatanOptions.find(j => j.id === selectedId)
    
    if (!selectedJenis) {
        setFormData({ ...formData, jenis_kegiatan_id: '', id: '' })
        return
    }

    const relatedItems = kegiatanList.filter(item => 
        item.id && item.id.startsWith(selectedJenis.code + '-')
    )

    let maxNumber = 0
    if (relatedItems.length > 0) {
        relatedItems.forEach(item => {
            const parts = item.id.split('-')
            if (parts.length === 2) {
                const num = parseInt(parts[1])
                if (!isNaN(num) && num > maxNumber) {
                    maxNumber = num
                }
            }
        })
    }

    const nextNumber = maxNumber + 1
    const paddedNumber = nextNumber.toString().padStart(3, '0')
    const generatedId = `${selectedJenis.code}-${paddedNumber}`

    setFormData({
      ...formData,
      jenis_kegiatan_id: selectedId,
      id: generatedId 
    })
  }

  // Status badge
  const getStatusBadge = (item) => {
    if (item.status === 'menunggu') return { label: 'Menunggu Approval', color: 'bg-secondary bg-opacity-75' }
    if (item.status === 'ditolak') return { label: 'Ditolak', color: 'bg-danger' }

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const eventDate = new Date(item.tanggal)
    
    const isToday = eventDate.getDate() === today.getDate() && 
                    eventDate.getMonth() === today.getMonth() && 
                    eventDate.getFullYear() === today.getFullYear()

    if (item.has_laporan) { 
        return { label: 'Verifikasi Laporan', color: 'bg-info text-dark' }
    }
    
    if (isToday) {
        return { label: 'Sedang Berlangsung', color: 'bg-primary spinner-grow-sm' }
    } else if (eventDate < today) {
        return { label: 'Butuh Laporan', color: 'bg-danger' }
    } else {
        return { label: 'Akan Datang', color: 'bg-warning text-dark' }
    }
  }

  // Modal handlers
  const openAddModal = () => {
    setModalType('add')
    setFormData({ id: '', judul: '', jenis_kegiatan_id: '', tanggal: '', jam_mulai: '', jam_selesai: '', lokasi: '', deskripsi: '', penanggung_jawab: '' })
    setShowModal(true)
  }

  const openEditModal = (item) => {
    setModalType('edit')
    setFormData({ ...item })
    setShowModal(true)
  }

  const openLaporanModal = (item) => {
    setModalType('laporan')
    setLaporanData({ kegiatan_id: item.id, judul_laporan: `Laporan: ${item.judul}`, detail_kegiatan: '', file: null })
    setShowModal(true)
  }

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    if (!formData.id) {
      alert('ID kegiatan belum tergenerate. Pilih jenis kegiatan dulu.')
      return
    }

    const payload = {
      id: formData.id,
      judul: formData.judul,
      deskripsi: formData.deskripsi,
      jenis_kegiatan_id: formData.jenis_kegiatan_id,
      tanggal: formData.tanggal,
      lokasi: formData.lokasi, // ID lokasi
      penanggung_jawab: formData.penanggung_jawab, // ID admin
      jam_mulai: formData.jam_mulai,
      jam_selesai: formData.jam_selesai
    }

    try {
      const res = await fetch('http://localhost:5001/api/admin/kegiatan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.message || 'Gagal menambah kegiatan')

      alert(`Kegiatan berhasil ditambahkan dengan ID ${formData.id}`)
      setShowModal(false)
      fetchData()
    } catch (err) {
      console.error(err)
      alert(err.message)
    }
  }

  const filteredList = kegiatanList.filter(item => 
    item.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>

  return (
    <div className="container-fluid p-4 min-vh-100" style={{backgroundColor: '#f4f6f9'}}>
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Manajemen Kegiatan</h2>
        <p className="text-muted">Kelola jadwal dan laporan kegiatan puskesmas</p>
      </div>

      <div className="card border-0 shadow-sm mb-4 rounded-3">
        <div className="card-body p-3">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <button 
              onClick={openAddModal} 
              className="btn btn-primary fw-bold px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2"
            >
              <i className="fas fa-plus"></i> Tambah Kegiatan
            </button>
            <div className="input-group" style={{maxWidth: '400px'}}>
              <span className="input-group-text bg-white border-end-0 ps-3 text-muted"><i className="fas fa-search"></i></span>
              <input 
                type="text" 
                className="form-control border-start-0 ps-2 py-2" 
                placeholder="Cari berdasarkan Nama atau ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabel kegiatan */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        <div className="card-header mb-2 bg-success text-white py-3 px-4 border-0">
          <h5 className="mb-0 text-white fw-bold d-flex align-items-center gap-2">
            <i className="fas fa-list-ul"></i> Daftar Kegiatan
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{backgroundColor: '#157347'}}> 
                <tr>
                  <th className="py-3 ps-4 text-uppercase small fw-bold text-white">ID</th>
                  <th className="py-3 text-uppercase small fw-bold text-white">Nama Kegiatan</th>
                  <th className="py-3 text-uppercase small fw-bold text-white">Waktu</th>
                  <th className="py-3 text-uppercase small fw-bold text-white">Lokasi</th>
                  <th className="py-3 text-uppercase small fw-bold text-white">Penanggung Jawab</th>
                  <th className="py-3 text-center text-uppercase small fw-bold text-white">Status</th>
                  <th className="py-3 pe-4 text-end text-uppercase small fw-bold text-white">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredList.length === 0 ? (
                  <tr><td colSpan="7" className="py-5 text-center text-muted">Data tidak ditemukan</td></tr>
                ) : (
                  filteredList.map((item) => {
                    const badge = getStatusBadge(item)
                    return (
                      <tr key={item.id}>
                        <td className="ps-4 py-3">{item.id}</td>
                        <td className="py-3">{item.judul}</td>
                        <td className="py-3">{item.tanggal} {item.jam_mulai} - {item.jam_selesai}</td>
                        <td className="py-3">{lokasiOptions.find(l => l.id === item.lokasi)?.nama_lokasi || '-'}</td>
                        <td className="py-3">{adminOptions.find(u => u.id === item.penanggung_jawab)?.name || '-'}</td>
                        <td className="text-center py-3"><span className={`badge rounded-pill ${badge.color}`}>{badge.label}</span></td>
                        <td className="text-end pe-4 py-3">
                          <button className="btn btn-sm btn-warning me-1" onClick={() => openEditModal(item)}>Edit</button>
                          <button className="btn btn-sm btn-info" onClick={() => openLaporanModal(item)}>Laporan</button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Add/Edit */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className={`modal-header ${modalType === 'laporan' ? 'bg-info' : 'bg-success'} text-white`}>
                <h5 className="modal-title">
                  {modalType === 'add' && 'Tambah Kegiatan'}
                  {modalType === 'edit' && 'Edit Kegiatan'}
                  {modalType === 'laporan' && 'Buat Laporan'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body p-4">
                  {(modalType === 'add' || modalType === 'edit') && (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Jenis Kegiatan</label>
                        <select className="form-select" value={formData.jenis_kegiatan_id} onChange={handleJenisChange} disabled={modalType==='edit'} required>
                          <option value="">-- Pilih Jenis --</option>
                          {jenisKegiatanOptions.map(j => <option key={j.id} value={j.id}>{j.nama}</option>)}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">ID Kegiatan</label>
                        <input type="text" className="form-control" value={formData.id} readOnly />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Nama Kegiatan</label>
                        <input type="text" className="form-control" value={formData.judul} onChange={(e)=>setFormData({...formData, judul:e.target.value})} required/>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Tanggal</label>
                        <input type="date" className="form-control" value={formData.tanggal} onChange={(e)=>setFormData({...formData, tanggal:e.target.value})} required/>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Jam Mulai</label>
                        <input type="time" className="form-control" value={formData.jam_mulai} onChange={(e)=>setFormData({...formData, jam_mulai:e.target.value})} required/>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Jam Selesai</label>
                        <input type="time" className="form-control" value={formData.jam_selesai} onChange={(e)=>setFormData({...formData, jam_selesai:e.target.value})} required/>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Lokasi</label>
                        <select className="form-select" value={formData.lokasi} onChange={(e)=>setFormData({...formData, lokasi:parseInt(e.target.value)})} required>
                          <option value="">-- Pilih Lokasi --</option>
                          {lokasiOptions.map(l => <option key={l.id} value={l.id}>{l.nama_lokasi}</option>)}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Penanggung Jawab</label>
                        <select className="form-select" value={formData.penanggung_jawab} onChange={(e)=>setFormData({...formData, penanggung_jawab:parseInt(e.target.value)})} required>
                          <option value="">-- Pilih Admin --</option>
                          {adminOptions.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Deskripsi</label>
                        <textarea className="form-control" value={formData.deskripsi} onChange={(e)=>setFormData({...formData, deskripsi:e.target.value})}></textarea>
                      </div>
                    </>
                  )}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={()=>setShowModal(false)}>Batal</button>
                  <button type="submit" className="btn btn-success">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
