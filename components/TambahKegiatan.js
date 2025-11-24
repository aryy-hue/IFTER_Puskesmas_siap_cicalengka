'use client'

import { useState } from 'react'

export default function TambahKegiatan({ show, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    namaKegiatan: '',
    lokasi: '',
    tanggal: '',
    penanggungJawab: '',
    jamMulai: '',
    jamSelesai: '',
    deskripsi: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simulasi submit data
    console.log('Data kegiatan:', formData)
    
    // Reset form
    setFormData({
      namaKegiatan: '',
      lokasi: '',
      tanggal: '',
      penanggungJawab: '',
      jamMulai: '',
      jamSelesai: '',
      deskripsi: ''
    })
    
    // Tutup modal dan panggil callback success
    if (onSuccess) {
      onSuccess()
    }
    onClose()
  }

  const handleClose = () => {
    setFormData({
      namaKegiatan: '',
      lokasi: '',
      tanggal: '',
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
                  <label htmlFor="tanggal" className="form-label">Tanggal *</label>
                  <input
                    type="date"
                    className="form-control"
                    id="tanggal"
                    name="tanggal"
                    value={formData.tanggal}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="penanggungJawab" className="form-label">Penanggung Jawab *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="penanggungJawab"
                    name="penanggungJawab"
                    value={formData.penanggungJawab}
                    onChange={handleChange}
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