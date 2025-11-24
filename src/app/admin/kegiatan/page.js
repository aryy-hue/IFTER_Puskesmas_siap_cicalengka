'use client'

import { useState, useEffect } from 'react'
import TambahKegiatan from '../../../../components/TambahKegiatan';

// Data desa dan kegiatan (dengan koordinat sebenarnya di Cicalengka)
// Di dalam komponen AdminDashboard, update dataDesa:
const dataDesa = [
    {
        id: 1,
        nama: "Desa Cicalengka Kulon",
        lat: -6.984948981921765,
        lng: 107.83652157538909,
        kegiatan: [
            {
                idKegiatan: "PS-0001", // Primary key sebagai string
                nama: "Sosialisasi Kesehatan Reproduksi Remaja",
                tanggalMulai: "2023-06-12",
                tanggalSelesai: "2023-06-12",
                jamMulai: "09:00",
                jamSelesai: "11:00",
                lokasi: "Balai Desa Cicalengka Kulon",
                penanggungJawab: "admin1",
                status: "selesai",
                deskripsi: "Edukasi tentang kesehatan reproduksi bagi remaja di Desa Cicalengka Kulon"
            },
            {
                idKegiatan: "VS-0001", // Primary key sebagai string
                nama: "Vaksinasi COVID-19 Dosis Ke-3",
                tanggalMulai: "2023-06-15",
                tanggalSelesai: "2023-06-15",
                jamMulai: "08:00",
                jamSelesai: "12:00",
                lokasi: "Puskesmas Cicalengka",
                penanggungJawab: "admin2",
                status: "akan-datang",
                deskripsi: "Pelaksanaan vaksinasi COVID-19 dosis ketiga untuk warga desa"
            },
        ]
    },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalKegiatan: 0,
    totalLaporan: 0,
    totalPasien: 0
  })

  const [showModal, setShowModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDesa, setSelectedDesa] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedKegiatan, setSelectedKegiatan] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [today, setToday] = useState('')

  useEffect(() => {
    const totalKegiatan = dataDesa.reduce((total, desa) => {
      return total + (desa.kegiatan ? desa.kegiatan.length : 0)
    }, 0)

    setStats({
      totalKegiatan: totalKegiatan,
      totalLaporan: 8,
      totalPasien: 124
    })

    // Set tanggal hari ini
    setToday(new Date().toISOString().split('T')[0])
  }, [])

  // Data dropdown penanggung jawab
  const penanggungJawabOptions = [
    { value: '', label: 'Pilih Penanggung Jawab' },
    { value: 'admin1', label: 'Admin 1' },
    { value: 'admin2', label: 'Admin 2' },
    { value: 'admin3', label: 'Admin 3' }
  ]

  const handleTambahKegiatan = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleSuccess = () => {
    console.log('Kegiatan berhasil ditambahkan')
  }

  const handleViewDetail = (kegiatan) => {
    setSelectedKegiatan(kegiatan)
    setShowDetailModal(true)
  }

  const handleEdit = (kegiatan) => {
    setSelectedKegiatan(kegiatan)
    setEditFormData({
      namaKegiatan: kegiatan.nama,
      lokasi: kegiatan.lokasi,
      tanggalMulai: kegiatan.tanggalMulai,
      tanggalSelesai: kegiatan.tanggalSelesai,
      penanggungJawab: kegiatan.penanggungJawab,
      jamMulai: kegiatan.jamMulai,
      jamSelesai: kegiatan.jamSelesai,
      deskripsi: kegiatan.deskripsi,
      status: kegiatan.status
    })
    setShowEditModal(true)
  }

  const handleCloseDetailModal = () => {
    setShowDetailModal(false)
    setSelectedKegiatan(null)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setSelectedKegiatan(null)
    setEditFormData({})
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prevState => ({
      ...prevState,
      [name]: value
    }))

    // Jika tanggal mulai diubah, update min tanggal selesai
    if (name === 'tanggalMulai' && editFormData.tanggalSelesai && value > editFormData.tanggalSelesai) {
      setEditFormData(prevState => ({
        ...prevState,
        tanggalSelesai: value
      }))
    }
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    
    // Validasi tanggal
    if (editFormData.tanggalMulai > editFormData.tanggalSelesai) {
      alert('Tanggal selesai tidak boleh sebelum tanggal mulai!')
      return
    }

    console.log('Menyimpan perubahan:', editFormData)
    // Di sini Anda bisa menambahkan logika untuk menyimpan perubahan ke database
    setShowEditModal(false)
    setSelectedKegiatan(null)
    setEditFormData({})
  }

  // Filter kegiatan berdasarkan desa dan status
  const getFilteredKegiatan = () => {
    let filteredKegiatan = []

    dataDesa.forEach(desa => {
      if (desa.kegiatan) {
        if (selectedDesa === 'all' || desa.nama === selectedDesa) {
          desa.kegiatan.forEach(kegiatan => {
            if (selectedStatus === 'all' || kegiatan.status === selectedStatus) {
              filteredKegiatan.push({
                ...kegiatan,
                desa: desa.nama
              })
            }
          })
        }
      }
    })

    return filteredKegiatan
  }

  const filteredKegiatan = getFilteredKegiatan()

  const getStatusBadge = (status) => {
    switch(status) {
      case 'selesai':
        return <span className="badge bg-success">Selesai</span>
      case 'akan-datang':
        return <span className="badge bg-warning text-dark">Akan Datang</span>
      case 'dibatalkan':
        return <span className="badge bg-danger">Dibatalkan</span>
      default:
        return <span className="badge bg-secondary">{status}</span>
    }
  }

  const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatWaktu = (jamMulai, jamSelesai) => {
    return `${jamMulai} - ${jamSelesai}`
  }

  const getPenanggungJawabLabel = (value) => {
    const option = penanggungJawabOptions.find(opt => opt.value === value)
    return option ? option.label : value
  }

  return (
    <div>
      <h1 className="h3 mb-4">Dashboard Admin</h1>
      
      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3 mb-3">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={handleTambahKegiatan}
                  >
                    <i className="fas fa-plus me-2"></i>Tambah Kegiatan
                  </button>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/laporan" className="btn btn-outline-success w-100">
                    <i className="fas fa-file me-2"></i>Buat Laporan
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <a href="/admin/riwayat-pasien" className="btn btn-outline-info w-100">
                    <i className="fas fa-search me-2"></i>Cari Pasien
                  </a>
                </div>
                <div className="col-md-3 mb-3">
                  <button className="btn btn-outline-warning w-100">
                    <i className="fas fa-print me-2"></i>Cetak Laporan
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Kegiatan */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">Daftar Kegiatan</h5>
              <div className="d-flex gap-2">
                <select 
                  className="form-select form-select-sm" 
                  style={{width: 'auto'}}
                  value={selectedDesa}
                  onChange={(e) => setSelectedDesa(e.target.value)}
                >
                  <option value="all">Semua Desa</option>
                  {dataDesa.filter(desa => desa.kegiatan).map(desa => (
                    <option key={desa.id} value={desa.nama}>
                      {desa.nama}
                    </option>
                  ))}
                </select>

                <select 
                  className="form-select form-select-sm" 
                  style={{width: 'auto'}}
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="all">Semua Status</option>
                  <option value="selesai">Selesai</option>
                  <option value="akan-datang">Akan Datang</option>
                </select>
              </div>
            </div>
            <div className="card-body">
              {filteredKegiatan.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead>
                      <tr>
                        <th>ID Kegiatan</th>
                        <th>Nama Kegiatan</th>
                        <th>Desa</th>
                        <th>Tanggal</th>
                        <th>Waktu</th>
                        <th>Lokasi</th>
                        <th>Penanggung Jawab</th>
                        <th>Status</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredKegiatan.map((kegiatan) => (
                        <tr key={kegiatan.idKegiatan}> {/* Gunakan idKegiatan sebagai key */}
                          <td>
                            <span className="badge bg-dark">
                              {kegiatan.idKegiatan}
                            </span>
                          </td>
                          <td>
                            <strong>{kegiatan.nama}</strong>
                          </td>
                          <td>{kegiatan.desa}</td>
                          <td>
                            <small>{formatTanggal(kegiatan.tanggalMulai)}</small>
                            {kegiatan.tanggalMulai !== kegiatan.tanggalSelesai && (
                              <>
                                <br />
                                <small className="text-muted">
                                  s/d {formatTanggal(kegiatan.tanggalSelesai)}
                                </small>
                              </>
                            )}
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {formatWaktu(kegiatan.jamMulai, kegiatan.jamSelesai)}
                            </span>
                          </td>
                          <td>
                            <small>{kegiatan.lokasi}</small>
                          </td>
                          <td>
                            <span className="badge bg-primary">
                              {getPenanggungJawabLabel(kegiatan.penanggungJawab)}
                            </span>
                          </td>
                          <td>{getStatusBadge(kegiatan.status)}</td>
                          <td>
                            <div className="btn-group btn-group-sm">
                              <button 
                                className="btn btn-outline-primary"
                                title="Edit Kegiatan"
                                onClick={() => handleEdit(kegiatan)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button 
                                className="btn btn-outline-info"
                                title="Lihat Detail"
                                onClick={() => handleViewDetail(kegiatan)}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Tidak ada kegiatan yang ditemukan</p>
                </div>
              )}
            </div>
            <div className="card-footer">
              <small className="text-muted">
                Menampilkan {filteredKegiatan.length} dari {stats.totalKegiatan} kegiatan
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Kegiatan */}
      <TambahKegiatan 
        show={showModal}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />

      {/* Modal Edit Kegiatan - SAMA PERSIS dengan modal tambah */}
      {showEditModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-warning text-dark">
                <h5 className="modal-title">Edit Kegiatan</h5>
                <button type="button" className="btn-close" onClick={handleCloseEditModal}></button>
              </div>
              <form onSubmit={handleSaveEdit}>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editNamaKegiatan" className="form-label">Nama Kegiatan *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="editNamaKegiatan"
                        name="namaKegiatan"
                        value={editFormData.namaKegiatan || ''}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editLokasi" className="form-label">Lokasi *</label>
                      <input
                        type="text"
                        className="form-control"
                        id="editLokasi"
                        name="lokasi"
                        value={editFormData.lokasi || ''}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editTanggalMulai" className="form-label">Tanggal Mulai *</label>
                      <input
                        type="date"
                        className="form-control"
                        id="editTanggalMulai"
                        name="tanggalMulai"
                        value={editFormData.tanggalMulai || ''}
                        onChange={handleEditChange}
                        min={today}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editTanggalSelesai" className="form-label">Tanggal Selesai *</label>
                      <input
                        type="date"
                        className="form-control"
                        id="editTanggalSelesai"
                        name="tanggalSelesai"
                        value={editFormData.tanggalSelesai || ''}
                        onChange={handleEditChange}
                        min={editFormData.tanggalMulai || today}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editJamMulai" className="form-label">Jam Mulai *</label>
                      <input
                        type="time"
                        className="form-control"
                        id="editJamMulai"
                        name="jamMulai"
                        value={editFormData.jamMulai || ''}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="editJamSelesai" className="form-label">Jam Selesai *</label>
                      <input
                        type="time"
                        className="form-control"
                        id="editJamSelesai"
                        name="jamSelesai"
                        value={editFormData.jamSelesai || ''}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="editPenanggungJawab" className="form-label">Penanggung Jawab *</label>
                      <select
                        className="form-select"
                        id="editPenanggungJawab"
                        name="penanggungJawab"
                        value={editFormData.penanggungJawab || ''}
                        onChange={handleEditChange}
                        required
                      >
                        {penanggungJawabOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="editStatus" className="form-label">Status *</label>
                      <select
                        className="form-select"
                        id="editStatus"
                        name="status"
                        value={editFormData.status || ''}
                        onChange={handleEditChange}
                        required
                      >
                        <option value="selesai">Selesai</option>
                        <option value="akan-datang">Akan Datang</option>
                        <option value="dibatalkan">Dibatalkan</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="editDeskripsi" className="form-label">Deskripsi Kegiatan</label>
                    <textarea
                      className="form-control"
                      id="editDeskripsi"
                      name="deskripsi"
                      rows="4"
                      value={editFormData.deskripsi || ''}
                      onChange={handleEditChange}
                      placeholder="Deskripsikan detail kegiatan..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseEditModal}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <i className="fas fa-save me-2"></i>Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lihat Detail Kegiatan */}
      {showDetailModal && selectedKegiatan && (
        <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Detail Kegiatan</h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseDetailModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Informasi Kegiatan</h6>
                    <table className="table table-borderless">
                      <tbody>
                        <tr>
                          <td><strong>Nama Kegiatan</strong></td>
                          <td>{selectedKegiatan.nama}</td>
                        </tr>
                        <tr>
                          <td><strong>Desa</strong></td>
                          <td>{selectedKegiatan.desa}</td>
                        </tr>
                        <tr>
                          <td><strong>Lokasi</strong></td>
                          <td>{selectedKegiatan.lokasi}</td>
                        </tr>
                        <tr>
                          <td><strong>Tanggal</strong></td>
                          <td>
                            {formatTanggal(selectedKegiatan.tanggalMulai)}
                            {selectedKegiatan.tanggalMulai !== selectedKegiatan.tanggalSelesai && (
                              <>
                                <br />
                                s/d {formatTanggal(selectedKegiatan.tanggalSelesai)}
                              </>
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Waktu</strong></td>
                          <td>{formatWaktu(selectedKegiatan.jamMulai, selectedKegiatan.jamSelesai)}</td>
                        </tr>
                        <tr>
                          <td><strong>Penanggung Jawab</strong></td>
                          <td>
                            <span className="badge bg-primary">
                              {getPenanggungJawabLabel(selectedKegiatan.penanggungJawab)}
                            </span>
                          </td>
                        </tr>
                        <tr>
                          <td><strong>Status</strong></td>
                          <td>{getStatusBadge(selectedKegiatan.status)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="col-md-6">
                    <h6>Deskripsi Kegiatan</h6>
                    <div className="card">
                      <div className="card-body">
                        <p className="mb-0">{selectedKegiatan.deskripsi}</p>
                      </div>
                    </div>
                    
                    <h6 className="mt-3">Statistik Kehadiran</h6>
                    <div className="row text-center">
                      <div className="col-4">
                        <div className="border rounded p-2">
                          <h4 className="text-primary mb-0">85</h4>
                          <small>Peserta</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="border rounded p-2">
                          <h4 className="text-success mb-0">78</h4>
                          <small>Hadir</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="border rounded p-2">
                          <h4 className="text-warning mb-0">7</h4>
                          <small>Tidak Hadir</small>
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
                  onClick={handleCloseDetailModal}
                >
                  Tutup
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    handleCloseDetailModal();
                    handleEdit(selectedKegiatan);
                  }}
                >
                  <i className="fas fa-edit me-2"></i>Edit Kegiatan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}