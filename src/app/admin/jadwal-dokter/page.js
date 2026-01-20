'use client'

import { useState } from 'react'

export default function JadwalDokterPage() {
  const [showModal, setShowModal] = useState(false)

  // dummy data
  const [jadwal, setJadwal] = useState([
    {
      id: 1,
      dokter: 'Dr. Fauzan',
      poli: 'Poli Anak',
      hari: 'Senin - Jumat',
      jam: '09:00 - 15:00',
      status: 'Aktif'
    }
  ])

  const [form, setForm] = useState({
    dokter: '',
    poli: '',
    hari: '',
    jam_mulai: '',
    jam_selesai: '',
    status: 'Aktif'
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    setJadwal([
      ...jadwal,
      {
        id: Date.now(),
        dokter: form.dokter,
        poli: form.poli,
        hari: form.hari,
        jam: `${form.jam_mulai} - ${form.jam_selesai}`,
        status: form.status
      }
    ])

    setShowModal(false)
    setForm({
      dokter: '',
      poli: '',
      hari: '',
      jam_mulai: '',
      jam_selesai: '',
      status: 'Aktif'
    })
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h1 className="h3 text-success">Jadwal Dokter</h1>
          <p className="text-muted mb-0">Pengaturan jadwal praktik dokter per poli</p>
        </div>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          + Tambah Jadwal
        </button>
      </div>

      {/* Table */}
      <div className="card shadow-sm">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th>Dokter</th>
              <th>Poli</th>
              <th>Hari</th>
              <th>Jam</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {jadwal.map(item => (
              <tr key={item.id}>
                <td>{item.dokter}</td>
                <td>{item.poli}</td>
                <td>{item.hari}</td>
                <td>{item.jam}</td>
                <td>
                  <span className="badge bg-success">{item.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah Jadwal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5>Tambah Jadwal Dokter</h5>
                  <button type="button" className="btn-close" onClick={() => setShowModal(false)} />
                </div>

                <div className="modal-body row g-3">
                  <div className="col-12">
                    <label className="form-label">Nama Dokter</label>
                    <select className="form-select" required
                      value={form.dokter}
                      onChange={e => setForm({ ...form, dokter: e.target.value })}
                    >
                      <option value="">Pilih Dokter</option>
                      <option>Dr. Fauzan</option>
                      <option>Dr. Reza</option>
                      <option>Dr. Diddy</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Poli</label>
                    <select className="form-select" required
                      value={form.poli}
                      onChange={e => setForm({ ...form, poli: e.target.value })}
                    >
                      <option value="">Pilih Poli</option>
                      <option>Poli Umum</option>
                      <option>Poli Anak</option>
                      <option>Poli Gigi</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Hari</label>
                    <select className="form-select" required
                      value={form.hari}
                      onChange={e => setForm({ ...form, hari: e.target.value })}
                    >
                      <option value="">Pilih Hari</option>
                      <option>Senin - Jumat</option>
                      <option>Sabtu</option>
                      <option>Minggu</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Jam Mulai</label>
                    <input type="time" className="form-control" required
                      value={form.jam_mulai}
                      onChange={e => setForm({ ...form, jam_mulai: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Jam Selesai</label>
                    <input type="time" className="form-control" required
                      value={form.jam_selesai}
                      onChange={e => setForm({ ...form, jam_selesai: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Batal
                  </button>
                  <button type="submit" className="btn btn-success">
                    Simpan Jadwal
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
