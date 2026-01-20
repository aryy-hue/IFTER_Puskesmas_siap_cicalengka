'use client'

import { useState } from 'react'

export default function ApprovalKegiatanPage() {
  const [showModal, setShowModal] = useState(false)
  const [selectedData, setSelectedData] = useState(null)

  // dummy data (struktur mengikuti admin)
  const kegiatanList = [
    {
      id: 'PY-001',
      judul: 'Penyuluhan Gizi',
      jenis_kegiatan: 'Penyuluhan',
      tanggal: '2025-11-30',
      jam_mulai: '09:00',
      jam_selesai: '11:00',
      lokasi: 'Aula Puskesmas',
      deskripsi: 'Penyuluhan gizi untuk masyarakat umum.',
      status: 'menunggu',
      laporan: {
        judul_laporan: 'Laporan Penyuluhan Gizi',
        detail_kegiatan: 'Kegiatan berjalan lancar dengan antusias warga.',
        foto: '/img/puskesmas.jpg'
      }
    }
  ]

  const openDetail = (item) => {
    setSelectedData(item)
    setShowModal(true)
  }

  return (
    <div>
      <h1 className="h4 mb-4">Approval Kegiatan</h1>

      {/* FILTER */}
      <div className="card mb-3">
        <div className="card-body row g-2">
          <div className="col-md-4">
            <input className="form-control" placeholder="Cari nama kegiatan" />
          </div>
          <div className="col-md-3">
            <select className="form-select">
              <option value="">Semua Jenis</option>
              <option>Penyuluhan</option>
              <option>Vaksinasi</option>
              <option>Posyandu</option>
            </select>
          </div>
          <div className="col-md-3">
            <input type="date" className="form-control" />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <div className="card-body table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-success">
              <tr>
                <th>ID</th>
                <th>Nama Kegiatan</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kegiatanList.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.judul}</td>
                  <td>{item.tanggal}</td>
                  <td>
                    <span className="badge bg-warning">Menunggu</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-info btn-sm me-2"
                      onClick={() => openDetail(item)}
                    >
                      Detail
                    </button>
                    <button className="btn btn-success btn-sm me-1">Approve</button>
                    <button className="btn btn-danger btn-sm">Tolak</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETAIL KEGIATAN */}
      {showModal && selectedData && (
        <>
          <div className="modal-backdrop show"></div>
          <div className="modal show d-block">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    Detail Kegiatan & Laporan
                  </h5>
                  <button
                    className="btn-close btn-close-white"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>

                <div className="modal-body">
                  {/* INFORMASI KEGIATAN */}
                  <h6 className="fw-bold mb-2">Informasi Kegiatan</h6>
                  <table className="table table-sm">
                    <tbody>
                      <tr><th>ID</th><td>{selectedData.id}</td></tr>
                      <tr><th>Nama</th><td>{selectedData.judul}</td></tr>
                      <tr><th>Jenis</th><td>{selectedData.jenis_kegiatan}</td></tr>
                      <tr>
                        <th>Waktu</th>
                        <td>
                          {selectedData.tanggal} | {selectedData.jam_mulai} - {selectedData.jam_selesai} WIB
                        </td>
                      </tr>
                      <tr><th>Lokasi</th><td>{selectedData.lokasi}</td></tr>
                      <tr><th>Deskripsi</th><td>{selectedData.deskripsi}</td></tr>
                    </tbody>
                  </table>

                  <hr />

                  {/* INFORMASI LAPORAN */}
                  <h6 className="fw-bold mb-2">Laporan Kegiatan</h6>
                  <p><strong>Judul:</strong> {selectedData.laporan.judul_laporan}</p>
                  <p>{selectedData.laporan.detail_kegiatan}</p>

                  <div>
                    <strong>Foto Kegiatan:</strong><br />
                    <img
                      src={selectedData.laporan.foto}
                      alt="Foto kegiatan"
                      className="img-fluid rounded mt-2"
                      style={{ maxHeight: '250px' }}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button className="btn btn-danger">Tolak</button>
                  <button className="btn btn-success">Approve</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
