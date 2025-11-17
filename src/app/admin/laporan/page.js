'use client'

import { useState, useEffect } from 'react'

export default function LaporanPage() {
  const [laporan, setLaporan] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    judul: '',
    periode: '',
    detail: '',
    catatan: ''
  })

  useEffect(() => {
    const savedLaporan = localStorage.getItem('laporanPuskesmas')
    if (savedLaporan) {
      setLaporan(JSON.parse(savedLaporan))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('laporanPuskesmas', JSON.stringify(laporan))
  }, [laporan])

  const handleSubmit = (e) => {
    e.preventDefault()
    const newLaporan = {
      id: Date.now(),
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'Draft'
    }
    setLaporan([...laporan, newLaporan])
    setFormData({ judul: '', periode: '', detail: '', catatan: '' })
    setShowModal(false)
  }

  const handleCetak = (laporanItem) => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html>
        <head>
          <title>Laporan - ${laporanItem.judul}</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
          <style>
            body { font-family: Arial, sans-serif; }
            .header { text-align: center; margin-bottom: 30px; }
            .detail-section { margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container mt-4">
            <div class="header">
              <h2>PUSKESMAS CICALENGKA</h2>
              <h4>LAPORAN KEGIATAN</h4>
              <hr>
            </div>
            
            <div class="row">
              <div class="col-12">
                <h3>${laporanItem.judul}</h3>
                <p><strong>Periode:</strong> ${laporanItem.periode}</p>
                <p><strong>Tanggal Cetak:</strong> ${new Date().toLocaleDateString('id-ID')}</p>
              </div>
            </div>
            
            <div class="detail-section">
              <h5>Detail Kegiatan:</h5>
              <p>${laporanItem.detail}</p>
            </div>
            
            <div class="catatan-section">
              <h5>Catatan:</h5>
              <p>${laporanItem.catatan}</p>
            </div>
            
            <div class="footer mt-5">
              <div class="row">
                <div class="col-6"></div>
                <div class="col-6 text-end">
                  <p>Mengetahui,</p>
                  <br><br><br>
                  <p><strong>Kepala Puskesmas</strong></p>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Kelola Laporan</h1>
        <button 
          className="btn btn-success"
          onClick={() => setShowModal(true)}
        >
          <i className="fas fa-plus me-2"></i>Buat Laporan
        </button>
      </div>

      {/* Tabel Laporan */}
      <div className="card">
        <div className="card-body">
          {laporan.length === 0 ? (
            <div className="text-center py-4">
              <i className="fas fa-file-alt fa-3x text-muted mb-3"></i>
              <p className="text-muted">Belum ada laporan</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Judul Laporan</th>
                    <th>Periode</th>
                    <th>Status</th>
                    <th>Tanggal Dibuat</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {laporan.map((l) => (
                    <tr key={l.id}>
                      <td>
                        <strong>{l.judul}</strong>
                        <br />
                        <small className="text-muted">{l.detail.substring(0, 100)}...</small>
                      </td>
                      <td>{l.periode}</td>
                      <td>
                        <span className={`badge ${l.status === 'Draft' ? 'bg-warning' : 'bg-success'}`}>
                          {l.status}
                        </span>
                      </td>
                      <td>{new Date(l.createdAt).toLocaleDateString('id-ID')}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleCetak(l)}
                        >
                          <i className="fas fa-print"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-danger">
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal Buat Laporan */}
      {showModal && (
        <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Buat Laporan Baru</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Judul Laporan</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.judul}
                      onChange={(e) => setFormData({...formData, judul: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Periode Laporan</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Contoh: Januari 2024"
                      value={formData.periode}
                      onChange={(e) => setFormData({...formData, periode: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Detail Kegiatan</label>
                    <textarea
                      className="form-control"
                      rows="5"
                      placeholder="Jelaskan detail kegiatan yang dilakukan..."
                      value={formData.detail}
                      onChange={(e) => setFormData({...formData, detail: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Catatan Tambahan</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Catatan penting atau kesimpulan..."
                      value={formData.catatan}
                      onChange={(e) => setFormData({...formData, catatan: e.target.value})}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn btn-success">Simpan Laporan</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
