'use client'

import { useEffect, useState } from 'react'

export default function KelolaDokterPage() {
  const [dokterList, setDokterList] = useState([])
  const [poliList, setPoliList] = useState([])
  const [userDokterList, setUserDokterList] = useState([])
  const [jadwalList, setJadwalList] = useState([])
  const [loading, setLoading] = useState(true)

  const [showTambahDokter, setShowTambahDokter] = useState(false)
  const [showEditDokter, setShowEditDokter] = useState(false)
  const [showJadwal, setShowJadwal] = useState(false)

  const [selectedDokter, setSelectedDokter] = useState(null)

  const [formDokter, setFormDokter] = useState({
    nama: '',
    spesialis: '',
    no_telepon: '',
    email: '',
    poli_id: ''
  })

  const [formJadwal, setFormJadwal] = useState({
    hari: 'Senin',
    jam_mulai: '',
    jam_selesai: '',
    status: 'aktif'
  })

  const [formTambahDokter, setFormTambahDokter] = useState({
    user_id: '',
    nama: '',
    spesialis: '',
    no_telepon: '',
    email: '',
    poli_id: ''
  })

  // ================= FETCH =================
  useEffect(() => {
    fetchDokter()
    fetchPoli()
    fetchUserDokter()
  }, [])

  const fetchDokter = async () => {
    try {
      const token = localStorage.getItem('token')

      const res = await fetch('http://localhost:5001/api/admin/dokter', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await res.json()
      setDokterList(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setDokterList([])
    } finally {
      setLoading(false)
    }
  }

  const fetchUserDokter = async () => {
  const token = localStorage.getItem('token')

  const res = await fetch(
    'http://localhost:5001/api/admin/user-dokter',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  const data = await res.json()
  setUserDokterList(Array.isArray(data) ? data : [])
}

  const fetchPoli = async () => {
    const res = await fetch('http://localhost:5001/api/poli')
    const data = await res.json()
    setPoliList(data)
  }
  
 // ================= TAMBAH DOKTER =================
  const submitTambahDokter = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    await fetch('http://localhost:5001/api/admin/dokter', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(formTambahDokter)
    })

    setShowTambahDokter(false)
    setFormTambahDokter({
      user_id: '',
      nama: '',
      spesialis: '',
      no_telepon: '',
      email: '',
      poli_id: ''
    })

    fetchDokter()
    fetchUserDokter()
  }

  // ================= EDIT DOKTER =================
  const openEditDokter = (dokter) => {
    setSelectedDokter(dokter)
    setFormDokter({
      nama: dokter.nama,
      spesialis: dokter.spesialis || '',
      no_telepon: dokter.no_telepon || '',
      email: dokter.email || '',
      poli_id: dokter.poli_id
    })
    setShowEditDokter(true)
  }

  const submitEditDokter = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    await fetch(`http://localhost:5001/api/admin/dokter/${selectedDokter.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(formDokter)
    })

    setShowEditDokter(false)
    fetchDokter()
  }

  // ================= JADWAL =================
  const openKelolaJadwal = async (dokter) => {
    setSelectedDokter(dokter)
    setShowJadwal(true)

    const token = localStorage.getItem('token')

    const res = await fetch(
      `http://localhost:5001/api/admin/dokter/${dokter.id}/jadwal`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    const data = await res.json()
    setJadwalList(Array.isArray(data) ? data : [])
  }

  const submitJadwal = async (e) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    await fetch('http://localhost:5001/api/admin/jadwal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        dokter_id: selectedDokter.id,
        poli_id: formJadwal.poli_id,
        hari: formJadwal.hari,
        jam_mulai: formJadwal.jam_mulai,
        jam_selesai: formJadwal.jam_selesai,
        status: formJadwal.status
      })
    })

    openKelolaJadwal(selectedDokter)
  }

  return (
    <div>
      {/* HEADER + BUTTON */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h1 className="h3 text-success">Kelola Petugas</h1>
          <p className="text-muted">Kelola data Petugas Kesehatan dan Jadwal Praktik</p>
        </div>

        <button
          className="btn btn-success"
          onClick={() => setShowTambahDokter(true)}
        >
          <i className="fas fa-plus me-2"></i>
          Tambah Petugas
        </button>
      </div>
      {/* TABLE */}
      <div className="card border-0 shadow-sm">
        <div className="card-header card-header-custom">
          <h5 className="mb-0 text-white d-flex align-items-center">
            <i className="fas fa-user-md me-2"></i>
            Daftar Dokter
          </h5>
        </div>

        <div className="card-body">
          {loading ? (
            <p>Memuat data...</p>
          ) : (
            <table className="table table-bordered align-middle">
              <thead>
                <tr>
                  <th>Nama</th>
                  <th>Profesi</th>
                  <th>Poli</th>
                  <th width="120" className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dokterList.map((d) => (
                  <tr key={d.id}>
                    <td>{d.nama}</td>
                    <td>{d.spesialis || '-'}</td>
                    <td>{d.nama_poli}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        title="Edit Dokter"
                        onClick={() => openEditDokter(d)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success"
                        title="Kelola Jadwal"
                        onClick={() => openKelolaJadwal(d)}
                      >
                        <i className="fas fa-calendar-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* MODAL TAMBAH DOKTER */}
      {showTambahDokter && (
        <div className="modal fade show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={submitTambahDokter}>
              <div className="modal-header bg-success text-white">
                <h5>Tambah Dokter</h5>
              </div>
              <div className="modal-body">
                <select className="form-select mb-2" required
                value={formTambahDokter.user_id}
                onChange={(e)=>setFormTambahDokter({
                    ...formTambahDokter,
                    user_id: e.target.value
                })}
                >
                <option value="">-- Pilih Petugas --</option>
                {userDokterList.map(u => (
                <option key={u.id} value={u.id}>
                    {u.full_name} ({u.username})
                </option>
                ))}
                </select>
                <input className="form-control mb-2" placeholder="Nama Dokter"
                  value={formTambahDokter.nama}
                  onChange={(e)=>setFormTambahDokter({...formTambahDokter,nama:e.target.value})}
                  required
                />

                <input className="form-control mb-2" placeholder="Profesi"
                  value={formTambahDokter.spesialis}
                  onChange={(e)=>setFormTambahDokter({...formTambahDokter,spesialis:e.target.value})}
                />

                <select className="form-select" required
                  value={formTambahDokter.poli_id}
                  onChange={(e)=>setFormTambahDokter({...formTambahDokter,poli_id:e.target.value})}
                >
                  <option value="">-- Pilih Poli --</option>
                  {poliList.map(p=>(
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary"
                  onClick={()=>setShowTambahDokter(false)}>
                  Batal
                </button>
                <button className="btn btn-success">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* MODAL EDIT DOKTER */}
      {showEditDokter && (
        <div className="modal fade show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog">
            <form className="modal-content" onSubmit={submitEditDokter}>
              <div className="modal-header bg-success text-white">
                <h5>Edit Dokter</h5>
              </div>
              <div className="modal-body">
                <input className="form-control mb-2" placeholder="Nama"
                  value={formDokter.nama}
                  onChange={(e)=>setFormDokter({...formDokter,nama:e.target.value})}
                />
                <input className="form-control mb-2" placeholder="Spesialis"
                  value={formDokter.spesialis}
                  onChange={(e)=>setFormDokter({...formDokter,spesialis:e.target.value})}
                />
                <input className="form-control mb-2" placeholder="No Telepon"
                  value={formDokter.no_telepon}
                  onChange={(e)=>setFormDokter({...formDokter,no_telepon:e.target.value})}
                />
                <input className="form-control mb-2" placeholder="Email"
                  value={formDokter.email}
                  onChange={(e)=>setFormDokter({...formDokter,email:e.target.value})}
                />
                <select className="form-select"
                  value={formDokter.poli_id}
                  onChange={(e)=>setFormDokter({...formDokter,poli_id:e.target.value})}
                >
                  {poliList.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary"
                  onClick={()=>setShowEditDokter(false)}>Batal</button>
                <button className="btn btn-success">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL JADWAL */}
      {showJadwal && (
        <div className="modal fade show d-block bg-dark bg-opacity-50">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5>Jadwal Dokter - {selectedDokter.nama}</h5>
              </div>
              <div className="modal-body">
                {jadwalList.map(j => (
                  <div key={j.id} className="border p-2 mb-2">
                    {j.hari} | {j.jam_mulai} - {j.jam_selesai} ({j.status})
                  </div>
                ))}

                <hr />

                <form onSubmit={submitJadwal}>
                  <h6>Tambah Jadwal</h6>
                  <div className="row">
                    <div className="col">
                      <select className="form-select"
                        onChange={(e)=>setFormJadwal({...formJadwal,hari:e.target.value})}>
                        {['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu']
                          .map(h => <option key={h}>{h}</option>)}
                      </select>
                    </div>
                    <div className="col">
                      <input type="time" className="form-control"
                        onChange={(e)=>setFormJadwal({...formJadwal,jam_mulai:e.target.value})}/>
                    </div>
                    <div className="col">
                      <input type="time" className="form-control"
                        onChange={(e)=>setFormJadwal({...formJadwal,jam_selesai:e.target.value})}/>
                    </div>
                  </div>
                  <button className="btn btn-success mt-2">Tambah</button>
                </form>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary"
                  onClick={()=>setShowJadwal(false)}>Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .card-header-custom {
          background: #198754;
        }
      `}</style>
    </div>
  )
}
