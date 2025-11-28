'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
// HAPUS baris ini: import L from 'leaflet'; <--- INI PENYEBAB ERROR

// --- Dynamic Imports untuk Komponen Peta ---
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);

// Data Lokasi
const lokasiDesa = [
  { id: 1, nama: "Desa Cicalengka Kulon", lat: -6.984948, lng: 107.836521 },
  { id: 2, nama: "Desa Cicalengka Wetan", lat: -6.982268, lng: 107.831568 },
  { id: 3, nama: "Desa Babakan Peuteuy", lat: -6.992000, lng: 107.825000 },
  { id: 7, nama: "Puskesmas Cicalengka", lat: -6.986223, lng: 107.838588, isPuskesmas: true }
];

export default function PetaInteraktif() {
  const [selectedDesa, setSelectedDesa] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); 
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [apiKegiatan, setApiKegiatan] = useState([]);
  const [loading, setLoading] = useState(true);

  // STATE BARU: Menyimpan Library Leaflet (L)
  const [LeafletLib, setLeafletLib] = useState(null); 

  useEffect(() => {
    // 1. Load Data API
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/kegiatan');
        const data = await res.json();
        setApiKegiatan(data);
      } catch (error) {
        console.error("Gagal mengambil data kegiatan:", error);
      } finally {
        setLoading(false);
      }
    };

    // 2. Load Library Leaflet secara manual di Client Side
    // Ini mencegah error "window is not defined"
    import('leaflet').then((module) => {
      setLeafletLib(module.default);
    });

    fetchData();
  }, []);

  const getKegiatanByLokasi = (namaLokasi) => {
    // TAMBAHAN: Cek apakah apiKegiatan benar-benar sebuah Array?
    if (!Array.isArray(apiKegiatan)) {
      return []; // Jika bukan array, kembalikan array kosong agar tidak error
    }

    return apiKegiatan.filter(k => 
      k.lokasi && k.lokasi.toLowerCase().includes(namaLokasi.toLowerCase().replace('desa ', ''))
    );
  };

  const formatTanggal = (tanggal) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(tanggal).toLocaleDateString('id-ID', options);
  };

  // --- Custom Icon Logic (Diubah sedikit) ---
  const createCustomIcon = (isPuskesmas = false) => {
    // Cek apakah LeafletLib sudah terload. Jika belum, return null atau default
    if (!LeafletLib) return null; 

    return LeafletLib.divIcon({
      className: 'custom-icon-wrapper', 
      html: `
        <div style="
          background-color: ${isPuskesmas ? '#198754' : '#0d6efd'};
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          color: white;
        ">
          <i class="fas ${isPuskesmas ? 'fa-hospital' : 'fa-map-marker-alt'}" style="font-size: 18px;"></i>
        </div>
        <div style="
          width: 0; 
          height: 0; 
          border-left: 10px solid transparent;
          border-right: 10px solid transparent;
          border-top: 12px solid ${isPuskesmas ? '#198754' : '#0d6efd'};
          margin: -2px auto 0;
        "></div>
      `,
      iconSize: [40, 55],
      iconAnchor: [20, 55],
      popupAnchor: [0, -60]
    });
  };

  const handleMarkerClick = (desa) => {
    const kegiatanDiLokasi = getKegiatanByLokasi(desa.nama);
    setSelectedDesa({ ...desa, kegiatan: kegiatanDiLokasi });
    setModalType(desa.isPuskesmas ? 'puskesmas' : 'kegiatan');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDesa(null);
    setModalType('');
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  // Jika Leaflet belum siap, jangan render map dulu (tampilkan loading)
  if (!LeafletLib) {
     return <div className="text-center py-5">Memuat Peta...</div>;
  }

  return (
    <>
      <section id="peta-interaktif" className="py-4">
        {/* ... (Kode UI sama persis seperti sebelumnya) ... */}
        <div className="container-fluid px-md-5">
           {/* ... Bagian Header Card ... */}
            <div className="card shadow border-0 overflow-hidden">
             {/* ... */}
            <div className="card-body p-0 position-relative">
              <div style={{ height: isFullscreen ? '90vh' : '500px', width: '100%', transition: 'height 0.3s ease' }}>
                <MapContainer
                  center={[-6.986, 107.841]}
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                  
                  {lokasiDesa.map((desa) => {
                     const jumlahKegiatan = getKegiatanByLokasi(desa.nama).length;
                     // PENTING: Panggil createCustomIcon di sini
                     const icon = createCustomIcon(desa.isPuskesmas);
                     
                     // Jika icon belum siap (karena L belum load), jangan render marker dulu
                     if(!icon) return null;

                     return (
                        <Marker
                          key={desa.id}
                          position={[desa.lat, desa.lng]}
                          icon={icon}
                          eventHandlers={{
                            click: () => handleMarkerClick(desa),
                          }}
                        >
                          <Popup>
                            {/* ... Isi Popup sama seperti sebelumnya ... */}
                            <div className="text-center p-2">
                               <h6>{desa.nama}</h6>
                               <button 
                                className="btn btn-sm btn-success w-100 mt-1"
                                onClick={() => handleMarkerClick(desa)}
                              >
                                Detail
                              </button>
                            </div>
                          </Popup>
                        </Marker>
                     )
                  })}
                </MapContainer>
              </div>
              {/* ... Loading Overlay ... */}
            </div>
          </div>
        </div>
      </section>

      {/* ... MODAL CODE (Sama Persis) ... */}
      {showModal && selectedDesa && (
        <div className="modal-backdrop show" style={{opacity: 0.5}}></div>
      )}
      
      {showModal && selectedDesa && (
         <div className="modal show d-block" tabIndex="-1" role="dialog">
             <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                 <div className="modal-content border-0 shadow-lg">
                     <div className="modal-header bg-success text-white">
                         <h5 className="modal-title">{selectedDesa.nama}</h5>
                         <button type="button" className="btn-close btn-close-white" onClick={closeModal}></button>
                     </div>
                     <div className="modal-body">
                         {/* Isi modal disederhanakan untuk contoh, pakai kode modal lengkap Anda sebelumnya */}
                         <p>Isi Modal...</p>
                     </div>
                 </div>
             </div>
         </div>
      )}
    </>
  );
}
