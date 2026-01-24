'use client'

import { useEffect, useState } from 'react'
import jsPDF from 'jspdf'

export default function ApprovalLaporanPage() {
  const [laporan, setLaporan] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [showModal, setShowModal] = useState(false)
  const [selectedData, setSelectedData] = useState(null)

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5001/api/admin/laporan', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setLaporan(Array.isArray(data) ? data : [])
    } catch {
      alert('Gagal mengambil data laporan')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ================= FILTER =================
  const filteredLaporan = laporan.filter(l => {
    const keyword = searchTerm.toLowerCase()

    const matchSearch =
      l.judul_laporan?.toLowerCase().includes(keyword) ||
      l.kegiatan.judul?.toLowerCase().includes(keyword)

    const matchStatus = !statusFilter || l.status === statusFilter

    const date = new Date(l.tanggal_laporan)
    const matchStart = startDate ? date >= new Date(startDate) : true
    const matchEnd = endDate ? date <= new Date(endDate) : true

    return matchSearch && matchStatus && matchStart && matchEnd
  })

  // ================= STATUS BADGE =================
  const getStatusBadge = (status) => {
    if (status === 'menunggu')
      return <span className="badge bg-warning text-dark">Menunggu</span>
    if (status === 'disetujui')
      return <span className="badge bg-success">Disetujui</span>
    if (status === 'ditolak')
      return <span className="badge bg-danger">Ditolak</span>
    return <span className="badge bg-secondary">-</span>
  }

  // ================= APPROVAL =================
  const handleApprove = async (id) => {
    if (!confirm('Setujui laporan ini?')) return
    const token = localStorage.getItem('token')

    await fetch(
      `http://localhost:5001/api/superadmin/laporan/${id}/approve`,
      { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }
    )

    fetchData()
  }

  const handleReject = async (id) => {
    if (!confirm('Tolak laporan ini?')) return
    const token = localStorage.getItem('token')

    await fetch(
      `http://localhost:5001/api/superadmin/laporan/${id}/reject`,
      { method: 'PUT', headers: { Authorization: `Bearer ${token}` } }
    )

    fetchData()
  }

  // ================= EXPORT PDF =================
  const handleExportPDF = (lap) => {
    const doc = new jsPDF()
    const w = doc.internal.pageSize.getWidth()

    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('LAPORAN KEGIATAN PUSKESMAS', w / 2, 20, { align: 'center' })

    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    let y = 35

    doc.text(`Judul Laporan : ${lap.judul_laporan}`, 15, y); y += 8
    doc.text(`Kegiatan      : ${lap.kegiatan.judul}`, 15, y); y += 8

    doc.text(
      `Tanggal       : ${new Date(lap.kegiatan.tanggal).toLocaleDateString('id-ID')}`,
      15,
      y
    ); y += 8

    doc.text(
      `Waktu         : ${lap.kegiatan.jam_mulai.slice(0,5)} - ${lap.kegiatan.jam_selesai.slice(0,5)} WIB`,
      15,
      y
    ); y += 8

    doc.text(`Lokasi        : ${lap.kegiatan.nama_lokasi}`, 15, y); y += 12

    doc.setFont('helvetica', 'bold')
    doc.text('Detail Kegiatan:', 15, y); y += 8
    doc.setFont('helvetica', 'normal')

    const detail = doc.splitTextToSize(lap.detail_kegiatan, w - 30)
    doc.text(detail, 15, y)

    if (lap.img) {
      y += detail.length * 6 + 10
      doc.addImage(
        `data:image/jpeg;base64,${lap.img}`,
        'JPEG',
        15,
        y,
        60,
        45
      )
    }

    doc.save(`Laporan-${lap.kegiatan.judul}.pdf`)
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

      {/* FILTER */}
      <div className="d-flex flex-wrap gap-2 align-items-end mb-3">
        <input
          className="form-control"
          style={{ maxWidth: 260 }}
          placeholder="Cari judul kegiatan / laporan"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />

        <div>
          <label className="small text-muted">Dari tanggal</label>
          <input type="date" className="form-control"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="small text-muted">Sampai tanggal</label>
          <input type="date" className="form-control"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>

        <div>
          <label className="small text-muted">Status</label>
          <select className="form-select"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="">Semua</option>
            <option value="menunggu">Menunggu</option>
            <option value="disetujui">Disetujui</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>

        <button className="btn btn-secondary"
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

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <div className="card-body table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-success">
              <tr>
                <th>Judul Kegiatan</th>
                <th>Tanggal</th>
                <th>Lokasi</th>
                <th>Status</th>
                <th className="text-center">PDF</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLaporan.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center text-muted">
                    Tidak ada data
                  </td>
                </tr>
              )}

              {filteredLaporan.map(l => (
                <tr key={l.id}>
                  <td>{l.kegiatan.judul}</td>
                  <td>{new Date(l.tanggal_laporan).toLocaleDateString('id-ID')}</td>
                  <td>{l.kegiatan.nama_lokasi}</td>
                  <td>{getStatusBadge(l.status)}</td>

                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => handleExportPDF(l)}
                      title="Download PDF"
                    >
                      <i className="fas fa-file-pdf"></i>
                    </button>
                  </td>


<td className="text-center">
  <button
    className="btn btn-info btn-sm"
    onClick={() => {
      setSelectedData(l)
      setShowModal(true)
    }}
  >
    Detail
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETAIL */}
{showModal && selectedData && (
  <>
    <div className="modal show d-block bg-dark bg-opacity-50">
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow">

          {/* HEADER */}
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">
              Detail Laporan & Approval
            </h5>
            <button
              className="btn-close btn-close-white"
              onClick={() => setShowModal(false)}
            />
          </div>

          {/* BODY */}
          <div className="modal-body">
            <table className="table table-sm">
              <tbody>
                <tr key="judul-laporan">
                  <th width="180">Judul Laporan</th>
                  <td>{selectedData.judul_laporan}</td>
                </tr>
                <tr key="kegiatan">
                  <th>Kegiatan</th>
                  <td>{selectedData.kegiatan.judul}</td>
                </tr>
                <tr key="tanggal">
                  <th>Tanggal</th>
                  <td>
                    {new Date(selectedData.kegiatan.tanggal)
                      .toLocaleDateString('id-ID')}
                  </td>
                </tr>
                <tr key="waktu">
                  <th>Waktu</th>
                  <td>
                    {selectedData.kegiatan.jam_mulai} – {selectedData.kegiatan.jam_selesai}
                  </td>
                </tr>
                <tr key="lokasi">
                  <th>Lokasi</th>
                  <td>{selectedData.kegiatan.nama_lokasi}</td>
                </tr>
                <tr key="status">
                  <th>Status</th>
                  <td>
                    <span className={`badge ${
                      selectedData.status === 'menunggu'
                        ? 'bg-warning text-dark'
                        : selectedData.status === 'disetujui'
                        ? 'bg-success'
                        : 'bg-danger'
                    }`}>
                      {selectedData.status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>

            <hr />

            <h6 className="fw-bold">Detail Kegiatan</h6>
            <p>{selectedData.detail_kegiatan}</p>

            {selectedData.img && (
              <>
                <hr />
                <h6 className="fw-bold">Dokumentasi</h6>
                <img
                  src={`data:image/jpeg;base64,${selectedData.img}`}
                  className="img-fluid rounded"
                  style={{ maxHeight: 300 }}
                />
              </>
            )}
          </div>

          {/* FOOTER (APPROVAL DI SINI) */}
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Tutup
            </button>

            {selectedData.status === 'menunggu' && (
              <>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    handleReject(selectedData.id)
                    setShowModal(false)
                  }}
                >
                  <i className="fas fa-times me-1"></i>
                  Tolak
                </button>

                <button
                  className="btn btn-success"
                  onClick={() => {
                    handleApprove(selectedData.id)
                    setShowModal(false)
                  }}
                >
                  <i className="fas fa-check me-1"></i>
                  Setujui
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  </>
)}
    </div>
  )
}