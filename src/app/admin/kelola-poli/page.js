'use client'

import { useEffect, useState } from 'react'

const ICON_LIST = [
  { icon: 'fas fa-stethoscope', label: 'Stetoskop' },
  { icon: 'fas fa-tooth', label: 'Gigi' },
  { icon: 'fas fa-female', label: 'Ibu & Anak' },
  { icon: 'fas fa-user-shield', label: 'KB' },
  { icon: 'fas fa-lungs', label: 'Paru / TB' },
  { icon: 'fas fa-user-clock', label: 'Lansia' },
  { icon: 'fas fa-child', label: 'Anak' },
  { icon: 'fas fa-syringe', label: 'Imunisasi' },
  { icon: 'fas fa-apple-alt', label: 'Gizi' },
  { icon: 'fas fa-comments', label: 'Konseling' }
]

export default function KelolaPoliPage() {
  const [poli, setPoli] = useState([])
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editId, setEditId] = useState(null)

  const [formData, setFormData] = useState({
    nama_poli: '',
    deskripsi: '',
    icon: ''
  })

  // ================= FETCH =================
  const fetchPoli = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/poli')
      const data = await res.json()
      setPoli(Array.isArray(data) ? data : [])
    } catch {
      alert('Gagal mengambil data poli')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPoli()
  }, [])

  // ================= OPEN =================
  const openTambah = () => {
    setIsEdit(false)
    setEditId(null)
    setFormData({
      nama_poli: '',
      deskripsi: '',
      icon: '',
    })
    setShowModal(true)
  }

  const openEdit = (item) => {
    setIsEdit(true)
    setEditId(item.id)
    setFormData({
      nama_poli: item.nama_poli,
      deskripsi: item.deskripsi,
      icon: item.icon,
    })
    setShowModal(true)
  }

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    const url = isEdit
      ? `http://localhost:5001/api/admin/poli/${editId}`
      : 'http://localhost:5001/api/admin/poli'

    const method = isEdit ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    })

    if (!res.ok) {
      alert('Gagal menyimpan poli')
      return
    }

    setShowModal(false)
    fetchPoli()
  }

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm('Hapus poli ini?')) return
    const token = localStorage.getItem('token')

    await fetch(`http://localhost:5001/api/admin/poli/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })

    fetchPoli()
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
        <h4>Kelola Poli</h4>
        <button className="btn btn-success" onClick={openTambah}>
          + Tambah Poli
        </button>
      </div>

      <div className="card">
        <div className="card-body table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-success">
              <tr>
                <th>Poli</th>
                <th>Deskripsi</th>
                <th>Icon</th>
                <th width="120" className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {poli.map(p => (
                <tr key={p.id}>
                  <td>{p.nama_poli}</td>
                  <td>{p.deskripsi}</td>
                  <td className="text-center">
                    <i className={`${p.icon} fa-lg`}></i>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-warning me-1"
                      onClick={() => openEdit(p)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(p.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
              {poli.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    Belum ada data poli
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
            <h5>{isEdit ? 'Edit Poli' : 'Tambah Poli'}</h5>
            </div>

            <div className="modal-body">
            <input
                className="form-control mb-2"
                placeholder="Nama Poli"
                value={formData.nama_poli}
                onChange={e =>
                setFormData({ ...formData, nama_poli: e.target.value })
                }
                required
            />

            <textarea
                className="form-control mb-2"
                placeholder="Deskripsi"
                value={formData.deskripsi}
                onChange={e =>
                setFormData({ ...formData, deskripsi: e.target.value })
                }
            />

            <label className="form-label fw-bold">Pilih Icon</label>

            <div className="row g-2 mb-3">
                {ICON_LIST.map(item => (
                <div className="col-3 text-center" key={item.icon}>
                    <div
                    className={`border rounded p-2
                        ${formData.icon === item.icon ? 'border-success bg-light' : ''}`}
                    onClick={() =>
                        setFormData({ ...formData, icon: item.icon })
                    }
                    style={{ cursor: 'pointer' }}
                    >
                    <i className={`${item.icon} fa-2x mb-1`}></i>
                    <div className="small">{item.label}</div>
                    </div>
                </div>
                ))}
            </div>
            </div> {/* ✅ modal-body DITUTUP DI SINI */}

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

