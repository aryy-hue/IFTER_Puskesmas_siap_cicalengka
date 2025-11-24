'use client'

import { useState, useEffect } from 'react'

export default function TambahKegiatan({ show, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    kodeKegiatan: '',
    nomorUrut: '',
    namaKegiatan: '',
    lokasi: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    penanggungJawab: '',
    jamMulai: '',
    jamSelesai: '',
    deskripsi: ''
  })

  const [today, setToday] = useState('')
  const [lastNumbers, setLastNumbers] = useState({})

  useEffect(() => {
    // Set tanggal hari ini
    setToday(new Date().toISOString().split('T')[0])
    
    // Simulasi mendapatkan nomor urut terakhir untuk setiap kode
    // Untuk demo, kita set default
    setLastNumbers({
      'PS': 1,
      'VS': 1,
      'Sosialisasi': 1,
      'PK': 1,
      'KG': 1
    })
  }, [])

  // Data dropdown kode kegiatan
  const kodeKegiatanOptions = [
    { value: '', label: 'Pilih Kode Kegiatan' },
    { value: 'PS', label: 'PS - Penyuluhan Kesehatan' },
    { value: 'VS', label: 'VS - Vaksinasi' },
    { value: 'Sosialisasi', label: 'Sosialisasi - Sosialisasi Kesehatan' },
    { value: 'PK', label: 'PK - Pemeriksaan Kesehatan' },
    { value: 'KG', label: 'KG - Kegiatan Gotong Royong' }
  ]

  // Data dropdown penanggung jawab
  const penanggungJawabOptions = [
    { value: '', label: 'Pilih Penanggung Jawab' },
    { value: 'admin1', label: 'Admin 1' },
    { value: 'admin2', label: 'Admin 2' },
    { value: 'admin3', label: 'Admin 3' }
  ]

  // Generate ID Kegiatan otomatis
  const generateIdKegiatan = () => {
    if (!formData.kodeKegiatan) return ''
    const nomor = formData.nomorUrut || (lastNumbers[formData.kodeKegiatan] + 1)
    return `${formData.kodeKegiatan}-${nomor.toString().padStart(4, '0')}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))

    // Jika tanggal mulai diubah, update min tanggal selesai
    if (name === 'tanggalMulai' && formData.tanggalSelesai && value > formData.tanggalSelesai) {
      setFormData(prevState => ({
        ...prevState,
        tanggalSelesai: value
      }))
    }

    // Jika kode kegiatan dipilih, generate nomor urut otomatis
    if (name === 'kodeKegiatan' && value) {
      const nextNumber = lastNumbers[value] + 1
      setFormData(prevState => ({
        ...prevState,
        nomorUrut: nextNumber.toString()
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validasi tanggal
    if (formData.tanggalMulai > formData.tanggalSelesai) {
      alert('Tanggal selesai tidak boleh sebelum tanggal mulai!')
      return
    }

    // Generate ID Kegiatan final (ini yang jadi primary key)
    const idKegiatan = generateIdKegiatan()
    const dataToSubmit = {
      idKegiatan: idKegiatan, // Primary key sebagai string
      kodeKegiatan: formData.kodeKegiatan,
      nomorUrut: formData.nomorUrut,
      nama: formData.namaKegiatan,
      lokasi: formData.lokasi,
      tanggalMulai: formData.tanggalMulai,
      tanggalSelesai: formData.tanggalSelesai,
      penanggungJawab: formData.penanggungJawab,
      jamMulai: formData.jamMulai,
      jamSelesai: formData.jamSelesai,
      deskripsi: formData.deskripsi,
      status: 'akan-datang' // Default status
    }

    console.log('Data kegiatan:', dataToSubmit)
    
    // Update last number untuk kode yang dipilih
    if (formData.kodeKegiatan) {
      setLastNumbers(prev => ({
        ...prev,
        [formData.kodeKegiatan]: parseInt(formData.nomorUrut)
      }))
    }
    
    // Reset form
    setFormData({
      kodeKegiatan: '',
      nomorUrut: '',
      namaKegiatan: '',
      lokasi: '',
      tanggalMulai: '',
      tanggalSelesai: '',
      penanggungJawab: '',
      jamMulai: '',
      jamSelesai: '',
      deskripsi: ''
    })
    
    if (onSuccess) {
      onSuccess(dataToSubmit) // Kirim data yang sudah lengkap
    }
    onClose()
  }

  const handleClose = () => {
    setFormData({
      kodeKegiatan: '',
      nomorUrut: '',
      namaKegiatan: '',
      lokasi: '',
      tanggalMulai: '',
      tanggalSelesai: '',
      penanggungJawab: '',
      jamMulai: '',
      jamSelesai: '',
      deskripsi: ''
    })
    onClose()
  }

  if (!show) return null

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Tambah Kegiatan Baru</h5>
            <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {/* Baris baru untuk Kode Kegiatan dan Nomor Urut */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="kodeKegiatan" className="form-label">Kode Kegiatan *</label>
                  <select
                    className="form-select"
                    id="kodeKegiatan"
                    name="kodeKegiatan"
                    value={formData.kodeKegiatan}
                    onChange={handleChange}
                    required
                  >
                    {kodeKegiatanOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="nomorUrut" className="form-label">Nomor Urut *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nomorUrut"
                    name="nomorUrut"
                    value={formData.nomorUrut}
                    onChange={handleChange}
                    placeholder="Otomatis terisi"
                    readOnly
                    required
                  />
                  <div className="form-text">
                    ID Kegiatan: <strong className="text-primary">{generateIdKegiatan()}</strong>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="namaKegiatan" className="form-label">Nama Kegiatan *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="namaKegiatan"
                    name="namaKegiatan"
                    value={formData.namaKegiatan}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="lokasi" className="form-label">Lokasi *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lokasi"
                    name="lokasi"
                    value={formData.lokasi}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="tanggalMulai" className="form-label">Tanggal Mulai *</label>
                  <input
                    type="date"
                    className="form-control"
                    id="tanggalMulai"
                    name="tanggalMulai"
                    value={formData.tanggalMulai}
                    onChange={handleChange}
                    min={today}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="tanggalSelesai" className="form-label">Tanggal Selesai *</label>
                  <input
                    type="date"
                    className="form-control"
                    id="tanggalSelesai"
                    name="tanggalSelesai"
                    value={formData.tanggalSelesai}
                    onChange={handleChange}
                    min={formData.tanggalMulai || today}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="jamMulai" className="form-label">Jam Mulai *</label>
                  <input
                    type="time"
                    className="form-control"
                    id="jamMulai"
                    name="jamMulai"
                    value={formData.jamMulai}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="jamSelesai" className="form-label">Jam Selesai *</label>
                  <input
                    type="time"
                    className="form-control"
                    id="jamSelesai"
                    name="jamSelesai"
                    value={formData.jamSelesai}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-12 mb-3">
                  <label htmlFor="penanggungJawab" className="form-label">Penanggung Jawab *</label>
                  <select
                    className="form-select"
                    id="penanggungJawab"
                    name="penanggungJawab"
                    value={formData.penanggungJawab}
                    onChange={handleChange}
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

              <div className="mb-3">
                <label htmlFor="deskripsi" className="form-label">Deskripsi Kegiatan</label>
                <textarea
                  className="form-control"
                  id="deskripsi"
                  name="deskripsi"
                  rows="4"
                  value={formData.deskripsi}
                  onChange={handleChange}
                  placeholder="Deskripsikan detail kegiatan..."
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-save me-2"></i>Simpan Kegiatan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}