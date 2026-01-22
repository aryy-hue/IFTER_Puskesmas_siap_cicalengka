'use client'

import { useEffect, useState } from 'react'

export default function RiwayatPasien() {
  const [data, setData] = useState([])
  const [lokasiList, setLokasiList] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)

  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  const [formData, setFormData] = useState({
    pasien_nama: '',
    penyakit: '',
    lokasi_id: '',
    alamat: '',
    tanggal: ''
  })

  // ================= FETCH =================
  useEffect(() => {
    fetchData()
    fetchLokasi()
  }, [])

  const fetchData = async () => {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Token tidak ditemukan, silakan login ulang')
      return
    }

    const res = await fetch(
      'http://localhost:5001/api/admin/riwayat-pasien',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const result = await res.json()
    setData(Array.isArray(result) ? result : [])
  } catch (err) {
    console.error(err)
    alert('Gagal mengambil data pasien')
  } finally {
    setLoading(false)
  }
}


  const fetchLokasi = async () => {
    const res = await fetch('http://localhost:5001/api/lokasi')
    const result = await res.json()
    setLokasiList(Array.isArray(result) ? result : [])
  }

  // ================= FILTER =================
  const filteredData = data.filter(item =>
    item.pasien_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.penyakit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ================= MODAL =================
  const openAdd = () => {
    setIsEdit(false)
    setSelectedItem(null)
    setFormData({
      pasien_nama: '',
      penyakit: '',
      lokasi_id: '',
      alamat: '',
      tanggal: ''
    })
    setShowModal(true)
  }

  const openEdit = (item) => {
    setIsEdit(true)
    setSelectedItem(item)
    setFormData({
      pasien_nama: item.pasien_nama,
      penyakit: item.penyakit,
      lokasi_id: item.lokasi_id,
      alamat: item.alamat,
      tanggal: item.tanggal?.slice(0, 10)
    })
    setShowModal(true)
  }

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
  e.preventDefault()
  const token = localStorage.getItem('token')

  if (!token) {
    alert('Token tidak ditemukan, silakan login ulang')
    return
  }

  const endpoint = isEdit
    ? `http://localhost:5001/api/admin/riwayat-pasien/${formData.id}`
    : 'http://localhost:5001/api/admin/riwayat-pasien'

  const method = isEdit ? 'PUT' : 'POST'

  try {
    const res = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        pasien_nama: formData.pasien_nama,
        penyakit: formData.penyakit,
        lokasi_id: formData.lokasi_id,
        alamat: formData.alamat,
        tanggal: formData.tanggal
      })
    })

    const result = await res.json()

    if (!res.ok) {
      alert(result.message || 'Gagal menyimpan data')
      return
    }

    setShowModal(false)
    fetchData()
  } catch (err) {
    console.error(err)
    alert('Terjadi kesalahan koneksi')
  }
}


  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!confirm('Yakin ingin menghapus data ini?')) return
    const token = localStorage.getItem('token')

    await fetch(
      `http://localhost:5001/api/admin/riwayat-pasien/${id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    setSelectedItem(null)
    fetchData()
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
    <div className="container-fluid p-3">
      <div className="d-flex justify-content-between mb-3">
        <h4>Riwayat Penyakit Berat</h4>
        <button className="btn btn-success" onClick={openAdd}>
          <i className="fas fa-plus me-2"></i>Tambah Data
        </button>
      </div>

      <input
        className="form-control mb-3"
        placeholder="Cari nama, penyakit, atau alamat..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div className="row">
        {/* LIST */}
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-header bg-success text-white">
              Daftar Pasien
            </div>
            <div className="list-group list-group-flush">
              {filteredData.map(item => (
                <button
                  key={item.id}
                  className={`list-group-item list-group-item-action ${
                    selectedItem?.id === item.id ? 'active' : ''
                  }`}
                  onClick={() => setSelectedItem(item)}
                >
                  <strong>{item.pasien_nama}</strong>
                  <br />
                  <small>Penyakit: {item.penyakit}</small>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DETAIL */}
        <div className="col-md-8">
          {selectedItem ? (
            <div className="card">
              <div className="card-header d-flex justify-content-between">
                <strong>Detail Pasien</strong>
                <div>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => openEdit(selectedItem)}
                  >
                    <i className="fas fa-edit"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(selectedItem.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <div className="card-body">
                <p><strong>Nama:</strong> {selectedItem.pasien_nama}</p>
                <div className="alert alert-danger">
                  {selectedItem.penyakit}
                </div>
                <p><strong>Alamat:</strong> {selectedItem.alamat}</p>
                <p><strong>Tanggal:</strong> {
                  new Date(selectedItem.tanggal).toLocaleDateString('id-ID')
                }</p>
              </div>
            </div>
          ) : (
            <div className="card text-center py-5">
              <p className="text-muted">
                Pilih data pasien untuk melihat detail
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={handleSubmit}>
              <div className="modal-header bg-success text-white">
                <h5>{isEdit ? 'Edit' : 'Tambah'} Riwayat Penyakit</h5>
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nama Pasien"
                  value={formData.pasien_nama}
                  onChange={e =>
                    setFormData({ ...formData, pasien_nama: e.target.value })
                  }
                  required
                />

                <input
                  className="form-control mb-2"
                  placeholder="Penyakit (DBD / TBC / HIV)"
                  value={formData.penyakit}
                  onChange={e =>
                    setFormData({ ...formData, penyakit: e.target.value })
                  }
                  required
                />

                <select
                  className="form-select mb-2"
                  value={formData.lokasi_id}
                  onChange={e =>
                    setFormData({ ...formData, lokasi_id: e.target.value })
                  }
                  required
                >
                  <option value="">-- Pilih Desa --</option>
                  {lokasiList.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.nama_lokasi}
                    </option>
                  ))}
                </select>

                <textarea
                  className="form-control mb-2"
                  placeholder="Alamat Lengkap"
                  value={formData.alamat}
                  onChange={e =>
                    setFormData({ ...formData, alamat: e.target.value })
                  }
                  required
                />

                <input
                  type="date"
                  className="form-control"
                  value={formData.tanggal}
                  onChange={e =>
                    setFormData({ ...formData, tanggal: e.target.value })
                  }
                  required
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
