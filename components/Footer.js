export default function Footer() {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-6 mb-3 mb-md-0">
            <div className="d-flex align-items-center mb-3">
              <div className="logo-container me-3">
                <i className="fas fa-heartbeat logo-icon"></i>
              </div>
              <div>
                <h5 className="mb-0">SIAPCicalengka</h5>
                <small className="text-light">Puskesmas Cicalengka</small>
              </div>
            </div>
            <p>Melayani dengan hati untuk kesehatan masyarakat.</p>
            <div className="social-links">
              <a href="#" className="text-white me-3"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-white me-3"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-white"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          <div className="col-md-3 mb-3 mb-md-0">
            <h5>Menu Cepat</h5>
            <ul className="list-unstyled">
              <li><a href="#dokter" className="text-white text-decoration-none">Dokter Hari Ini</a></li>
              <li><a href="#kontak" className="text-white text-decoration-none">Kontak</a></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Layanan</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-white text-decoration-none">Poli Umum</a></li>
              <li><a href="#" className="text-white text-decoration-none">Poli Anak</a></li>
              <li><a href="#" className="text-white text-decoration-none">Poli Gigi</a></li>
              <li><a href="#" className="text-white text-decoration-none">UGD</a></li>
            </ul>
          </div>
        </div>
        <hr className="my-4" />
        <div className="text-center">
          <p className="mb-0">&copy; 2023 SIAPCicalengka - Puskesmas Cicalengka. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
