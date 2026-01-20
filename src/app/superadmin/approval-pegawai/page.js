'use client'

export default function ApprovalPegawaiPage() {
  return (
    <div>
      <h1 className="h4 mb-4">Approval Pegawai</h1>

      {/* FILTER */}
      <div className="card mb-3">
        <div className="card-body row g-2">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Cari nama / username"
            />
          </div>

          <div className="col-md-3">
            <select className="form-select">
              <option value="">Semua Role</option>
              <option>Dokter</option>
              <option>Admin</option>
            </select>
          </div>

          <div className="col-md-3">
            <select className="form-select">
              <option value="">Semua Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Ditolak</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm border-0">
        <div className="card-body table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-success">
              <tr>
                <th>Nama</th>
                <th>Username</th>
                <th>Role</th>
                <th>Tanggal Daftar</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Dr. Fauzan</td>
                <td>dokter_fauzan</td>
                <td>Dokter</td>
                <td>26-11-2025</td>
                <td>
                  <button className="btn btn-success btn-sm me-2">Approve</button>
                  <button className="btn btn-danger btn-sm">Tolak</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
