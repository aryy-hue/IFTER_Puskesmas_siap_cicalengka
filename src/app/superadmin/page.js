'use client'

export default function SuperAdminDashboard() {
  return (
    <div>
      {/* HEADER */}
      <div className="mb-4">
        <h1 className="h3 text-success">Dashboard Super Admin</h1>
        <p className="text-muted">
          Ringkasan dan monitoring sistem informasi Puskesmas
        </p>
      </div>

      {/* SUMMARY CARD */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Pegawai</h6>
              <h3>42</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Dokter</h6>
              <h3>12</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Admin</h6>
              <h3>5</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Poli</h6>
              <h3>8</h3>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND ROW */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Laporan</h6>
              <h3>128</h3>
              <small className="text-muted">Seluruh laporan kegiatan</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Total Kegiatan</h6>
              <h3>76</h3>
              <small className="text-muted">Kegiatan terdaftar</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Pending Approval</h6>
              <h3 className="text-warning">9</h3>
              <small className="text-muted">
                Pegawai, laporan, dan kegiatan
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* INFO SYSTEM */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-success text-white">
          Informasi Sistem
        </div>
        <div className="card-body">
          <ul className="mb-0">
            <li>Sistem berjalan normal</li>
            <li>Tidak ada gangguan server</li>
            <li>Data terakhir diperbarui: 28 Desember 2025</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
