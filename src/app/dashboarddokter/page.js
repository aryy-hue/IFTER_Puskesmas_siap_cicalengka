'use client'

import { useState, useEffect } from 'react'
import '../globals.css'

export default function DokterPage() {
  const [userData, setUserData] = useState({ full_name: 'Memuat...' })
  const [schedules, setSchedules] = useState([])

  const [statusKehadiran, setStatusKehadiran] = useState({
    text: 'Memuat...',
    time: 'Menghubungkan ke server...',
    buttonText: 'Tunggu',
    buttonClass: 'btn btn-secondary',
    disabled: true
  })

  const [alert, setAlert] = useState({
    show: false,
    msg: '',
    type: 'success'
  })

  // ================= REFRESH DATA =================
  const refreshData = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      // ===== PROFILE =====
      const resProfile = await fetch(
        'http://localhost:5001/api/auth/profile',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (resProfile.ok) {
        const data = await resProfile.json()
        setUserData({ full_name: data.full_name })
      }

      // ===== JADWAL =====
      const resSchedule = await fetch(
        'http://localhost:5001/api/dokter/my-schedule',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      if (resSchedule.ok) {
        const data = await resSchedule.json()
        setSchedules(data)
      }

      // ===== STATUS KEHADIRAN =====
      const resStatus = await fetch(
        'http://localhost:5001/api/dokter/current-status',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )

      const statusData = await resStatus.json()

      if (statusData.status === 'Aktif') {
        setStatusKehadiran({
          text: 'Tersedia',
          time: `Anda sedang aktif hingga jam ${statusData.jam_selesai.substring(0, 5)}`,
          buttonText: 'Sudah Aktif',
          buttonClass: 'btn btn-outline-success btn-lg px-4',
          disabled: true
        })
      } else if (statusData.status === 'Belum Waktunya') {
        setStatusKehadiran({
          text: 'Belum Jam Praktek',
          time: statusData.message,
          buttonText: 'Belum Bisa Absen',
          buttonClass: 'btn btn-secondary btn-lg px-4',
          disabled: true
        })
      } else if (
        statusData.status === 'Selesai' ||
        statusData.status === 'Libur' ||
        statusData.status === 'Tidak Aktif'
      ) {
        setStatusKehadiran({
          text: 'Praktek Tutup',
          time: statusData.message || 'Jadwal praktek telah berakhir.',
          buttonText: 'Praktek Tutup',
          buttonClass: 'btn btn-secondary btn-lg px-4',
          disabled: true
        })
      } else {
        setStatusKehadiran({
          text: 'Siap Melayani',
          time: 'Silakan klik tombol jika Anda sudah sampai di puskesmas.',
          buttonText: 'Saya Sudah Sampai',
          buttonClass: 'btn btn-success btn-lg px-4',
          disabled: false
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  // ================= AUTO REFRESH =================
  useEffect(() => {
    refreshData()
    const interval = setInterval(refreshData, 10000)
    return () => clearInterval(interval)
  }, [])

  // ================= UPDATE STATUS =================
  const handleUpdateStatus = async () => {
    const token = localStorage.getItem('token')

    try {
      const res = await fetch(
        'http://localhost:5001/api/dokter/status',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'Aktif' })
        }
      )

      const data = await res.json()

      if (res.ok) {
        setAlert({
          show: true,
          msg: 'Status berhasil diaktifkan!',
          type: 'success'
        })
        refreshData()
      } else {
        setAlert({
          show: true,
          msg: data.message,
          type: 'danger'
        })
      }

      setTimeout(
        () => setAlert(prev => ({ ...prev, show: false })),
        5000
      )
    } catch {
      setAlert({
        show: true,
        msg: 'Terjadi kesalahan koneksi.',
        type: 'danger'
      })
    }
  }

  // ================= RENDER =================
  return (
    <>
      {/* ALERT */}
      {alert.show && (
        <div
          className={`alert alert-${alert.type} position-fixed`}
          style={{
            top: '100px',
            right: '20px',
            zIndex: 1050,
            minWidth: '300px'
          }}
        >
          <i
            className={`fas fa-${
              alert.type === 'success'
                ? 'check-circle'
                : 'exclamation-triangle'
            } me-2`}
          />
          {alert.msg}
        </div>
      )}

      {/* HEADER */}
      <div className="card border-0 shadow-sm mb-5 p-4">
        <h2 className="text-success fw-bold">
          Selamat Datang, {userData.full_name}!
        </h2>
        <p className="text-muted mb-0">
          Status dashboard Anda akan diperbarui otomatis sesuai waktu server.
        </p>
      </div>

      {/* STATUS CARD */}
      <div className="card border-0 shadow-sm mb-5">
        <div className="card-header bg-success text-white py-3">
          <h5 className="mb-0 fw-bold">
            <i className="fas fa-clock me-2" />
            Status Kehadiran Hari Ini
          </h5>
        </div>

        <div className="card-body p-4 d-flex justify-content-between align-items-center">
          <div>
            <h3 className="fw-bold">{statusKehadiran.text}</h3>
            <p className="text-muted mb-0">{statusKehadiran.time}</p>
          </div>

          <button
            className={statusKehadiran.buttonClass}
            disabled={statusKehadiran.disabled}
            onClick={handleUpdateStatus}
          >
            <i className="fas fa-check-circle me-2" />
            {statusKehadiran.buttonText}
          </button>
        </div>
      </div>

      {/* TABLE JADWAL */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-success text-white py-3">
          <h5 className="mb-0 fw-bold">
            <i className="fas fa-calendar-alt me-2" />
            Jadwal Praktek Saya
          </h5>
        </div>

        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  <th>Hari</th>
                  <th>Waktu</th>
                  <th>Poliklinik</th>
                  <th>Status Database</th>
                </tr>
              </thead>
              <tbody>
                {schedules.map((s, i) => (
                  <tr key={i}>
                    <td className="fw-bold">{s.hari}</td>
                    <td>
                      {s.jam_mulai.substring(0, 5)} -{' '}
                      {s.jam_selesai.substring(0, 5)}
                    </td>
                    <td>{s.nama_poli}</td>
                    <td>
                      <span
                        className={`badge rounded-pill px-3 py-2 ${
                          s.status === 'Aktif'
                            ? 'bg-success'
                            : 'bg-secondary'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}