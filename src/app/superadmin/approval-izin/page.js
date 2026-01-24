'use client'

import { useEffect, useState } from 'react'

export default function ApprovalIzinPage() {
  const [izinList, setIzinList] = useState([])
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

      const res = await fetch('http://localhost:5001/api/superadmin/izin', {
        headers: { Authorization: `Bearer ${token}` }
      })

      const data = await res.json()
      setIzinList(Array.isArray(data) ? data : [])
    } catch (err) {
      alert('Gagal mengambil data izin')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // ================= FILTER =================
  const filteredIzin = izinList.filter(i => {
    const keyword = searchTerm.toLowerCase()

    const matchSearch =
      i.nama_user?.toLowerCase().includes(keyword) ||
      i.jenis_izin?.toLowerCase().includes(keyword)

    const matchStatus =
      !statusFilter || i.status_approval === statusFilter

    const izinDate = new Date(i.tanggal_awal)
    const matchStart = startDate ? izinDate >= new Date(startDate) : true
    const matchEnd = endDate ? izinDate <= new Date(endDate) : true

    return matchSearch && matchStatus && matchStart && matchEnd
  })

  // ================= ACTION =================
  const openDetail = (item) => {
    setSelectedData(item)
    setShowModal(true)
  }

  const handleApprove = async (id) => {
    if (!confirm('Setujui izin ini?')) return
    const token = localStorage.getItem('token')

    await fetch(
      `http://localhost:5001/api/superadmin/izin/${id}/approve`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    setShowModal(false)
    fetchData()
  }

  const handleReject = async (id) => {
    if (!confirm('Tolak izin ini?')) return
    const token = localStorage.getItem('token')

    await fetch(
      `http://localhost:5001/api/superadmin/izin/${id}/reject`,
      {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    setShowModal(false)
    fetchData()
  }

  const getStatusBadge = (status) => {
    if (status === 'Pending') return <span className="badge bg-warning text-dark">Pending</span>
    if (status === 'Disetujui') return <span className="badge bg-success">Disetujui</span>
    if (status === 'Ditolak') return <span className="badge bg-danger">Ditolak</span>
    return <span className="badge bg-secondary">-</span>
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
      <h4 className="mb-3">Approval Izin</h4>

      {/* FILTER */}
      <div className="card mb-3">
        <div className="card-body d-flex flex-wrap gap-2 align-items-end">
          <input
            className="form-control"
            style={{ maxWidth: 250 }}
            placeholder="Cari nama / jenis izin"
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
              <option value="Pending">Pending</option>
              <option value="Disetujui">Disetujui</option>
              <option value="Ditolak">Ditolak</option>
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
        <div className="card-body table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-success">
              <tr>
                <th>Nama</th>
                <th>Jenis Izin</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredIzin.map(item => (
                <tr key={item.id}>
                  <td>{item.nama_user}</td>
                  <td>{item.jenis_izin}</td>
                  <td>
                    {new Date(item.tanggal_awal).toLocaleDateString('id-ID')}
                    {' '}s/d{' '}
                    {new Date(item.tanggal_akhir).toLocaleDateString('id-ID')}
                  </td>
                  <td>{getStatusBadge(item.status_approval)}</td>
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

              {filteredIzin.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETAIL */}
      {showModal && selectedData && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">Detail Izin</h5>
                  <button className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                </div>

                <div className="modal-body">
                  <table className="table table-sm">
                    <tbody>
                      <tr><th>Nama</th><td>{selectedData.nama_user}</td></tr>
                      <tr><th>Jenis Izin</th><td>{selectedData.jenis_izin}</td></tr>
                      <tr>
                        <th>Tanggal</th>
                        <td>
                          {new Date(selectedData.tanggal_awal).toLocaleDateString('id-ID')}
                          {' '}s/d{' '}
                          {new Date(selectedData.tanggal_akhir).toLocaleDateString('id-ID')}
                        </td>
                      </tr>
                      <tr><th>Alasan</th><td>{selectedData.alasan}</td></tr>
                      <tr><th>Status</th><td>{getStatusBadge(selectedData.status_approval)}</td></tr>
                    </tbody>
                  </table>
                </div>

                <div className="modal-footer">
                  {selectedData.status_approval === 'Pending' && (
                    <>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReject(selectedData.id)}
                      >
                        Tolak
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => handleApprove(selectedData.id)}
                      >
                        Setujui
                      </button>
                    </>
                  )}
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
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