'use client'

import { useEffect, useState } from 'react'
import jsPDF from 'jspdf'

export default function LaporanPage() {
  const [laporan, setLaporan] = useState([])
  const [kegiatanList, setKegiatanList] = useState([])
  const [selectedKegiatan, setSelectedKegiatan] = useState(null)

  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState(null)

  const [formData, setFormData] = useState({
    kegiatan_id: '',
    judul_laporan: '',
    detail_kegiatan: '',
    img: null
  })

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')

      const [lapRes, kegRes] = await Promise.all([
        fetch('http://localhost:5001/api/admin/laporan', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5001/api/admin/kegiatan', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ])

      const lapData = await lapRes.json()
      const kegData = await kegRes.json()

      setLaporan(Array.isArray(lapData) ? lapData : [])
      setKegiatanList(Array.isArray(kegData) ? kegData : [])
    } catch (err) {
      alert('Gagal mengambil data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ================= FILTER KEGIATAN =================
  const kegiatanTanpaLaporan = isEdit
    ? kegiatanList
    : kegiatanList.filter(
        k => !laporan.some(l => l.kegiatan.id === k.id)
      )

  // ================= OPEN EDIT =================
  const openEdit = (item) => {
    setIsEdit(true)
    setEditId(item.laporan_id)
    setShowModal(true)

    setSelectedKegiatan({
      id: item.kegiatan.id,
      judul: item.kegiatan.judul,
      tanggal: item.kegiatan.tanggal,
      jam_mulai: item.kegiatan.jam_mulai,
      jam_selesai: item.kegiatan.jam_selesai
    })

    setFormData({
      kegiatan_id: item.kegiatan.id,
      judul_laporan: item.judul_laporan,
      detail_kegiatan: item.detail_kegiatan,
      img: null
    })
  }

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const fd = new FormData()
    fd.append('kegiatan_id', formData.kegiatan_id)
    fd.append('judul_laporan', formData.judul_laporan)
    fd.append('detail_kegiatan', formData.detail_kegiatan)
    if (formData.img) fd.append('img', formData.img)

    const url = isEdit
      ? `http://localhost:5001/api/admin/laporan/${editId}`
      : 'http://localhost:5001/api/admin/laporan'

    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    })

    if (!res.ok) {
      alert('Gagal menyimpan laporan')
      return
    }

    setShowModal(false)
    setIsEdit(false)
    setEditId(null)
    setSelectedKegiatan(null)

    setFormData({
      kegiatan_id: '',
      judul_laporan: '',
      detail_kegiatan: '',
      img: null
    })

    fetchData()
  }

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm('Hapus laporan ini?')) return
    const token = localStorage.getItem('token')

    await fetch(`http://localhost:5001/api/admin/laporan/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    fetchData()
  }

  // ================= PDF =================
// ================= PDF =================
const handlePDF = (item) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  
  // Tambahkan header/kop surat (gambar)
  // Anda perlu mengonversi gambar ke base64 atau URL
  // Contoh: doc.addImage(headerImageData, 'PNG', 10, 10, 190, 40)
  
  // Atau jika Anda ingin membuat kop surat manual:
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text('PEMERINTAH KABUPATEN BANDUNG', pageWidth / 2, 15, { align: 'center' })
  doc.text('DINAS KESEHATAN', pageWidth / 2, 23, { align: 'center' })
  doc.setFontSize(16)
  doc.text('PUSKESMAS CICALENGKA DTP', pageWidth / 2, 31, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text('Jln. Raya Cicalengka No.321 Telp. (022) 7949217 Kode Pos 40395', pageWidth / 2, 39, { align: 'center' })
  doc.text('E-mail : puskicalengka_bandungkab@yahoo.co.id', pageWidth / 2, 45, { align: 'center' })
  
  // Garis pemisah
  doc.setLineWidth(0.5)
  doc.line(10, 50, pageWidth - 10, 50)
  doc.line(10, 51, pageWidth - 10, 51)
  
  // Judul utama
  doc.setFontSize(14)
  doc.setFont("helvetica", "bold")
  doc.text('LAPORAN KEGIATAN PUSKESMAS', pageWidth / 2, 65, { align: 'center' })
  
  // Spasi
  doc.setFontSize(11)
  doc.setFont("helvetica", "normal")
  
  // Data laporan dengan format rapi
  let yPosition = 80
  
  // Judul Laporan
  doc.setFont("helvetica", "bold")
  doc.text('Judul Laporan:', 15, yPosition)
  doc.setFont("helvetica", "normal")
  doc.text(`: ${item.judul_laporan}`, 50, yPosition)
  yPosition += 8
  
  // Tanggal Laporan
  doc.setFont("helvetica", "bold")
  doc.text('Tanggal Laporan:', 15, yPosition)
  doc.setFont("helvetica", "normal")
  doc.text(`: ${new Date(item.tanggal_laporan).toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`, 50, yPosition)
  yPosition += 8
  
  // Kegiatan
  doc.setFont("helvetica", "bold")
  doc.text('Kegiatan:', 15, yPosition)
  doc.setFont("helvetica", "normal")
  doc.text(`: ${item.kegiatan.judul}`, 50, yPosition)
  yPosition += 8
  
  // Tanggal Kegiatan
  doc.setFont("helvetica", "bold")
  doc.text('Tanggal Kegiatan:', 15, yPosition)
  doc.setFont("helvetica", "normal")
  doc.text(`: ${new Date(item.kegiatan.tanggal).toLocaleDateString('id-ID')}`, 50, yPosition)
  yPosition += 8
  
  // Waktu Kegiatan
  doc.setFont("helvetica", "bold")
  doc.text('Waktu Kegiatan:', 15, yPosition)
  doc.setFont("helvetica", "normal")
  doc.text(`: ${item.kegiatan.jam_mulai} - ${item.kegiatan.jam_selesai}`, 50, yPosition)
  yPosition += 8
  
  // Lokasi Kegiatan
  doc.setFont("helvetica", "bold")
  doc.text('Lokasi Kegiatan:', 15, yPosition)
  doc.setFont("helvetica", "normal")
  doc.text(`: ${item.kegiatan.lokasi}`, 50, yPosition)
  yPosition += 12
  
  // Detail Kegiatan dengan judul terpisah
  doc.setFont("helvetica", "bold")
  doc.text('DETAIL KEGIATAN', pageWidth / 2, yPosition, { align: 'center' })
  yPosition += 8
  
  // Garis bawah judul detail
  doc.setLineWidth(0.3)
  doc.line(pageWidth / 2 - 40, yPosition, pageWidth / 2 + 40, yPosition)
  yPosition += 10
  
  // Isi detail kegiatan dengan alignment justify
  const splitDetail = doc.splitTextToSize(item.detail_kegiatan, pageWidth - 30)
  doc.text(splitDetail, 15, yPosition, { align: 'left' })
  
  // Tanda tangan (jika diperlukan)
  const pageHeight = doc.internal.pageSize.getHeight()
  const signatureY = pageHeight - 50
  
  doc.setLineWidth(0.5)
  doc.line(pageWidth - 60, signatureY + 20, pageWidth - 15, signatureY + 20)
  
  doc.text('Mengetahui,', pageWidth - 37, signatureY, { align: 'center' })
  doc.text('Drg. Wulandari M.H', pageWidth - 37, signatureY + 25, { align: 'center' })
  doc.text('Kepala Puskesmas Cicalengka DTP', pageWidth - 37, signatureY + 30, { align: 'center' })
  
  doc.text('', 15, signatureY) // Spasi
  doc.text('', 15, signatureY + 25)
  doc.text('', 15, signatureY + 30)
  
  // Nomor halaman
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.text(`Halaman ${i} dari ${totalPages}`, pageWidth - 20, pageHeight - 10, { align: 'right' })
  }
  
  doc.save(`Laporan-${item.judul_laporan}.pdf`)
}

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
      </div>
    )
  }

  return (
    <div className="container-fluid p-3">
      <div className="d-flex justify-content-between mb-3">
        <h4>Kelola Laporan</h4>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          + Tambah Laporan
        </button>
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="card-body table-responsive">
          <table className="table table-bordered">
            <thead className="table-success">
              <tr>
                <th>Judul</th>
                <th>Tanggal</th>
                <th>Lokasi</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {laporan.map(l => (
                <tr key={l.laporan_id}>
                  <td>{l.judul_laporan}</td>
                  <td>{new Date(l.tanggal_laporan).toLocaleDateString('id-ID')}</td>
                  <td>{l.kegiatan.lokasi}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      title="PDF"
                      onClick={() => handlePDF(l)}
                    >
                      <i className="fas fa-file-pdf"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-warning me-1"
                      title="Edit"
                      onClick={() => openEdit(l)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Hapus"
                      onClick={() => handleDelete(l.laporan_id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header bg-success text-white">
                <h5>{isEdit ? 'Edit Laporan' : 'Tambah Laporan'}</h5>
              </div>

              <div className="modal-body">
                <select
                  className="form-select mb-3"
                  value={formData.kegiatan_id}
                  onChange={e => {
                    const k = kegiatanList.find(x => x.id === e.target.value)
                    setSelectedKegiatan(k)
                    setFormData({ ...formData, kegiatan_id: e.target.value })
                  }}
                  required
                >
                  <option value="">-- Pilih Kegiatan --</option>
                  {kegiatanTanpaLaporan.map(k => (
                    <option key={k.id} value={k.id}>
                      {k.id} - {k.judul}
                    </option>
                  ))}
                </select>

                {selectedKegiatan && (
                  <div className="alert alert-light border">
                    <p><strong>Nama:</strong> {selectedKegiatan.judul}</p>
                    <p><strong>Tanggal:</strong> {selectedKegiatan.tanggal}</p>
                    <p>
                      <strong>Waktu:</strong>{' '}
                      {selectedKegiatan.jam_mulai} - {selectedKegiatan.jam_selesai}
                    </p>
                  </div>
                )}

                <input
                  className="form-control mb-2"
                  placeholder="Judul Laporan"
                  value={formData.judul_laporan}
                  onChange={e =>
                    setFormData({ ...formData, judul_laporan: e.target.value })
                  }
                  required
                />

                <textarea
                  className="form-control mb-2"
                  placeholder="Detail Kegiatan"
                  value={formData.detail_kegiatan}
                  onChange={e =>
                    setFormData({ ...formData, detail_kegiatan: e.target.value })
                  }
                  required
                />

                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={e =>
                    setFormData({ ...formData, img: e.target.files[0] })
                  }
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Batal
                </button>
                <button className="btn btn-success">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
