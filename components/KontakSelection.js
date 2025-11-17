export default function KontakSelection() {
  return (
    <section id="kontak" className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Hubungi Kami</h2>
          <p className="section-subtitle">Kami siap melayani kebutuhan kesehatan Anda</p>
        </div>
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card h-100 contact-card animate-slide-up">
              <div className="card-body text-center">
                <i className="fas fa-map-marker-alt fa-2x text-success mb-3"></i>
                <h5>Alamat</h5>
                <p>Jl. Raya Cicalengka No. 123, Kec. Cicalengka, Kab. Bandung, Jawa Barat 40395</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card h-100 contact-card animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="card-body text-center">
                <i className="fas fa-phone fa-2x text-success mb-3"></i>
                <h5>Telepon</h5>
                <p>(022) 1234567</p>
                <p>081234567890 (WhatsApp)</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card h-100 contact-card animate-slide-up" style={{animationDelay: '0.2s'}}>
              <div className="card-body text-center">
                <i className="fas fa-envelope fa-2x text-success mb-3"></i>
                <h5>Email</h5>
                <p>puskesmas.cicalengka@email.com</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card h-100 contact-card animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="card-body text-center">
                <i className="fas fa-clock fa-2x text-success mb-3"></i>
                <h5>Jam Operasional</h5>
                <p>Senin - Jumat: 07.00 - 16.00</p>
                <p>Sabtu: 07.00 - 14.00</p>
                <p>UGD: 24 Jam</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}