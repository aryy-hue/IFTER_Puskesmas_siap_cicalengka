'use client';
import { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import PetaInteraktif from '../../../components/PetaInteraktif';
import 'src/app/globals.css';
import 'leaflet/dist/leaflet.css';

export default function PetaPage() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="peta-page">
      <Header />
      
      <main>
        {isClient && <PetaInteraktif />}
      </main>

      <Footer />
    </div>
  );
}