'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import 'src/app/globals.css'

export default function HomePage() {
  const [poliData, setPoliData] = useState([])
  const [selectedPoli, setSelectedPoli] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [jadwalData, setJadwalData] = useState([])
  const [loadingJadwal, setLoadingJadwal] = useState(false)
  const DAFTAR_POLI_URL =
  'https://ilp.pkmcicalengkadtp.com/daftaronline/?page=cari&kode=P3204100101&simpus=CICALENGKA%20DTP&fbclid=PAT01DUANxPJFleHRuA2FlbQIxMAABp5UCy_5gqDW3o0z_W-8kRb48ws7EoDPv7kkCCH4rGd3qkGkS4xXqaJhoRyTW_aem_pCk-gdahGjNhj-xvc8aIaw'

useEffect(() => {
  const fetchPoli = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/poli')
      if (!res.ok) throw new Error('Gagal mengambil data poli')

      const data = await res.json()

      console.log('DATA POLI DARI API:', data)
      setPoliData(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  fetchPoli()
}, [])

const openPoliModal = async (poli) => {
  setSelectedPoli(poli)
  setShowModal(true)
  setLoadingJadwal(true)

  try {
    const res = await fetch(
      `http://localhost:5001/api/jadwal/poli/${poli.id}`
    )
    const data = await res.json()
    setJadwalData(Array.isArray(data) ? data : [])
  } catch {
    setJadwalData([])
  } finally {
    setLoadingJadwal(false)
  }
}

  const closeModal = () => {
    setShowModal(false)
    setSelectedPoli(null)
    setJadwalData([])
  }


  return (
    <div className="home-page">
      <Header />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center min-vh-50 py-5">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold text-success mb-4 animate-fade-in">
                Selamat Datang di Puskesmas Cicalengka
              </h1>
              <p className="lead mb-4 animate-slide-up">
                Melayani dengan hati untuk kesehatan masyarakat Cicalengka dan sekitarnya.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="position-relative">
                <img 
                  src="../img/puskesmas.jpg" 
                  alt="Puskesmas Cicalengka" 
                  className="img-fluid rounded shadow-lg"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik0zMDAgMjAwTDM1MCAxNTBINDUwTDUwMCAyMDBINDUwTDM1MCAzMDBIMzAwTDI1MCAyMDBIMjAwTDE1MCAxNTBIMjUwTDMwMCAyMDBaIiBmaWxsPSIjMTk4NzU0IiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8dGV4dCB4PSIzMDAiIHk9IjIyMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE4IiBmaWxsPSIjOTk5IiBmb250LXdlaWdodD0iYm9sZCI+UHVza2VzbWFzIENpY2FsZW5na2E8L3RleHQ+Cjwvc3ZnPg==';
                  }}
                />
                <div className="floating-elements">
                  <div className="floating-element element-2">
                    <i className="fas fa-heart"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>  

      {/* POLI */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-4">
            <h2>Poli Tersedia</h2>
          </div>

          {loading && (
            <p className="text-center">Memuat data poli...</p>
          )}

          {!loading && poliData.length === 0 && (
            <p className="text-center text-muted">
              Data poli belum tersedia
            </p>
          )}

          <div className="row">
            {poliData.map(poli => (
              <div key={poli.id} className="col-md-4 mb-4">
                <div
                  className="card h-100 border-success"
                  style={{ cursor: 'pointer' }}
                  onClick={() => openPoliModal(poli)}
                >
                  <div className="card-header bg-success text-white d-flex align-items-center gap-2">
                    <i className={`${poli.icon}`}></i>
                    {poli.nama_poli}
                  </div>
                  <div
                    className="card-body"
                    style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}
                  >
                    {poli.deskripsi}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL */}
      {showModal && selectedPoli && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    <i className={`${selectedPoli.icon} me-2`}></i>
                    {selectedPoli.nama_poli}
                  </h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={closeModal}
                ></button>
              </div>

              <div className="modal-body">
                {loadingJadwal && <p>Memuat jadwal dokter...</p>}

                {!loadingJadwal && jadwalData.length === 0 && (
                  <p className="text-muted">
                    Jadwal dokter belum tersedia
                  </p>
                )}

                {!loadingJadwal &&
                  jadwalData.map((jadwal) => (
                    <div
                      key={jadwal.id}
                      className="border rounded p-2 mb-2"
                    >
                      <h6 className="mb-1">{jadwal.nama}</h6>
                      <div className="text-muted small">
                        {jadwal.spesialis}
                      </div>
                      <div className="text-muted small">
                        {jadwal.hari} • {jadwal.jam_mulai} – {jadwal.jam_selesai}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="modal-footer">
                <a
                  href={DAFTAR_POLI_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success"
                >
                  Daftar Online
                </a>

                <button className="btn btn-secondary" onClick={closeModal}>
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Bootstrap JS */}
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
        async
      ></script>
    </div>
  )
}
