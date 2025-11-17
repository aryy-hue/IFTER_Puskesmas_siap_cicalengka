'use client'

import { useState, useEffect } from 'react'

export default function RiwayatPasien() {
  const [pasien, setPasien] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPasien, setSelectedPasien] = useState(null)

  // Data sample pasien
  useEffect(() => {
    const sampleData = [
      {
        id: 1,
        nama: 'Ahmad Santoso',
        nik: '3204101234567890',
        alamat: 'Jl. Merdeka No. 123, Cicalengka',
        tanggalLahir: '1985-05-15',
        riwayat: [
          {
            tanggal: '2024-01-15',
            poli: 'Poli Umum',
            diagnosa: 'Demam dan Flu',
            obat: 'Paracetamol, Vitamin C'
          },
          {
            tanggal: '2024-01-10',
            poli: 'Poli Gigi',
            diagnosa: 'Kontrol rutin',
            obat: '-'
          }
        ]
      },
      {
        id: 2,
        nama: 'Siti Rahayu',
        nik: '3204101234567891',
        alamat: 'Jl. Pahlawan No. 45, Cicalengka',
        tanggalLahir: '1990-08-20',
        riwayat: [
          {
            tanggal: '2024-01-12',
            poli: 'Poli Anak',
            diagnosa: 'Imunisasi DPT',
            obat: 'Vaksin DPT'
          }
        ]
      }
    ]
    setPasien(sampleData)
  }, [])

  const filteredPasien = pasien.filter(p => 
    p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.nik.includes(searchTerm)
  )

  return (
    <div>
      <h1 className="h3 mb-4">Riwayat Pasien</h1>

      {/* Search Bar */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Cari berdasarkan nama atau NIK..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-primary">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Daftar Pasien */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title mb-0">Daftar Pasien</h5>
            </div>
            <div className="card-body p-0">
              {filteredPasien.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted">Tidak ada pasien ditemukan</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredPasien.map((p) => (
                    <button
                      key={p.id}
                      className={`list-group-item list-group-item-action ${
                        selectedPasien?.id === p.id ? 'active' : ''
                      }`}
                      onClick={() => setSelectedPasien(p)}
                    >
                      <div>
                        <strong>{p.nama}</strong>
                        <br />
                        <small>NIK: {p.nik}</small>
                        <br />
                        <small>{p.alamat}</small>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detail Riwayat */}
        <div className="col-md-8">
          {selectedPasien ? (
            <div className="card">
              <div className="card-header">
                <h5 className="card-title mb-0">
                  Riwayat Medis - {selectedPasien.nama}
                </h5>
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <strong>NIK:</strong> {selectedPasien.nik}
                  </div>
                  <div className="col-md-6">
                    <strong>Tanggal Lahir:</strong> {new Date(selectedPasien.tanggalLahir).toLocaleDateString('id-ID')}
                  </div>
                  <div className="col-12 mt-2">
                    <strong>Alamat:</strong> {selectedPasien.alamat}
                  </div>
                </div>

                <h6>Riwayat Kunjungan:</h6>
                {selectedPasien.riwayat.length === 0 ? (
                  <p className="text-muted">Belum ada riwayat kunjungan</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Tanggal</th>
                          <th>Poli</th>
                          <th>Diagnosa</th>
                          <th>Obat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPasien.riwayat.map((r, index) => (
                          <tr key={index}>
                            <td>{new Date(r.tanggal).toLocaleDateString('id-ID')}</td>
                            <td>{r.poli}</td>
                            <td>{r.diagnosa}</td>
                            <td>{r.obat}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="fas fa-user-injured fa-3x text-muted mb-3"></i>
                <p className="text-muted">Pilih pasien untuk melihat riwayat</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
