'use client'

import { useEffect, useState } from 'react'

export default function RiwayatPasien() {
  const [data, setData] = useState([])
  const [lokasiList, setLokasiList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false) // MODAL DETAIL BARU
  const [isEdit, setIsEdit] = useState(false)

  // TAMBAHKAN: Daftar penyakit untuk checkbox
  const penyakitOptions = [
    { id: 'dbd', name: 'DBD (Demam Berdarah Dengue)' },
    { id: 'tbc', name: 'TBC (Tuberkulosis)' },
    { id: 'hipertensi', name: 'Hipertensi' },
    { id: 'diabetes', name: 'Diabetes Melitus' },
    { id: 'asma', name: 'Asma' },
    { id: 'jantung', name: 'Penyakit Jantung' },
    { id: 'stroke', name: 'Stroke' },
    { id: 'kanker', name: 'Kanker' },
    { id: 'hiv', name: 'HIV/AIDS' },
    { id: 'hepatitis', name: 'Hepatitis' },
    { id: 'malaria', name: 'Malaria' },
    { id: 'tipus', name: 'Tifus/Tipes' },
    { id: 'diare', name: 'Diare Akut' },
    { id: 'pneumonia', name: 'Pneumonia' },
    { id: 'lainnya', name: 'Lainnya' }
  ]

  const [formData, setFormData] = useState({
    id: '',
    pasien_nama: '',
    penyakit: '', // String untuk menyimpan penyakit yang dipilih
    penyakitArray: [], // Array untuk checkbox
    lokasi_id: '',
    alamat: '',
    tanggal: ''
  })


  // ================= FETCH =================
  useEffect(() => {
    fetchData()
    fetchLokasi()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        alert('Token tidak ditemukan, silakan login ulang')
        return
      }

      const res = await fetch(
        'http://localhost:5001/api/admin/riwayat-pasien',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const result = await res.json()
      setData(Array.isArray(result) ? result : [])
    } catch (err) {
      console.error(err)
      alert('Gagal mengambil data pasien')
    } finally {
      setLoading(false)
    }
  }

  const fetchLokasi = async () => {
    const res = await fetch('http://localhost:5001/api/lokasi')
    const result = await res.json()
    setLokasiList(Array.isArray(result) ? result : [])
  }

  // ================= FILTER =================
  const filteredData = data.filter(item =>
    item.pasien_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.penyakit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ================= MODAL =================
  const openAdd = () => {
    setIsEdit(false)
    setFormData({
      id: '',
      pasien_nama: '',
      penyakit: '',
      penyakitArray: [],
      lokasi_id: '',
      alamat: '',
      tanggal: ''
    })
    setShowModal(true)
  }

  const openEdit = (item) => {
    setIsEdit(true)
    setSelectedItem(item)
    
    // Parse penyakit string menjadi array untuk checkbox
    const penyakitArray = item.penyakit ? item.penyakit.split(',').map(p => p.trim()) : []
    
    setFormData({
      id: item.id,
      pasien_nama: item.pasien_nama,
      penyakit: item.penyakit,
      penyakitArray: penyakitArray,
      lokasi_id: item.lokasi_id.toString(),
      alamat: item.alamat,
      tanggal: item.tanggal?.slice(0, 10)
    })
    setShowDetailModal(false)
    setShowModal(true)
  }

  const openDetail = (item) => {
    setSelectedItem(item)
    setShowDetailModal(true)
  }

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Token tidak ditemukan, silakan login ulang')
      return
    }

    const endpoint = isEdit
      ? `http://localhost:5001/api/admin/riwayat-pasien/${formData.id}`
      : 'http://localhost:5001/api/admin/riwayat-pasien'

    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          pasien_nama: formData.pasien_nama,
          penyakit: formData.penyakit,
          lokasi_id: parseInt(formData.lokasi_id),
          alamat: formData.alamat,
          tanggal: formData.tanggal
        })
      })

      const result = await res.json()

      if (!res.ok) {
        alert(result.message || 'Gagal menyimpan data')
        return
      }

      setShowModal(false)
      fetchData()
      alert(isEdit ? 'Data berhasil diperbarui' : 'Data berhasil ditambahkan')
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan koneksi')
    }
  }

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return
    const token = localStorage.getItem('token')

    try {
      const res = await fetch(
        `http://localhost:5001/api/admin/riwayat-pasien/${id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const result = await res.json()
      
      if (!res.ok) {
        alert(result.message || 'Gagal menghapus data')
        return
      }

      // Reset selected item jika yang dihapus adalah item yang sedang dipilih
      if (selectedItem && selectedItem.id === id) {
        setSelectedItem(null)
        setShowDetailModal(false)
      }
      
      fetchData()
      alert('Data berhasil dihapus')
    } catch (err) {
      console.error(err)
      alert('Terjadi kesalahan saat menghapus')
    }
  }

  const handlePenyakitCheckboxChange = (penyakitName) => {
    setFormData(prev => {
      const newPenyakitArray = prev.penyakitArray.includes(penyakitName)
        ? prev.penyakitArray.filter(p => p !== penyakitName) // Hapus jika sudah ada
        : [...prev.penyakitArray, penyakitName] // Tambah jika belum ada
      
      // Konversi array ke string untuk disimpan di database
      const penyakitString = newPenyakitArray.join(', ')
      
      return {
        ...prev,
        penyakitArray: newPenyakitArray,
        penyakit: penyakitString
      }
    })
  }

   // ================= HANDLE LAINNYA INPUT =================
  const handleLainnyaInputChange = (value) => {
    setFormData(prev => {
      // Filter out "Lainnya" dari array jika ada
      const filteredArray = prev.penyakitArray.filter(p => p !== 'Lainnya')
      const newPenyakitArray = value ? [...filteredArray, 'Lainnya'] : filteredArray
      
      // Gabungkan dengan input lainnya jika ada
      let penyakitString = newPenyakitArray.filter(p => p !== 'Lainnya').join(', ')
      if (value) {
        penyakitString += (penyakitString ? ', ' : '') + value
      }
      
      return {
        ...prev,
        penyakit: penyakitString,
        lainnyaValue: value
      }
    })
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
    <div className="container-fluid p-3">
      <div className="d-flex justify-content-between mb-3">
        <h4>Riwayat Penyakit Berat</h4>
        <button className="btn btn-success" onClick={openAdd}>
          <i className="fas fa-plus me-2"></i>Tambah Data
        </button>
      </div>

      <input
        className="form-control mb-3"
        placeholder="Cari nama, penyakit, atau alamat..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div className="row">
        {/* LIST */}
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-header bg-success text-white">
              Daftar Pasien ({filteredData.length})
            </div>
            <div className="list-group list-group-flush" style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {filteredData.map(item => (
                <button
                  key={item.id}
                  className={`list-group-item list-group-item-action ${
                    selectedItem?.id === item.id ? 'active' : ''
                  }`}
                  onClick={() => openDetail(item)}
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong>{item.pasien_nama}</strong>
                      <br />
                      <small className="text-muted">Penyakit: {item.penyakit}</small>
                      <br />
                      <small className="text-muted">
                        {item.nama_lokasi || 'Tidak diketahui'}
                      </small>
                    </div>
                    <span className="badge bg-secondary">
                      {new Date(item.tanggal).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DETAIL - Sederhana saja */}
        <div className="col-md-8">
          {selectedItem ? (
            <div className="card">
              <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
                <strong>Detail Pasien</strong>
                <button 
                  className="btn btn-sm btn-light"
                  onClick={() => openDetail(selectedItem)}
                >
                  <i className="fas fa-expand me-1"></i> Lihat Detail Lengkap
                </button>
              </div>
              
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <p><strong>Nama Pasien:</strong><br />{selectedItem.pasien_nama}</p>
                    <p><strong>Lokasi:</strong><br />{selectedItem.nama_lokasi || 'Tidak diketahui'}</p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Tanggal:</strong><br />
                      {new Date(selectedItem.tanggal).toLocaleDateString('id-ID')}
                    </p>
                    <p><strong>Penyakit:</strong><br />
                      <span className="badge bg-danger">{selectedItem.penyakit}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center py-5">
              <div className="card-body">
                <i className="fas fa-user-injured fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">Tidak ada data yang dipilih</h5>
                <p className="text-muted">Pilih data pasien dari daftar di samping untuk melihat detail</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL DETAIL */}
      {showDetailModal && selectedItem && (
        <div className="modal fade show d-block bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="fas fa-file-medical me-2"></i>
                  Detail Lengkap Pasien
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowDetailModal(false)}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <div className="card border-0 bg-light">
                      <div className="card-body">
                        <h6 className="text-muted mb-3">Informasi Pasien</h6>
                        <p><strong>Nama Lengkap:</strong><br />{selectedItem.pasien_nama}</p>
                        <p><strong>Desa/Kelurahan:</strong><br />{selectedItem.nama_lokasi || 'Tidak diketahui'}</p>
                        <p><strong>Tanggal Diagnosis:</strong><br />
                          {new Date(selectedItem.tanggal).toLocaleDateString('id-ID', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="card border-0 bg-danger text-white">
                      <div className="card-body">
                        <h6 className="mb-3">Diagnosis Penyakit</h6>
                        <h4 className="mb-0">{selectedItem.penyakit}</h4>
                        <p className="mb-0 mt-2">Jenis Penyakit Berat</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card mb-4">
                  <div className="card-header bg-light">
                    <strong>Alamat Lengkap</strong>
                  </div>
                  <div className="card-body">
                    <p className="mb-0">{selectedItem.alamat}</p>
                  </div>
                </div>

                <div className="card">
                  <div className="card-header bg-light">
                    <strong>Informasi Tambahan</strong>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <p><strong>ID Data:</strong> {selectedItem.id}</p>
                        <p><strong>Tanggal Input:</strong><br />
                          {new Date(selectedItem.created_at).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Terakhir Diperbarui:</strong><br />
                          {new Date(selectedItem.updated_at).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDetailModal(false)}
                >
                  <i className="fas fa-times me-1"></i>Tutup
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() => openEdit(selectedItem)}
                >
                  <i className="fas fa-edit me-1"></i>Edit Data
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(selectedItem.id)}
                >
                  <i className="fas fa-trash me-1"></i>Hapus Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH/EDIT */}
      {showModal && (
        <div className="modal fade show d-block bg-dark bg-opacity-50" style={{ zIndex: 1060 }}>
          <div className="modal-dialog modal-lg">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">
                  <i className="fas fa-file-medical me-2"></i>
                  {isEdit ? 'Edit' : 'Tambah'} Riwayat Penyakit
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowModal(false)}
                  aria-label="Close"
                ></button>
              </div>

              <div className="modal-body">
                <div className="row">
                  {/* NAMA PASIEN */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Nama Pasien *</label>
                    <input
                      className="form-control"
                      placeholder="Nama lengkap pasien"
                      value={formData.pasien_nama}
                      onChange={e =>
                        setFormData({ ...formData, pasien_nama: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* TANGGAL DIAGNOSIS */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Tanggal Diagnosis *</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.tanggal}
                      onChange={e =>
                        setFormData({ ...formData, tanggal: e.target.value })
                      }
                      required
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  {/* LOKASI */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Lokasi Desa *</label>
                    <select
                      className="form-select"
                      value={formData.lokasi_id}
                      onChange={e =>
                        setFormData({ ...formData, lokasi_id: e.target.value })
                      }
                      required
                    >
                      <option value="">-- Pilih Desa --</option>
                      {lokasiList.map(l => (
                        <option key={l.id} value={l.id}>
                          {l.nama_lokasi}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* JENIS PENYAKIT - CHECKBOX */}
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-bold">Jenis Penyakit *</label>
                    <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                      <div className="row">
                        {penyakitOptions.map((penyakit, index) => (
                          <div key={penyakit.id} className="col-md-6 mb-2">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`penyakit-${penyakit.id}`}
                                checked={formData.penyakitArray.includes(penyakit.name)}
                                onChange={() => handlePenyakitCheckboxChange(penyakit.name)}
                              />
                              <label 
                                className="form-check-label" 
                                htmlFor={`penyakit-${penyakit.id}`}
                                style={{ fontSize: '0.9rem' }}
                              >
                                {penyakit.name}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* INPUT LAINNYA */}
                      <div className="mt-3">
                        <label className="form-label fw-bold small">Penyakit Lainnya:</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Tulis penyakit lainnya (jika ada)"
                          value={formData.lainnyaValue || ''}
                          onChange={(e) => handleLainnyaInputChange(e.target.value)}
                        />
                        <small className="text-muted">Kosongkan jika tidak ada</small>
                      </div>
                    </div>
                    
                    {/* PREVIEW PENYAKIT YANG DIPILIH */}
                    {formData.penyakit && (
                      <div className="mt-2">
                        <small className="text-success fw-bold">
                          <i className="fas fa-check-circle me-1"></i>
                          Terpilih: {formData.penyakit}
                        </small>
                      </div>
                    )}
                  </div>

                  {/* ALAMAT */}
                  <div className="col-12 mb-3">
                    <label className="form-label fw-bold">Alamat Lengkap *</label>
                    <textarea
                      className="form-control"
                      placeholder="Alamat lengkap pasien (RT/RW, Dusun, Desa, Kecamatan)"
                      value={formData.alamat}
                      onChange={e =>
                        setFormData({ ...formData, alamat: e.target.value })
                      }
                      required
                      rows="3"
                    />
                  </div>

                  {/* SUMMARY */}
                  <div className="col-12">
                    <div className="alert alert-info">
                      <h6 className="mb-2">
                        <i className="fas fa-info-circle me-2"></i>
                        Ringkasan Data
                      </h6>
                      <div className="row">
                        <div className="col-md-6">
                          <p className="mb-1"><strong>Nama:</strong> {formData.pasien_nama || '-'}</p>
                          <p className="mb-1"><strong>Tanggal:</strong> {formData.tanggal || '-'}</p>
                        </div>
                        <div className="col-md-6">
                          <p className="mb-1"><strong>Penyakit:</strong></p>
                          <div className="d-flex flex-wrap gap-1">
                            {formData.penyakitArray.map((p, index) => (
                              <span key={index} className="badge bg-danger">
                                {p}
                              </span>
                            ))}
                            {formData.lainnyaValue && (
                              <span className="badge bg-warning text-dark">
                                {formData.lainnyaValue}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  <i className="fas fa-times me-1"></i>Batal
                </button>
                <button 
                  type="submit" 
                  className="btn btn-success"
                  disabled={!formData.penyakit || formData.penyakitArray.length === 0}
                >
                  <i className="fas fa-save me-1"></i>
                  {isEdit ? 'Perbarui Data' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}