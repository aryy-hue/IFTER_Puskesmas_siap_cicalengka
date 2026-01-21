'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// ==========================
// Dynamic Imports (WAJIB)
// ==========================
const MapContainer = dynamic(
  () => import('react-leaflet').then((m) => m.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import('react-leaflet').then((m) => m.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import('react-leaflet').then((m) => m.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import('react-leaflet').then((m) => m.Popup),
  { ssr: false }
);

// ==========================
// COMPONENT
// ==========================
export default function PetaInteraktif() {
  // ==========================
  // STATE
  // ==========================
  const [lokasiDesa, setLokasiDesa] = useState([]);
  const [LeafletLib, setLeafletLib] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedDesa, setSelectedDesa] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [tabAktif, setTabAktif] = useState('akan-datang');
  const [kegiatanAkanDatang, setKegiatanAkanDatang] = useState([]);
  const [kegiatanSelesai, setKegiatanSelesai] = useState([]);

  const [selectedAkanDatang, setSelectedAkanDatang] = useState(null);
  const [selectedSelesai, setSelectedSelesai] = useState(null);



  // ==========================
  // LOAD LEAFLET + FETCH DATA
  // ==========================
  useEffect(() => {
    let mounted = true;

    import('leaflet').then((L) => {
      if (mounted) setLeafletLib(L);
    });

    const fetchLokasi = async () => {
      try {
        const res = await fetch('http://localhost:5001/api/lokasi');
        if (!res.ok) throw new Error('Gagal fetch lokasi');

        const data = await res.json();

        const formatted = data.map((item) => ({
          id: item.id,
          nama: item.nama_lokasi,
          lat: Number(item.latitude),
          lng: Number(item.longitude),
          isPuskesmas: item.is_puskesmas === 1
        }));

        setLokasiDesa(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLokasi();

    return () => {
      mounted = false;
    };
  }, []);

  // ==========================
  // ICONS (PAKAI useMemo)
  // ==========================
  const iconDesa = useMemo(() => {
    if (!LeafletLib) return null;

    return LeafletLib.divIcon({
      className: '',
      html: `
        <div style="
          background:#0d6efd;
          width:36px;
          height:36px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:18px;
          border:3px solid white;
          box-shadow:0 4px 6px rgba(0,0,0,.3);
        ">📍</div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });
  }, [LeafletLib]);

  const iconPuskesmas = useMemo(() => {
    if (!LeafletLib) return null;

    return LeafletLib.divIcon({
      className: '',
      html: `
        <div style="
          background:#198754;
          width:36px;
          height:36px;
          border-radius:50%;
          display:flex;
          align-items:center;
          justify-content:center;
          color:white;
          font-size:18px;
          border:3px solid white;
          box-shadow:0 4px 6px rgba(0,0,0,.3);
        ">🏥</div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });
  }, [LeafletLib]);

  // ==========================
  // HANDLER
  // ==========================
  const handleMarkerClick = async (desa) => {
    setSelectedDesa(desa);
    setShowModal(true);
    setTabAktif('akan-datang');

    try {
      const resAkan = await fetch(
        `http://localhost:5001/api/peta/kegiatan/${desa.id}/akan-datang`
      );
      const resSelesai = await fetch(
        `http://localhost:5001/api/peta/kegiatan/${desa.id}/selesai`
      );

      setKegiatanAkanDatang(await resAkan.json());
      setKegiatanSelesai(await resSelesai.json());
    } catch (err) {
      console.error(err);
    }
  };


  const closeModal = () => {
    setShowModal(false);
    setSelectedDesa(null);
  };

  // ==========================
  // LOADING
  // ==========================
  if (loading || !LeafletLib) {
    return <div className="text-center py-5">Memuat peta…</div>;
  }

  // ==========================
  // RENDER
  // ==========================
  return (
    <>
      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer
          center={[-6.986, 107.841]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {lokasiDesa
            .filter((d) => !isNaN(d.lat) && !isNaN(d.lng))
            .map((desa) => (
              <Marker
                key={desa.id}
                position={[desa.lat, desa.lng]}
                icon={desa.isPuskesmas ? iconPuskesmas : iconDesa}
                eventHandlers={{
                  click: () => handleMarkerClick(desa)
                }}
              >
                <Popup>
                  <strong>{desa.nama}</strong>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {/* MODAL */}
      {showModal && selectedDesa && (
        <>
          <div className="modal-backdrop show" style={{ opacity: 0.5 }}></div>

          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 shadow">

                {/* HEADER */}
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    📍 {selectedDesa.nama}
                  </h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={closeModal}
                  />
                </div>

                {/* TABS */}
                <div className="modal-body">
                  <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                      <button
                        className={`nav-link ${tabAktif === 'akan-datang' ? 'active' : ''}`}
                        onClick={() => setTabAktif('akan-datang')}
                      >
                        🗓️ Akan Datang
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link ${tabAktif === 'selesai' ? 'active' : ''}`}
                        onClick={() => setTabAktif('selesai')}
                      >
                        ✅ Selesai
                      </button>
                    </li>
                  </ul>

                  {/* TAB CONTENT */}
                  {tabAktif === 'akan-datang' && (
                    <>
                      {kegiatanAkanDatang.length === 0 ? (
                        <p className="text-muted text-center">
                          Tidak ada kegiatan yang akan datang.
                        </p>
                      ) : (
                        kegiatanAkanDatang.map((item) => (
                          <div key={item.id} className="card mb-2 shadow-sm">
                            <div className="card-body">
                              <h6 className="fw-bold">{item.judul}</h6>
                              <small className="text-muted">
                                📅 {item.tanggal} | ⏰ {item.jam_mulai} - {item.jam_selesai}
                              </small>
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  )}

                  {tabAktif === 'selesai' && (
                    <>
                      {kegiatanSelesai.length === 0 ? (
                        <p className="text-muted text-center">
                          Belum ada laporan kegiatan.
                        </p>
                      ) : (
                        kegiatanSelesai.map((item) => (
                          <div key={item.id} className="card mb-2 shadow-sm border-success">
                            <div className="card-body">
                              <h6 className="fw-bold">{item.judul_laporan}</h6>
                              <small className="text-muted">
                                📅 {item.tanggal}
                              </small>
                            </div>
                          </div>
                        ))
                      )}
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
