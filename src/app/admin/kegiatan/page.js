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
    jenis_kegiatan_id: '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: '',
    lokasi: '',
    deskripsi: ''
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

  // 1. FETCH DATA
  const fetchKegiatan = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5000/api/kegiatan', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (!res.ok) throw new Error('Gagal mengambil data kegiatan')
      
      const data = await res.json()
      setKegiatanList(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchKegiatan()
  }, [])

  // 2. LOGIC GENERATE ID (Urut 001 per Jenis)
  const handleJenisChange = (e) => {
    const selectedId = parseInt(e.target.value)
    const selectedJenis = jenisKegiatanOptions.find(j => j.id === selectedId)
    
    if (!selectedJenis) {
        setFormData({ ...formData, jenis_kegiatan_id: '', id: '' })
        return
    }

    const relatedItems = kegiatanList.filter(item => 
        item.id && item.id.startsWith(selectedJenis.code + '-')
    );

    let maxNumber = 0;
    if (relatedItems.length > 0) {
        relatedItems.forEach(item => {
            const parts = item.id.split('-');
            if (parts.length === 2) {
                const num = parseInt(parts[1]);
                if (!isNaN(num) && num > maxNumber) {
                    maxNumber = num;
                }
            }
        });
    }

    const nextNumber = maxNumber + 1;
    const paddedNumber = nextNumber.toString().padStart(3, '0');
    const generatedId = `${selectedJenis.code}-${paddedNumber}`;

    setFormData({
      ...formData,
      jenis_kegiatan_id: selectedId,
      id: generatedId 
    })
  }

  // 3. LOGIC STATUS BADGE
  const getStatusBadge = (item) => {
    // Style badge disesuaikan dengan desain referensi
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
        // Warna kuning cerah untuk "Akan Datang"
        return { label: 'Akan Datang', color: 'bg-warning text-dark' }
    }
  }

  // MODAL HANDLERS
  const openAddModal = () => {
    setModalType('add')
    setFormData({ id: '', judul: '', jenis_kegiatan_id: '', tanggal: '', jam_mulai: '', jam_selesai: '', lokasi: '', deskripsi: '' })
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

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
        if (modalType === 'laporan') {
            const data = new FormData()
            data.append('kegiatan_id', laporanData.kegiatan_id)
            data.append('judul_laporan', laporanData.judul_laporan)
            data.append('detail_kegiatan', laporanData.detail_kegiatan)
            if (laporanData.file) data.append('img', laporanData.file)

            // const res = await fetch('http://localhost:5000/api/laporan', ...)
            alert(`Laporan berhasil dikirim!`)
            
        } else if (modalType === 'add') {
            const res = await fetch('http://localhost:5000/api/kegiatan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            })
            if (!res.ok) throw new Error('Gagal menambah kegiatan')
            alert('Kegiatan berhasil ditambahkan!')
        } else if (modalType === 'edit') {
            alert('Perubahan disimpan!')
        }
        setShowModal(false)
        fetchKegiatan()
    } catch (err) {
        alert(err.message)
    }
  }

  // CETAK / PDF
  const handlePrint = (item) => {
    // Template HTML untuk PDF/Cetak
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan - ${item.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #198754; padding-bottom: 10px; }
            .header h1 { color: #198754; margin: 0; font-size: 24px; text-transform: uppercase; }
            .header p { margin: 5px 0; color: #666; font-size: 14px; }
            .title { text-align: center; margin: 30px 0; text-decoration: underline; font-weight: bold; font-size: 18px; }
            .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px; }
            .meta-table th, .meta-table td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            .meta-table th { background-color: #f8f9fa; width: 30%; color: #555; }
            .content { margin-top: 20px; }
            .content h3 { border-bottom: 1px solid #ddd; padding-bottom: 10px; color: #198754; font-size: 16px; }
            .content p { line-height: 1.6; text-align: justify; font-size: 14px; }
            .footer { margin-top: 60px; text-align: right; font-size: 14px; color: #333; }
            .signature { margin-top: 80px; border-top: 1px solid #333; display: inline-block; width: 200px; text-align: center; padding-top: 5px; }
            @media print {
              @page { size: A4; margin: 20mm; }
              body { -webkit-print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PUSKESMAS CICALENGKA</h1>
            <p>Jl. Raya Cicalengka No. 123, Kabupaten Bandung, Jawa Barat</p>
            <p>Telp: (022) 1234567 | Email: info@puskesmascicalengka.go.id</p>
          </div>

          <div class="title">LAPORAN HASIL KEGIATAN</div>

          <table class="meta-table">
            <tr><th>ID Kegiatan</th><td><strong>${item.id}</strong></td></tr>
            <tr><th>Nama Kegiatan</th><td>${item.judul}</td></tr>
            <tr><th>Jenis Kegiatan</th><td>${
              item.jenis_kegiatan_id === 1 ? 'Penyuluhan' : 
              item.jenis_kegiatan_id === 2 ? 'Vaksinasi' :
              item.jenis_kegiatan_id === 3 ? 'Rapat' : 'Posyandu'
            }</td></tr>
            <tr><th>Tanggal</th><td>${new Date(item.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</td></tr>
            <tr><th>Waktu</th><td>${item.jam_mulai?.substring(0,5)} - ${item.jam_selesai?.substring(0,5)} WIB</td></tr>
            <tr><th>Lokasi</th><td>${item.lokasi}</td></tr>
            <tr><th>Status</th><td>${item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : '-'}</td></tr>
          </table>

          <div class="content">
            <h3>Detail / Deskripsi Kegiatan</h3>
            <p>${item.deskripsi || 'Tidak ada deskripsi detail untuk kegiatan ini.'}</p>
          </div>

          <div class="footer">
            <p>Cicalengka, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <div class="signature">
              Admin Puskesmas
            </div>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    
    // Buka window baru untuk cetak
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    } else {
      alert('Pop-up diblokir. Tolong izinkan pop-up untuk mencetak.');
    }
  }

  // Helpers
  const formatTanggal = (d) => new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
  const formatWaktu = (t) => t ? t.substring(0, 5) : '-'
  
  const filteredList = kegiatanList.filter(item => 
    item.judul?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>

  return (
    <div className="container-fluid p-4 min-vh-100" style={{backgroundColor: '#f4f6f9'}}>
      {/* PAGE HEADER */}
      <div className="mb-4">
        <h2 className="fw-bold text-dark mb-1">Manajemen Kegiatan</h2>
        <p className="text-muted">Kelola jadwal dan laporan kegiatan puskesmas</p>
      </div>

      {/* TOOLBAR: Search & Add Button */}
      <div className="card border-0 shadow-sm mb-4 rounded-3">
        <div className="card-body p-3">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                <button 
                    onClick={openAddModal} 
                    className="btn btn-primary fw-bold px-4 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2" 
                    style={{backgroundColor: '#0d6efd', borderColor: '#0d6efd'}}
                >
                    <i className="fas fa-plus"></i> Tambah Kegiatan
                </button>
                
                <div className="input-group" style={{maxWidth: '400px'}}>
                    <span className="input-group-text bg-white border-end-0 ps-3 text-muted">
                        <i className="fas fa-search"></i>
                    </span>
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

      {/* TABLE SECTION */}
      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
        {/* Header Tabel Hijau Solid */}
        <div className="card-header mb-2 bg-success text-white py-3 px-4 border-0" style={{backgroundColor: '#198754'}}>
          <h5 className="mb-0 text-white fw-bold d-flex align-items-center gap-2">
            <i className="fas fa-list-ul"></i> Daftar Kegiatan
          </h5>
        </div>
        
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead style={{backgroundColor: '#157347'}}> 
                <tr>
                  <th className="py-3 ps-4 text-uppercase small fw-bold text-white" style={{width: '12%'}}>ID</th>
                  <th className="py-3 text-uppercase small fw-bold text-white" style={{width: '25%'}}>Nama Kegiatan</th>
                  <th className="py-3 text-uppercase small fw-bold text-white" style={{width: '20%'}}>Waktu</th>
                  <th className="py-3 text-uppercase small fw-bold text-white" style={{width: '20%'}}>Lokasi</th>
                  <th className="py-3 text-center text-uppercase small fw-bold text-white" style={{width: '13%'}}>Status</th>
                  <th className="py-3 pe-4 text-end text-uppercase small fw-bold text-white" style={{width: '10%'}}>Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredList.length === 0 ? (
                    <tr><td colSpan="6" className="py-5 text-center text-muted">Data tidak ditemukan</td></tr>
                ) : (
                    filteredList.map((item) => {
                        const badge = getStatusBadge(item);
                        return (
                            <tr key={item.id} style={{borderBottom: '1px solid #f0f0f0'}}>
                                <td className="ps-4 py-3">
                                    <span className="badge bg-dark rounded-pill px-3 py-2 fw-normal shadow-sm" style={{letterSpacing: '0.5px'}}>
                                        {item.id}
                                    </span>
                                </td>
                                <td className="py-3">
                                    <div className="fw-bold text-dark mb-1" style={{fontSize: '0.95rem'}}>{item.judul}</div>
                                    <small className="text-muted d-flex align-items-center gap-1">
                                        <i className="fas fa-tag fa-xs"></i>
                                        {item.jenis_kegiatan_id === 1 ? 'Penyuluhan' : 
                                         item.jenis_kegiatan_id === 2 ? 'Vaksinasi' :
                                         item.jenis_kegiatan_id === 3 ? 'Rapat' : 'Posyandu'}
                                    </small>
                                </td>
                                <td className="py-3">
                                    <div className="d-flex flex-column">
                                        <span className="fw-bold text-dark" style={{fontSize: '0.9rem'}}>
                                            {formatTanggal(item.tanggal)}
                                        </span>
                                        <small className="text-muted mt-1">
                                            <i className="far fa-clock me-1"></i>
                                            {formatWaktu(item.jam_mulai)} - {formatWaktu(item.jam_selesai)} WIB
                                        </small>
                                    </div>
                                </td>
                                <td className="py-3">
                                    <div className="d-flex align-items-center text-secondary">
                                        <i className="fas fa-map-marker-alt me-2 text-danger opacity-75"></i>
                                        <span className="text-truncate" style={{maxWidth: '180px'}}>{item.lokasi}</span>
                                    </div>
                                </td>
                                <td className="text-center py-3">
                                    <span className={`badge rounded-pill px-3 py-2 fw-normal ${badge.color} border border-opacity-10 shadow-sm`}>
                                        {badge.label}
                                    </span>
                                </td>
                                <td className="text-end pe-4 py-3">
                                    <div className="d-flex justify-content-end gap-2">
                                        {/* Edit Button - Yellow Box Style */}
                                        <button 
                                            className="btn btn-sm btn-warning text-white shadow-sm" 
                                            onClick={() => openEditModal(item)} 
                                            title="Edit"
                                            style={{width: '32px', height: '32px', padding: '0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}
                                        >
                                            <i className="fas fa-pen fa-xs"></i>
                                        </button>
                                        
                                        {/* Laporan Button - Blue Box Style */}
                                        {(badge.label === 'Butuh Laporan' || badge.label === 'Sedang Berlangsung') && (
                                            <button 
                                                className="btn btn-sm btn-primary shadow-sm" 
                                                onClick={() => openLaporanModal(item)} 
                                                title="Buat Laporan"
                                                style={{width: '32px', height: '32px', padding: '0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}
                                            >
                                                <i className="fas fa-file-upload fa-xs"></i>
                                            </button>
                                        )}

                                        {/* Cetak Button - Grey Box Style */}
                                        {(item.has_laporan || badge.label === 'Verifikasi Laporan' || badge.label === 'Selesai') && (
                                            <button 
                                                className="btn btn-sm btn-secondary shadow-sm" 
                                                onClick={() => handlePrint(item)} 
                                                title="Cetak / PDF"
                                                style={{width: '32px', height: '32px', padding: '0', display: 'inline-flex', alignItems: 'center', justifyContent: 'center'}}
                                            >
                                                <i className="fas fa-print fa-xs"></i>
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card-footer bg-white py-3 border-top">
            <small className="text-muted">Menampilkan {filteredList.length} dari {kegiatanList.length} kegiatan</small>
        </div>
      </div>

      {/* --- MODAL GLOBAL --- */}
      {showModal && (
        <>
            <div className="modal-backdrop show" style={{opacity: 0.5}}></div>
            <div className="modal show d-block" tabIndex="-1">
                <div className="modal-dialog modal-lg modal-dialog-centered">
                    <div className="modal-content border-0 shadow-lg rounded-3">
                        <div className={`modal-header text-white ${modalType === 'laporan' ? 'bg-info' : 'bg-success'}`} style={{borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem'}}>
                            <h5 className="modal-title fw-bold text-white">
                                {modalType === 'add' && <><i className="fas fa-plus-circle me-2"></i>Tambah Kegiatan Baru</>}
                                {modalType === 'edit' && <><i className="fas fa-edit me-2"></i>Edit Kegiatan</>}
                                {modalType === 'laporan' && <><i className="fas fa-file-contract me-2"></i>Buat Laporan Kegiatan</>}
                            </h5>
                            <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                        </div>
                        
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body p-4">
                                {/* FORM CONTENT (SAMA SEPERTI SEBELUMNYA) */}
                                {(modalType === 'add' || modalType === 'edit') && (
                                    <div className="row g-3">
                                        <div className="col-12 bg-light p-3 rounded border mb-2">
                                            <h6 className="text-muted mb-3 text-uppercase small fw-bold">Informasi Dasar</h6>
                                            <div className="row g-3">
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold small text-muted">Jenis Kegiatan</label>
                                                    <select className="form-select" name="jenis_kegiatan_id" value={formData.jenis_kegiatan_id} onChange={handleJenisChange} disabled={modalType === 'edit'} required>
                                                        <option value="">-- Pilih Jenis --</option>
                                                        {jenisKegiatanOptions.map(opt => (<option key={opt.id} value={opt.id}>{opt.nama}</option>))}
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <label className="form-label fw-bold small text-muted">ID Kegiatan</label>
                                                    <input type="text" className="form-control bg-white text-primary fw-bold" value={formData.id} readOnly />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12"><label className="form-label fw-bold small">Nama Kegiatan</label><input type="text" className="form-control" value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} required placeholder="Contoh: Penyuluhan Kesehatan"/></div>
                                        <div className="col-md-4"><label className="form-label fw-bold small">Tanggal</label><input type="date" className="form-control" value={formData.tanggal ? formData.tanggal.split('T')[0] : ''} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} required/></div>
                                        <div className="col-md-4"><label className="form-label fw-bold small">Mulai</label><input type="time" className="form-control" value={formData.jam_mulai} onChange={(e) => setFormData({...formData, jam_mulai: e.target.value})} required/></div>
                                        <div className="col-md-4"><label className="form-label fw-bold small">Selesai</label><input type="time" className="form-control" value={formData.jam_selesai} onChange={(e) => setFormData({...formData, jam_selesai: e.target.value})} required/></div>
                                        <div className="col-12"><label className="form-label fw-bold small">Lokasi</label><input type="text" className="form-control" value={formData.lokasi} onChange={(e) => setFormData({...formData, lokasi: e.target.value})} required placeholder="Lokasi lengkap"/></div>
                                        <div className="col-12"><label className="form-label fw-bold small">Deskripsi</label><textarea className="form-control" rows="3" value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}></textarea></div>
                                    </div>
                                )}
                                {modalType === 'laporan' && (
                                    <div className="row g-3">
                                        <div className="col-12"><label className="form-label fw-bold">Judul Laporan</label><input type="text" className="form-control" value={laporanData.judul_laporan} onChange={(e) => setLaporanData({...laporanData, judul_laporan: e.target.value})} required/></div>
                                        <div className="col-12"><label className="form-label fw-bold">Detail</label><textarea className="form-control" rows="5" value={laporanData.detail_kegiatan} onChange={(e) => setLaporanData({...laporanData, detail_kegiatan: e.target.value})} required></textarea></div>
                                        <div className="col-12"><label className="form-label fw-bold">Foto</label><input type="file" className="form-control" accept="image/*" onChange={(e) => setLaporanData({...laporanData, file: e.target.files[0]})}/></div>
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer bg-light" style={{borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem'}}>
                                <button type="button" className="btn btn-light border" onClick={() => setShowModal(false)}>Batal</button>
                                <button type="submit" className={`btn ${modalType === 'laporan' ? 'btn-info text-white' : 'btn-success'}`}>Simpan</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
      )}
    </div>
  )
}
