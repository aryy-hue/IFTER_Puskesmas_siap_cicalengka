'use client'

import { useState, useEffect } from 'react'

export default function ApprovalDokterPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingId, setProcessingId] = useState(null) // Untuk loading tombol

  // 1. Fetch Data dari Backend
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token tidak ditemukan')

      const res = await fetch('http://localhost:5000/api/admin/approvals/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error('Gagal mengambil data')

      const data = await res.json()
      setRequests(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  // 2. Fungsi Approve/Reject
  const handleAction = async (approvalId, action) => {
    if(!confirm(`Yakin ingin ${action === 'approve' ? 'menyetujui' : 'menolak'} dokter ini?`)) return;

    setProcessingId(approvalId)
    
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000/api/admin/approvals/${approvalId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.message)

      alert(result.message)
      // Refresh list setelah aksi sukses
      fetchRequests() 

    } catch (err) {
      alert(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
  if (error) return <div className="alert alert-danger m-4">{error}</div>

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 text-success">Verifikasi Dokter</h1>
          <p className="text-muted">Daftar dokter baru yang menunggu persetujuan</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={fetchRequests}>
          <i className="fas fa-sync-alt me-1"></i> Refresh
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Foto</th>
                  <th>Nama Lengkap</th>
                  <th>Username</th>
                  <th>Tanggal Daftar</th>
                  <th className="text-end pe-4">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <i className="fas fa-check-circle fa-3x mb-3 text-success opacity-50"></i>
                      <p className="mb-0">Tidak ada permintaan pending saat ini.</p>
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr key={req.id}>
                      <td className="ps-4">
                        <img 
                          src={req.img || '/img/default-avatar.png'} 
                          alt="Avatar" 
                          className="rounded-circle border"
                          width="45" height="45"
                          style={{objectFit: 'cover'}}
                        />
                      </td>
                      <td className="fw-bold">{req.full_name}</td>
                      <td className="text-muted">@{req.username}</td>
                      <td>{new Date(req.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                      <td className="text-end pe-4">
                        <button 
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleAction(req.id, 'approve')}
                          disabled={processingId === req.id}
                        >
                          {processingId === req.id ? '...' : <><i className="fas fa-check me-1"></i>Setuju</>}
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleAction(req.id, 'reject')}
                          disabled={processingId === req.id}
                        >
                          <i className="fas fa-times me-1"></i>Tolak
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}