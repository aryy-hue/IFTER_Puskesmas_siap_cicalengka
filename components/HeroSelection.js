export default function HeroSection() {
  return (
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
                src="/puskesmas.jpg" 
                alt="Puskesmas Cicalengka" 
                className="img-fluid rounded shadow-lg"
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
  )
}
