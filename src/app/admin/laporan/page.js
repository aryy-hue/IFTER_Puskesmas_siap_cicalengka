'use client'

import { useState, useEffect } from 'react'
import jsPDF from 'jspdf'

export default function LaporanPage() {
  const [laporan, setLaporan] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState(null)

  const [formData, setFormData] = useState({
    judul: '',
    periode: '',
    detail: '',
    catatan: '',
    images: [],
    pdfFile: null
  })

  // dummy awal
  useEffect(() => {
    setLaporan([
      {
        id: 1,
        judul: 'Kegiatan Posyandu Balita',
        periode: 'Januari 2024',
        detail: 'Penimbangan, imunisasi, dan pemberian vitamin A.',
        catatan: 'Antusias warga tinggi.',
        images: ['/img/puskesmas.jpg'],
        pdfFile: null,
        createdAt: new Date().toISOString(),
        status: 'Draft'
      }
    ])
  }, [])

  const resetForm = () => {
    setFormData({
      judul: '',
      periode: '',
      detail: '',
      catatan: '',
      images: [],
      pdfFile: null
    })
    setIsEdit(false)
    setEditId(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (isEdit) {
      setLaporan(
        laporan.map((l) =>
          l.id === editId ? { ...l, ...formData } : l
        )
      )
    } else {
      setLaporan([
        ...laporan,
        {
          id: Date.now(),
          ...formData,
          createdAt: new Date().toISOString(),
          status: 'Draft'
        }
      ])
    }

    resetForm()
    setShowModal(false)
  }

  const handleEdit = (item) => {
    setFormData(item)
    setEditId(item.id)
    setIsEdit(true)
    setShowModal(true)
  }

  // === PDF DENGAN GAMBAR ===
const handlePDF = async (item) => {
  const doc = new jsPDF()

  // ===== HEADER =====
  doc.setFontSize(14)
  doc.text('PUSKESMAS CICALENGKA', 105, 15, { align: 'center' })

  doc.setFontSize(10)
  doc.text(
    'Jl. Raya Cicalengka No. 123, Kabupaten Bandung',
    105,
    21,
    { align: 'center' }
  )

  doc.line(20, 25, 190, 25)

  // ===== JUDUL =====
  doc.setFontSize(13)
  doc.text('LAPORAN KEGIATAN', 105, 35, { align: 'center' })

  doc.setFontSize(11)
  doc.text(item.judul.toUpperCase(), 105, 42, { align: 'center' })

  // ===== INFORMASI =====
  doc.setFontSize(11)
  doc.text(`Periode`, 20, 55)
  doc.text(`: ${item.periode}`, 60, 55)

  doc.text(`Tanggal`, 20, 63)
  doc.text(
    `: ${new Date(item.createdAt).toLocaleDateString('id-ID')}`,
    60,
    63
  )

  // ===== ISI LAPORAN =====
  let y = 78

  doc.text('1. Latar Belakang', 20, y)
  y += 8
  doc.text(
    item.detail,
    25,
    y,
    { maxWidth: 160 }
  )

  y += 30
  doc.text('2. Tujuan Kegiatan', 20, y)
  y += 8
  doc.text(
    'Meningkatkan pelayanan kesehatan kepada masyarakat.',
    25,
    y,
    { maxWidth: 160 }
  )

  y += 20
  doc.text('3. Waktu dan Tempat', 20, y)
  y += 8
  doc.text(
    `Kegiatan dilaksanakan pada periode ${item.periode} di wilayah kerja Puskesmas Cicalengka.`,
    25,
    y,
    { maxWidth: 160 }
  )

  y += 25
  doc.text('4. Uraian Kegiatan', 20, y)
  y += 8
  doc.text(
    item.detail,
    25,
    y,
    { maxWidth: 160 }
  )

  // ===== DOKUMENTASI =====
  y += 35
  doc.text('5. Dokumentasi Kegiatan', 20, y)
  y += 5

  if (item.images && item.images.length > 0) {
    for (let i = 0; i < item.images.length; i++) {
      const img = new Image()
      img.src = item.images[i]

      await new Promise((resolve) => {
        img.onload = () => {
          doc.addImage(img, 'JPEG', 25, y + 5, 60, 45)
          resolve()
        }
      })

      y += 55

      if (y > 240) {
        doc.addPage()
        y = 30
      }
    }
  } else {
    doc.text('-', 25, y + 10)
    y += 20
  }

  // ===== PENUTUP =====
  if (y > 200) doc.addPage()

  doc.text('Demikian laporan kegiatan ini dibuat sebagai bahan dokumentasi.', 20, y + 20)

  doc.text('Cicalengka, ' + new Date().toLocaleDateString('id-ID'), 130, y + 40)
  doc.text('Mengetahui,', 130, y + 50)
  doc.text('Kepala Puskesmas', 130, y + 70)

  doc.save(`Laporan-Kegiatan-${item.judul}.pdf`)
}


  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <h1 className="h3">Kelola Laporan</h1>
        <button
          className="btn btn-success"
          onClick={() => {
            resetForm()
            setShowModal(true)
          }}
        >
          + Buat Laporan
        </button>
      </div>

      <div className="card">
        <div className="card-body table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Periode</th>
                <th>Status</th>
                <th>Tanggal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {laporan.map((l) => (
                <tr key={l.id}>
                  <td>{l.judul}</td>
                  <td>{l.periode}</td>
                  <td>
                    <span className="badge bg-warning">{l.status}</span>
                  </td>
                  <td>
                    {new Date(l.createdAt).toLocaleDateString('id-ID')}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-1"
                      onClick={() => handlePDF(l)}
                    >
                      PDF
                    </button>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleEdit(l)}
                    >
                      Edit
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
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{isEdit ? 'Edit Laporan' : 'Buat Laporan'}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <input
                    className="form-control mb-2"
                    placeholder="Judul laporan"
                    value={formData.judul}
                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                    required
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Periode"
                    value={formData.periode}
                    onChange={(e) => setFormData({ ...formData, periode: e.target.value })}
                    required
                  />

                  <textarea
                    className="form-control mb-2"
                    rows="4"
                    placeholder="Detail kegiatan"
                    value={formData.detail}
                    onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                    required
                  ></textarea>

                  <textarea
                    className="form-control mb-3"
                    rows="3"
                    placeholder="Catatan"
                    value={formData.catatan}
                    onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  ></textarea>

                  <label className="form-label">Upload Gambar (opsional)</label>
                  <input
                    type="file"
                    className="form-control mb-3"
                    multiple
                    accept="image/*"
                  />

                  <label className="form-label">Upload File PDF (opsional)</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="application/pdf"
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Batal
                  </button>
                  <button className="btn btn-success">
                    {isEdit ? 'Simpan Perubahan' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
