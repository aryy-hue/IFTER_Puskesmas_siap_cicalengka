'use client'

import { useEffect, useState } from 'react'
import jsPDF from 'jspdf'

export default function ApprovalLaporanPage() {
  const [laporanList, setLaporanList] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedData, setSelectedData] = useState(null)

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')

      const res = await fetch(
        'http://localhost:5001/api/admin/laporan',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const data = await res.json()
      setLaporanList(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      alert('Gagal mengambil data laporan')
      setLaporanList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ================= FILTER + PRIORITY SORT =================
const filteredList = laporanList
  .filter(l => {
    const keyword = searchTerm.toLowerCase()

    const matchSearch =
      l.judul_laporan?.toLowerCase().includes(keyword) ||
      l.kegiatan?.judul?.toLowerCase().includes(keyword)

    const matchStatus =
      !statusFilter || l.status === statusFilter

    const laporanDate = new Date(l.tanggal_laporan)
    const matchStart = startDate ? laporanDate >= new Date(startDate) : true
    const matchEnd = endDate ? laporanDate <= new Date(endDate) : true

    return matchSearch && matchStatus && matchStart && matchEnd
  })
  .sort((a, b) => {
    const priority = { menunggu: 1, disetujui: 2, ditolak: 3 }
    return (priority[a.status] || 99) - (priority[b.status] || 99)
  })

  // ================= ACTION =================
  const openDetail = (item) => {
    setSelectedData(item)
    setShowModal(true)
  }

  const updateStatus = async (id, type) => {
    const token = localStorage.getItem('token')

    const endpoint =
      type === 'approve'
        ? `http://localhost:5001/api/superadmin/laporan/${id}/approve`
        : `http://localhost:5001/api/superadmin/laporan/${id}/reject`

    await fetch(endpoint, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    })

    setShowModal(false)
    fetchData()
  }

  // ================= PDF =================
  const handlePDF = (item) => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('LAPORAN KEGIATAN PUSKESMAS', pageWidth / 2, 20, { align: 'center' })

    let y = 35
    doc.setFontSize(11)

    const row = (label, value) => {
      doc.setFont('helvetica', 'bold')
      doc.text(label, 15, y)
      doc.setFont('helvetica', 'normal')
      doc.text(`: ${value}`, 50, y)
      y += 8
    }

    row('Judul Laporan', item.judul_laporan)
    row(
      'Tanggal Laporan',
      new Date(item.tanggal_laporan).toLocaleDateString('id-ID')
    )
    row('Kegiatan', item.kegiatan.judul)
    row(
      'Tanggal Kegiatan',
      new Date(item.kegiatan.tanggal).toLocaleDateString('id-ID')
    )
    row(
      'Waktu',
      `${item.kegiatan.jam_mulai} - ${item.kegiatan.jam_selesai}`
    )
    row('Lokasi', item.kegiatan.lokasi)

    y += 6

    if (item.img_base64) {
      doc.addImage(
        `data:image/jpeg;base64,${item.img_base64}`,
        'JPEG',
        15,
        y,
        100,
        65
      )
      y += 75
    }

    const detail = doc.splitTextToSize(item.detail_kegiatan, pageWidth - 30)
    doc.text(detail, 15, y)

    doc.save(`Laporan-${item.judul_laporan}.pdf`)
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
      <h4 className="mb-3">Approval Laporan</h4>

    <div className="card mb-3">
      <div className="card-body d-flex flex-wrap gap-2 align-items-end">
        <input
          className="form-control"
          style={{ maxWidth: 250 }}
          placeholder="Cari judul laporan / kegiatan"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <div>
          <label className="small text-muted">Dari tanggal</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="small text-muted">Sampai tanggal</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

        <div>
          <label className="small text-muted">Status</label>
          <select
            className="form-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Semua</option>
            <option value="menunggu">Menunggu</option>
            <option value="disetujui">Disetujui</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>

        <button
          className="btn btn-secondary"
          onClick={() => {
            setSearchTerm('')
            setStartDate('')
            setEndDate('')
            setStatusFilter('')
          }}
        >
          Reset
        </button>
      </div>
    </div>

      <div className="card shadow-sm">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-success">
            <tr>
              <th>Judul Laporan</th>
              <th>Kegiatan</th>
              <th>Tanggal</th>
              <th>Lokasi</th>
              <th>Status</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  Tidak ada data
                </td>
              </tr>
            )}

            {filteredList.map(item => (
              <tr
                key={item.laporan_id}
                className={item.status === 'menunggu' ? 'table-warning' : ''}
              >
                <td>{item.judul_laporan}</td>
                <td>{item.kegiatan.judul}</td>
                <td>{new Date(item.tanggal_laporan).toLocaleDateString('id-ID')}</td>
                <td>{item.kegiatan.lokasi}</td>

                <td>
                  <span
                    className={`badge ${
                      item.status === 'menunggu'
                        ? 'bg-warning text-dark'
                        : item.status === 'disetujui'
                        ? 'bg-success'
                        : 'bg-danger'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="text-center">
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => openDetail(item)}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAIL */}
      {showModal && selectedData && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content shadow border-0">
                <div className="modal-header bg-success text-white">
                  <h5>Detail Laporan</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body">
                  <h6 className="fw-bold">Informasi Kegiatan</h6>
                  <table className="table table-sm">
                    <tbody>
                      <tr><th>Judul</th><td>{selectedData.kegiatan.judul}</td></tr>
                      <tr><th>Tanggal</th><td>{new Date(selectedData.kegiatan.tanggal).toLocaleDateString('id-ID')}</td></tr>
                      <tr><th>Waktu</th><td>{selectedData.kegiatan.jam_mulai} - {selectedData.kegiatan.jam_selesai}</td></tr>
                      <tr><th>Lokasi</th><td>{selectedData.kegiatan.lokasi}</td></tr>
                    </tbody>
                  </table>

                  <hr />

                  <h6 className="fw-bold">Laporan</h6>
                  <p><strong>{selectedData.judul_laporan}</strong></p>
                  <p>{selectedData.detail_kegiatan}</p>

                  {selectedData.img_base64 && (
                    <img
                      src={`data:image/jpeg;base64,${selectedData.img_base64}`}
                      className="img-fluid rounded"
                      style={{ maxHeight: 250 }}
                    />
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    className="btn btn-outline-primary me-auto"
                    onClick={() => handlePDF(selectedData)}
                  >
                    Download PDF
                  </button>

                  {selectedData.status === 'menunggu' ? (
                    <>
                      <button
                        className="btn btn-danger"
                        onClick={() =>
                          updateStatus(selectedData.laporan_id, 'reject')
                        }
                      >
                        Tolak
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() =>
                          updateStatus(selectedData.laporan_id, 'approve')
                        }
                      >
                        Approve
                      </button>
                    </>
                  ) : (
                    <span className="badge bg-secondary me-auto">
                      Laporan sudah {selectedData.status}
                    </span>
                  )}

                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
