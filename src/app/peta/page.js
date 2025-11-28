'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import PetaInteraktif from '../../../components/PetaInteraktif';
// import 'src/app/globals.css'; // Biasanya globals.css sudah diimport di layout.js, jadi ini opsional
import 'leaflet/dist/leaflet.css';

export default function PetaPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header />
      
      <main className="flex-grow-1 bg-light py-5">
        <div className="container">
            <div className="row mb-4">
                <div className="col-12 text-center">
                    <h2 className="text-success fw-bold">Peta Persebaran Kesehatan</h2>
                    <p className="text-muted">Lokasi fasilitas kesehatan dan kegiatan di Cicalengka</p>
                </div>
            </div>

            <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                    <div className="card shadow-sm border-0 overflow-hidden">
                        <div className="card-body p-0">
                            {/* Render Peta hanya jika di sisi Client (Browser) */}
                            {isClient ? (
                                <PetaInteraktif />
                            ) : (
                                <div className="d-flex justify-content-center align-items-center" style={{height: '500px'}}>
                                    <p>Memuat Peta...</p>
                                </div>
                            )}
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
