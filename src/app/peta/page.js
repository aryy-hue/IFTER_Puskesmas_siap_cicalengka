import Header from '../../../components/Header'
import Footer from '../../../components/Footer'

export default function PetaPage() {
  return (
    <>
      <Header />
      <main className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="section-title">Peta Interaktif</h1>
            <p className="section-subtitle">Lihat kegiatan dan layanan puskesmas di peta</p>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="card">
                <div className="card-body text-center p-5">
                  <i className="fas fa-map-marked-alt fa-4x text-success mb-3"></i>
                  <h4>Peta Interaktif</h4>
                  <p className="text-muted">Fitur peta interaktif akan segera hadir</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
