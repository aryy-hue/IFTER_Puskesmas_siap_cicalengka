'use client'

import { useEffect, useState } from 'react'

export default function ApprovalKegiatanPage() {
  const [kegiatanList, setKegiatanList] = useState([])
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

      const res = await fetch(
        'http://localhost:5001/api/superadmin/kegiatan',
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const data = await res.json()

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : []

      setKegiatanList(list)
    } catch (err) {
      console.error(err)
      alert('Gagal mengambil data kegiatan')
      setKegiatanList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ================= FILTER =================
  const filteredList = kegiatanList.filter(k => {
    const keyword = searchTerm.toLowerCase()

    const matchSearch =
      k.judul?.toLowerCase().includes(keyword) ||
      k.id?.toLowerCase().includes(keyword)

    const matchStatus =
      !statusFilter || k.status === statusFilter

    const kegiatanDate = new Date(k.tanggal)
    const matchStart = startDate ? kegiatanDate >= new Date(startDate) : true
    const matchEnd = endDate ? kegiatanDate <= new Date(endDate) : true

    return matchSearch && matchStatus && matchStart && matchEnd
  })

  // ================= ACTION =================
  const openDetail = (item) => {
    setSelectedData(item)
    setShowModal(true)
  }

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token')

    await fetch(
      `http://localhost:5001/api/superadmin/kegiatan/${id}/${status}`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    setShowModal(false)
    fetchData()
  }

  const formatTanggal = (date) =>
    date
      ? new Date(date).toLocaleDateString('id-ID', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      : '-'

  const formatJam = (time) => (time ? time.slice(0, 5) : '-')

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
      <h4 className="mb-3">Approval Kegiatan</h4>

      {/* FILTER */}
      <div className="card mb-3">
        <div className="card-body d-flex flex-wrap gap-2 align-items-end">
          <input
            className="form-control"
            style={{ maxWidth: 250 }}
            placeholder="Cari ID / Judul"
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

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-success">
            <tr>
              <th>ID</th>
              <th>Judul</th>
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
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.judul}</td>
                <td>{formatTanggal(item.tanggal)}</td>
                <td>{item.nama_lokasi || '-'}</td>
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
                  <h5>Detail Kegiatan</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  />
                </div>

                <div className="modal-body">
                  <table className="table table-sm">
                    <tbody>
                      <tr><th>ID</th><td>{selectedData.id}</td></tr>
                      <tr><th>Judul</th><td>{selectedData.judul}</td></tr>
                      <tr>
                        <th>Waktu</th>
                        <td>
                          {formatTanggal(selectedData.tanggal)} |{' '}
                          {formatJam(selectedData.jam_mulai)} -{' '}
                          {formatJam(selectedData.jam_selesai)} WIB
                        </td>
                      </tr>
                      <tr><th>Lokasi</th><td>{selectedData.nama_lokasi}</td></tr>
                      <tr><th>Deskripsi</th><td>{selectedData.deskripsi}</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="modal-footer">
                  {selectedData.status === 'menunggu' && (
                    <>
                      <button
                        className="btn btn-danger"
                        onClick={() => updateStatus(selectedData.id, 'reject')}
                      >
                        Tolak
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => updateStatus(selectedData.id, 'approve')}
                      >
                        Approve
                      </button>
                    </>
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
