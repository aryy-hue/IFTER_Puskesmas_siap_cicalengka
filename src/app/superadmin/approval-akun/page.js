'use client'

import { useState, useEffect } from 'react'

export default function ApprovalDokterPage() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingId, setProcessingId] = useState(null)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.')
    }
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const headers = getAuthHeaders()
      const response = await fetch(`${API_BASE_URL}/api/superadmin/role-approvals`, {
        headers
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || errorData.error || `Error ${response.status}`)
      }

      const data = await response.json()
      setRequests(Array.isArray(data) ? data : [])
      
    } catch (err) {
      console.error('❌ Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (approvalId, action) => {
    const actionText = action === 'approve' ? 'menyetujui' : 'menolak'
    const isConfirmed = window.confirm(`Apakah Anda yakin ingin ${actionText} permintaan ini?`)
    
    if (!isConfirmed) return

    setProcessingId(approvalId)
    
    try {
      const headers = getAuthHeaders()
      let requestBody = { action }
      
      if (action === 'reject') {
        const alasan = prompt('Masukkan alasan penolakan:')?.trim()
        if (!alasan) {
          alert('Alasan penolakan harus diisi.')
          return
        }
        requestBody.alasan = alasan
      }

      const response = await fetch(
        `${API_BASE_URL}/api/superadmin/approve-role/${approvalId}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(requestBody)
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Terjadi kesalahan')
      }

      if (result.success) {
        alert(result.message)
        await fetchRequests()
      } else {
        throw new Error(result.message || 'Aksi gagal')
      }

    } catch (err) {
      alert(`Gagal: ${err.message}`)
    } finally {
      setProcessingId(null)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50 py-5">
        <div className="text-center">
          <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted fs-5">Memuat data permintaan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 fw-bold text-success mb-2">Permintaan Verifikasi Dokter</h1>
          <p className="text-muted mb-0">
            {requests.length > 0 
              ? `${requests.length} permintaan menunggu verifikasi` 
              : 'Tidak ada permintaan yang menunggu'}
          </p>
        </div>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-light border d-flex align-items-center"
            onClick={fetchRequests}
            disabled={loading}
          >
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''} me-2`}></i>
            Refresh
          </button>
          <div className="vr"></div>
          <div className="d-flex flex-column">
            <small className="text-muted">Total Permintaan</small>
            <span className="badge bg-success rounded-pill">{requests.length}</span>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
          <div className="d-flex align-items-center">
            <i className="fas fa-exclamation-circle me-2"></i>
            <div>
              <strong>Terjadi Kesalahan!</strong>
              <div className="small">{error}</div>
            </div>
          </div>
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Main Card */}
      <div className="card border-0 shadow-lg rounded-3 overflow-hidden">
        <div className="card-header bg-white py-3 border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-semibold text-white ">
              <i className="fas fa-list-check text-success me-2 text-white"></i>
              Daftar Permintaan
            </h5>
            <span className="badge bg-light text-dark border">
              {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
        
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-light bg-gradient">
                <tr>
                  <th className="ps-4 py-3 border-0" width="50">No</th>
                  <th className="py-3 border-0">Pengguna</th>
                  <th className="py-3 border-0">Tanggal Request</th>
                  <th className="py-3 border-0">Role Diminta</th>
                  <th className="py-3 border-0 text-center" width="200">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <div className="py-5">
                        <i className="fas fa-check-circle fa-4x text-success mb-4 opacity-50"></i>
                        <h4 className="text-muted mb-2">Tidak Ada Permintaan</h4>
                        <p className="text-muted mb-4">
                          Semua permintaan verifikasi dokter sudah diproses
                        </p>
                        <button 
                          className="btn btn-outline-success"
                          onClick={fetchRequests}
                        >
                          <i className="fas fa-sync-alt me-2"></i>
                          Periksa Kembali
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  requests.map((req, index) => (
                    <tr key={req.id} className="border-bottom">
                      <td className="ps-4 align-middle">
                        <span className="text-muted fw-semibold">{index + 1}</span>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <div className="position-relative me-3">
                            <img 
                              src={req.img || '/default-avatar.jpg'} 
                              alt={req.full_name}
                              className="rounded-circle border"
                              width="48"
                              height="48"
                              style={{ objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(req.full_name || req.username) + '&background=random'
                              }}
                            />
                            {req.status === 'menunggu' && (
                              <span className="position-absolute bottom-0 end-0 bg-warning border border-white rounded-circle" 
                                style={{ width: '12px', height: '12px' }}></span>
                            )}
                          </div>
                          <div>
                            <h6 className="mb-0 fw-semibold">{req.full_name || 'Nama tidak tersedia'}</h6>
                            <div className="d-flex align-items-center gap-2">
                              <small className="text-muted">@{req.username}</small>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">
                        {req.tanggal ? (
                          <div>
                            <div className="fw-medium">
                              {new Date(req.tanggal).toLocaleDateString('id-ID', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                            <small className="text-muted">
                              {new Date(req.tanggal).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </small>
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="align-middle">
                        <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2 rounded-pill">
                          <i className="fas fa-user-md me-2"></i>
                          {req.role_baru || req.role_diminta || 'Dokter'}
                        </span>
                      </td>
                      <td className="align-middle text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            className="btn btn-success px-3 py-2 d-flex align-items-center justify-content-center"
                            style={{ minWidth: '100px' }}
                            onClick={() => handleAction(req.id, 'approve')}
                            disabled={processingId === req.id}
                          >
                            {processingId === req.id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Memproses...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-check me-2"></i>
                                Setujui
                              </>
                            )}
                          </button>
                          <button
                            className="btn btn-outline-danger px-3 py-2 d-flex align-items-center justify-content-center"
                            style={{ minWidth: '100px' }}
                            onClick={() => handleAction(req.id, 'reject')}
                            disabled={processingId === req.id}
                          >
                            <i className="fas fa-times me-2"></i>
                            Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Card Footer */}
        {requests.length > 0 && (
          <div className="card-footer bg-white py-3 border-top">
            <div className="d-flex justify-content-between align-items-center">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Klik tombol "Setujui" atau "Tolak" untuk memproses permintaan
              </small>
              <small className="text-muted">
                Terakhir diperbarui: {new Date().toLocaleTimeString('id-ID')}
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}