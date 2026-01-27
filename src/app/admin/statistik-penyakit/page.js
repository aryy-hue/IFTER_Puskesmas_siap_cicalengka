'use client'

import { useEffect, useState } from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line
} from 'recharts'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

export default function StatistikPenyakit() {
  const [chartData, setChartData] = useState([])
  const [distribusiData, setDistribusiData] = useState([])
  const [lokasiList, setLokasiList] = useState([])
  const [penyakitOptions, setPenyakitOptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalKasus, setTotalKasus] = useState(0)

  // Filter state
  const [selectedLokasi, setSelectedLokasi] = useState('all')
  const [selectedPenyakit, setSelectedPenyakit] = useState('all')
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  // Warna untuk chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D']
  const LOKASI_COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']

  // ================= FETCH DATA =================
  // ================= FETCH DATA =================
    const fetchData = async () => {
    try {
        setLoading(true)
        const token = localStorage.getItem('token')

        // Build query params
        const params = new URLSearchParams()
        if (selectedLokasi !== 'all') params.append('lokasi_id', selectedLokasi)
        if (selectedPenyakit !== 'all') params.append('penyakit', selectedPenyakit)
        if (startDate) params.append('start_date', startDate.toISOString().split('T')[0])
        if (endDate) params.append('end_date', endDate.toISOString().split('T')[0])

        // PERBAIKAN: Gunakan endpoint yang benar
        const [statRes, distRes, lokasiRes] = await Promise.all([
        fetch(`http://localhost:5001/api/statistik-penyakit?${params}`, {  // HAPUS 'admin/' dari path
            headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5001/api/distribusi-lokasi', {  // HAPUS 'admin/' dari path
            headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('http://localhost:5001/api/lokasi')
        ])

        // Tambahkan logging untuk debugging
        console.log('Response status statistik:', statRes.status)
        console.log('Response status distribusi:', distRes.status)
        
        const statData = await statRes.json()
        const distData = await distRes.json()
        const lokasiData = await lokasiRes.json()

        console.log('Stat data:', statData)  // Debug
        console.log('Dist data:', distData)  // Debug

        if (statData.success) {
        setChartData(statData.data.chartData)
        setTotalKasus(statData.data.totalKasus)
        setPenyakitOptions(statData.data.penyakitOptions || [])
        } else {
        console.error('Statistik error:', statData.message)
        }

        if (distData.success) {
        setDistribusiData(distData.data)
        } else {
        console.error('Distribusi error:', distData.message)
        }

        setLokasiList(Array.isArray(lokasiData) ? lokasiData : [])

    } catch (err) {
        console.error('Error fetching data:', err)
        alert('Gagal mengambil data statistik')
    } finally {
        setLoading(false)
    }
    }

  useEffect(() => {
    fetchData()
  }, [selectedLokasi, selectedPenyakit, startDate, endDate])

  // ================= RESET FILTER =================
  const resetFilter = () => {
    setSelectedLokasi('all')
    setSelectedPenyakit('all')
    setStartDate(null)
    setEndDate(null)
  }

  // ================= RENDER =================
  if (loading) {
    return (
      <div className="container-fluid p-4">
        <div className="text-center py-5">
          <div className="spinner-border text-success" style={{ width: '3rem', height: '3rem' }}></div>
          <p className="mt-3">Memuat data statistik...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid p-4">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">📊 Statistik Penyebaran Penyakit</h2>
          <p className="text-muted mb-0">Analisis data riwayat penyakit berdasarkan lokasi dan waktu</p>
        </div>
        <div className="badge bg-success p-3">
          <h4 className="mb-0 text-white">{totalKasus} Total Kasus</h4>
        </div>
      </div>

      {/* FILTER SECTION */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label fw-bold">Filter Lokasi</label>
              <select
                className="form-select"
                value={selectedLokasi}
                onChange={(e) => setSelectedLokasi(e.target.value)}
              >
                <option value="all">Semua Lokasi</option>
                {lokasiList.map(lokasi => (
                  <option key={lokasi.id} value={lokasi.id}>
                    {lokasi.nama_lokasi}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Filter Penyakit</label>
              <select
                className="form-select"
                value={selectedPenyakit}
                onChange={(e) => setSelectedPenyakit(e.target.value)}
              >
                <option value="all">Semua Penyakit</option>
                {penyakitOptions.map((penyakit, index) => (
                  <option key={index} value={penyakit}>
                    {penyakit}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Tanggal Mulai</label>
              <DatePicker
                selected={startDate}
                onChange={date => setStartDate(date)}
                className="form-control"
                placeholderText="Pilih tanggal mulai"
                dateFormat="dd/MM/yyyy"
                maxDate={endDate || new Date()}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label fw-bold">Tanggal Akhir</label>
              <DatePicker
                selected={endDate}
                onChange={date => setEndDate(date)}
                className="form-control"
                placeholderText="Pilih tanggal akhir"
                dateFormat="dd/MM/yyyy"
                minDate={startDate}
                maxDate={new Date()}
              />
            </div>

            <div className="col-12">
              <button className="btn btn-outline-secondary me-2" onClick={resetFilter}>
                <i className="fas fa-redo me-2"></i>Reset Filter
              </button>
              <button className="btn btn-success" onClick={fetchData}>
                <i className="fas fa-sync me-2"></i>Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* STATISTIK UTAMA */}
      <div className="row mb-4">
        {/* PIE CHART - Distribusi Penyakit */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-white">Distribusi Penyakit</h5>
              <span className="badge bg-light text-primary">
                {chartData.length} Jenis Penyakit
              </span>
            </div>
            <div className="card-body">
              {chartData.length > 0 ? (
                <>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ penyakit, persentase }) => `${penyakit}: ${persentase}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="jumlah"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} kasus`, 'Jumlah']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-3">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Penyakit</th>
                          <th className="text-end">Jumlah</th>
                          <th className="text-end">Persentase</th>
                          <th>Lokasi Terbanyak</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chartData.slice(0, 5).map((item, index) => (
                          <tr key={index}>
                            <td>
                              <span className="badge" style={{ backgroundColor: COLORS[index % COLORS.length] }}>
                                {item.penyakit}
                              </span>
                            </td>
                            <td className="text-end fw-bold">{item.jumlah}</td>
                            <td className="text-end">{item.persentase}%</td>
                            <td>
                              <small className="text-muted">{item.lokasi}</small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-chart-pie fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Tidak ada data untuk ditampilkan</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BAR CHART - Distribusi per Lokasi */}
        <div className="col-lg-6 mb-4">
          <div className="card shadow-sm h-100 border-0">
            <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-white">Distribusi per Lokasi</h5>
              <span className="badge bg-light text-success">
                {distribusiData.length} Lokasi
              </span>
            </div>
            <div className="card-body">
              {distribusiData.length > 0 ? (
                <>
                  <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                      <BarChart data={distribusiData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="lokasi" angle={-45} textAnchor="end" height={60} />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} kasus`, 'Jumlah']} />
                        <Legend />
                        <Bar dataKey="jumlah" name="Jumlah Kasus" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-3">
                    <div className="row">
                      {distribusiData.slice(0, 4).map((item, index) => (
                        <div key={index} className="col-md-6 mb-2">
                          <div className="card border-0" style={{ backgroundColor: `${LOKASI_COLORS[index]}20` }}>
                            <div className="card-body p-3">
                              <h6 className="mb-1">{item.lokasi}</h6>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="badge bg-dark">{item.jumlah} kasus</span>
                                <span className="fw-bold">{item.persentase}%</span>
                              </div>
                              <small className="text-muted d-block mt-1">
                                Penyakit: {item.penyakit}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-map-marker-alt fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Tidak ada data lokasi</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LINE CHART - Trend Penyakit */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
              <h5 className="mb-0 text-white">Trend Penyakit (Berdasarkan Tanggal)</h5>
              <span className="badge bg-dark">
                {startDate ? startDate.toLocaleDateString('id-ID') : 'Semua Tanggal'} - 
                {endDate ? endDate.toLocaleDateString('id-ID') : 'Sekarang'}
              </span>
            </div>
            <div className="card-body">
              {chartData.length > 0 ? (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="penyakit" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} kasus`, 'Jumlah']} />
                      <Legend />
                      <Line type="monotone" dataKey="jumlah" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                  <p className="text-muted">Tidak ada data trend untuk ditampilkan</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TABLE DETAIL */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-info text-white">
              <h5 className="mb-0 text-white">Detail Data Statistik</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Penyakit</th>
                      <th>Jumlah Kasus</th>
                      <th>Persentase</th>
                      <th>Lokasi Terbanyak</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((item, index) => {
                      const persentase = parseFloat(item.persentase)
                      let statusBadge = ''
                      
                      if (persentase > 30) statusBadge = 'danger'
                      else if (persentase > 15) statusBadge = 'warning'
                      else if (persentase > 5) statusBadge = 'info'
                      else statusBadge = 'success'

                      return (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <span className="badge bg-primary">{item.penyakit}</span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress flex-grow-1 me-2" style={{ height: '10px' }}>
                                <div
                                  className={`progress-bar bg-${statusBadge}`}
                                  role="progressbar"
                                  style={{ width: `${persentase}%` }}
                                ></div>
                              </div>
                              <span className="fw-bold">{item.jumlah}</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge bg-${statusBadge}`}>
                              {item.persentase}%
                            </span>
                          </td>
                          <td>{item.lokasi}</td>
                          <td>
                            <span className={`badge bg-${statusBadge}`}>
                              {persentase > 30 ? 'Tinggi' : 
                               persentase > 15 ? 'Sedang' : 
                               persentase > 5 ? 'Rendah' : 'Sangat Rendah'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        .card {
          transition: transform 0.2s;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        .progress-bar {
          border-radius: 10px;
        }
        .badge {
          font-size: 0.75em;
        }
      `}</style>
    </div>
  )
}