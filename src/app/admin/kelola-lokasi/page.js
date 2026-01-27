'use client'

import { useEffect, useState } from 'react'

export default function KelolaLokasiPage() {
  const [lokasi, setLokasi] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState(null)

  const [formData, setFormData] = useState({
    nama_lokasi: '',
    latitude: '',
    longitude: '',
    is_puskesmas: false
  })

  // ================= FETCH =================
  const fetchLokasi = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('http://localhost:5001/api/lokasi', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      setLokasi(Array.isArray(data) ? data : [])
    } catch (err) {
      alert('Gagal mengambil data lokasi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLokasi()
  }, [])

  // ================= OPEN MODAL =================
  const openTambah = () => {
    setIsEdit(false)
    setEditId(null)
    setFormData({
      nama_lokasi: '',
      latitude: '',
      longitude: '',
      is_puskesmas: false
    })
    setShowModal(true)
  }

  const openEdit = (item) => {
    setIsEdit(true)
    setEditId(item.id)
    setFormData({
      nama_lokasi: item.nama_lokasi,
      latitude: item.latitude ?? '',
      longitude: item.longitude ?? '',
      is_puskesmas: item.is_puskesmas === 1
    })
    setShowModal(true)
  }

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const payload = {
      nama_lokasi: formData.nama_lokasi,
      latitude: formData.latitude || null,
      longitude: formData.longitude || null,
      is_puskesmas: formData.is_puskesmas ? 1 : 0
    }

    const url = isEdit
      ? `http://localhost:5001/api/admin/lokasi/${editId}`
      : 'http://localhost:5001/api/admin/lokasi'

    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    if (!res.ok) {
      alert('Gagal menyimpan lokasi')
      return
    }

    setShowModal(false)
    fetchLokasi()
  }

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm('Hapus lokasi ini?')) return
    const token = localStorage.getItem('token')

    await fetch(`http://localhost:5001/api/admin/lokasi/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    fetchLokasi()
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
        <h4>Kelola Lokasi</h4>
        <button className="btn btn-success" onClick={openTambah}>
          + Tambah Lokasi
        </button>
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="card-body table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-success">
              <tr>
                <th>Nama Lokasi</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th width="140" className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {lokasi.map(l => (
                <tr key={l.id}>
                  <td>{l.nama_lokasi}</td>
                  <td>{l.latitude ?? '-'}</td>
                  <td>{l.longitude ?? '-'}</td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-warning me-1"
                      onClick={() => openEdit(l)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(l.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {lokasi.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    Belum ada data lokasi
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header bg-success text-white">
                <h5>{isEdit ? 'Edit Lokasi' : 'Tambah Lokasi'}</h5>
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nama Lokasi"
                  value={formData.nama_lokasi}
                  onChange={e =>
                    setFormData({ ...formData, nama_lokasi: e.target.value })
                  }
                  required
                />

                <input
                  type="number"
                  step="any"
                  className="form-control mb-2"
                  placeholder="Latitude"
                  value={formData.latitude}
                  onChange={e =>
                    setFormData({ ...formData, latitude: e.target.value })
                  }
                />

                <input
                  type="number"
                  step="any"
                  className="form-control mb-2"
                  placeholder="Longitude"
                  value={formData.longitude}
                  onChange={e =>
                    setFormData({ ...formData, longitude: e.target.value })
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
                <button className="btn btn-success">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
