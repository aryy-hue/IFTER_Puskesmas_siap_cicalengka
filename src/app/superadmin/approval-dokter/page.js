'use client'

import { useState, useEffect } from 'react'

export default function ApprovalDokterPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingId, setProcessingId] = useState(null)

  // 1. Fetch Data dari Backend
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Token tidak ditemukan')

      // PERUBAHAN 1: URL Endpoint & Port 5001
      const res = await fetch('http://localhost:5001/api/superadmin/role-approvals', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!res.ok) throw new Error('Gagal mengambil data atau Anda bukan Superadmin')

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
  const handleAction = async (approvalId, actionType) => {
    const isApprove = actionType === 'approve'
    const textIndo = isApprove ? 'menyetujui' : 'menolak'
    
    if(!confirm(`Yakin ingin ${textIndo} permintaan ini?`)) return;

    setProcessingId(approvalId)
    
    try {
      const token = localStorage.getItem('token')
      
      // PERUBAHAN 2: Mapping status agar sesuai Enum Database ('disetujui' / 'ditolak')
      const statusBackend = isApprove ? 'disetujui' : 'ditolak'

      // PERUBAHAN 3: URL Endpoint Update
      const res = await fetch(`http://localhost:5001/api/superadmin/approve-role/${approvalId}`, {
        method: 'PUT', // Backend menggunakan PUT
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          status: statusBackend,
          alasan: isApprove ? 'Disetujui oleh Admin' : 'Data tidak sesuai' // Opsional
        })
      })

      const result = await res.json()

      if (!res.ok) throw new Error(result.message || 'Gagal memproses')

      alert(`Berhasil: ${result.message}`)
      
      // Refresh list: Hapus item yang sudah diproses dari state agar tidak perlu fetch ulang
      setRequests(prev => prev.filter(item => item.id !== approvalId))

    } catch (err) {
      alert(err.message)
    } finally {
      setProcessingId(null)
    }
  }

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
  if (error) return <div className="alert alert-danger m-4">Error: {error}</div>

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 text-success">Verifikasi Dokter</h1>
          <p className="text-muted">Daftar permintaan role dokter yang menunggu persetujuan</p>
        </div>
        <button className="btn btn-outline-secondary" onClick={() => { setLoading(true); fetchRequests(); }}>
          <i className="fas fa-sync-alt me-1"></i> Refresh
        </button>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Pemohon</th>
                  <th>Username</th>
                  <th>Role Diminta</th>
                  <th>Tanggal Request</th>
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
                        <div className="d-flex align-items-center">
                           {/* Placeholder Avatar */}
                          <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: 40, height: 40}}>
                            {req.full_name ? req.full_name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <div className="fw-bold">{req.full_name}</div>
                            <small className="text-muted">ID User: {req.user_id}</small>
                          </div>
                        </div>
                      </td>
                      <td>@{req.username}</td>
                      <td>
                        <span className="badge bg-info text-dark">
                          {req.role_baru || 'dokter'}
                        </span>
                      </td>
                      <td>
                        {/* Handling tanggal jika null */}
                        {req.tanggal ? new Date(req.tanggal).toLocaleDateString('id-ID') : '-'}
                      </td>
                      <td className="text-end pe-4">
                        <button 
                          className="btn btn-success btn-sm me-2"
                          onClick={() => handleAction(req.id, 'approve')}
                          disabled={processingId === req.id}
                        >
                          {processingId === req.id ? '...' : <><i className="fas fa-check me-1"></i> Terima</>}
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleAction(req.id, 'reject')}
                          disabled={processingId === req.id}
                        >
                          <i className="fas fa-times me-1"></i> Tolak
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