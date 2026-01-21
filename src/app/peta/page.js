'use client';

import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import PetaInteraktif from '../../../components/PetaInteraktif';
import 'leaflet/dist/leaflet.css';

export default function PetaPage() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />

      <main className="flex-grow-1 bg-light py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="text-success fw-bold">
                Peta Persebaran Kesehatan
              </h2>
              <p className="text-muted">
                Lokasi fasilitas kesehatan dan kegiatan di Cicalengka
              </p>
            </div>
          </div>

          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <div className="card shadow-sm border-0 overflow-hidden">
                <div className="card-body p-0">
                  {/* Peta sudah aman dari SSR, tidak perlu isClient */}
                  <PetaInteraktif />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
