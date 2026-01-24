'use client'

import { useEffect, useState } from 'react'

export default function ApprovalKegiatanPage() {
  const [kegiatanList, setKegiatanList] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedData, setSelectedData] = useState(null)

  // ================= FETCH =================
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')

      const res = await fetch(
        'http://localhost:5001/api/superadmin/kegiatan',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const data = await res.json()

      // 🔐 AMAN: pastikan selalu array
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
    return (
      k.judul?.toLowerCase().includes(keyword) ||
      k.id?.toLowerCase().includes(keyword) ||
      k.status?.toLowerCase().includes(keyword)
    )
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

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-success"></div>
      </div>
    )
  }
const formatTanggal = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const formatJam = (time) => {
  if (!time) return '-'
  return time.slice(0, 5) // HH:mm
}

  // ================= RENDER =================
  return (
    <div className="container-fluid p-4">
      <h4 className="mb-3">Approval Kegiatan</h4>

      {/* FILTER */}
      <div className="d-flex gap-2 mb-3">
        <input
          className="form-control w-25"
          placeholder="Cari ID / Judul / Status"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
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
              <th width="180" className="text-center">Aksi</th>
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
                <td>{new Date(item.tanggal).toLocaleDateString('id-ID')}</td>
                <td>{item.nama_lokasi || '-'}</td>
                <td>
                  <span className={`badge ${
                    item.status === 'menunggu'
                      ? 'bg-warning text-dark'
                      : item.status === 'disetujui'
                      ? 'bg-success'
                      : 'bg-danger'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-info btn-sm me-1"
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
                  <h5>Detail Kegiatan & Laporan</h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  <h6 className="fw-bold">Informasi Kegiatan</h6>
                  <table className="table table-sm">
                    <tbody>
                      <tr><th>ID</th><td>{selectedData.id}</td></tr>
                      <tr><th>Judul</th><td>{selectedData.judul}</td></tr>
                      <tr>
                        <th>Waktu</th>
                        <td>
                          {formatTanggal(selectedData.tanggal)} |  
                          {formatJam(selectedData.jam_mulai)} - {formatJam(selectedData.jam_selesai)} WIB
                        </td>
                      </tr>
                      <tr><th>Lokasi</th><td>{selectedData.nama_lokasi}</td></tr>
                      <tr><th>Deskripsi</th><td>{selectedData.deskripsi}</td></tr>
                    </tbody>
                  </table>

                  <hr />

                  <h6 className="fw-bold">Laporan Kegiatan</h6>
                  {selectedData.laporan ? (
                    <>
                      <p><strong>Judul:</strong> {selectedData.laporan.judul_laporan}</p>
                      <p>{selectedData.laporan.detail_kegiatan}</p>

                      {selectedData.laporan.img && (
                        <img
                          src={`data:image/jpeg;base64,${selectedData.laporan.img}`}
                          className="img-fluid rounded"
                          style={{ maxHeight: 250 }}
                        />
                      )}
                    </>
                  ) : (
                    <span className="badge bg-secondary">
                      Belum ada laporan
                    </span>
                  )}
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