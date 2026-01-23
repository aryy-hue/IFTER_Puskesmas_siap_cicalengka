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
  const [loadingKegiatan, setLoadingKegiatan] = useState({
    akanDatang: false,
    selesai: false
  });
  const [errorKegiatan, setErrorKegiatan] = useState(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedLaporan, setSelectedLaporan] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({ total_reviews: 0, average_rating: 0 });
  const [reviewForm, setReviewForm] = useState({ pesan: '', rating: 5 });
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [user, setUser] = useState(null); // Untuk cek login
  const [userReview, setUserReview] = useState(null); // Review user saat ini

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

    // Cek status login
    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Decode token untuk mendapatkan user info
          const payload = JSON.parse(atob(token.split('.')[1]));
          setUser(payload);
        } catch (err) {
          console.error('Error decoding token:', err);
        }
      }
    };

    fetchLokasi();
    checkLoginStatus();

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
  // REVIEW FUNCTIONS
  // ==========================

  // Fungsi untuk membuka modal review
  const openReviewModal = async (laporanId) => {
    setSelectedLaporan(laporanId);
    setShowReviewModal(true);
    await loadReviews(laporanId);
  };

  // Fungsi untuk load reviews
  const loadReviews = async (laporanId) => {
    try {
      setLoadingReviews(true);
      const token = localStorage.getItem('token');
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const res = await fetch(
        `http://localhost:5001/api/laporan/${laporanId}/reviews`,
        {
          headers
        }
      );
      
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setReviewStats(data.stats || { total_reviews: 0, average_rating: 0 });
        
        // Cari review user saat ini
        if (user) {
          const currentUserReview = data.reviews?.find(review => review.user_id === user.id);
          setUserReview(currentUserReview);
          if (currentUserReview) {
            setReviewForm({
              pesan: currentUserReview.pesan || '',
              rating: currentUserReview.rating || 5
            });
          } else {
            setReviewForm({ pesan: '', rating: 5 });
          }
        }
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Fungsi untuk submit review
  const submitReview = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Silakan login terlebih dahulu!');
        return;
      }
      
      if (!reviewForm.pesan.trim()) {
        alert('Silakan isi komentar terlebih dahulu!');
        return;
      }
      
      const method = userReview ? 'PUT' : 'POST';
      const endpoint = userReview 
        ? `http://localhost:5001/api/review/${userReview.id}`
        : `http://localhost:5001/api/laporan/${selectedLaporan}/review`;
      
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewForm)
      });
      
      if (res.ok) {
        const result = await res.json();
        alert(userReview ? 'Review berhasil diperbarui!' : 'Review berhasil ditambahkan!');
        
        // Reload reviews
        await loadReviews(selectedLaporan);
        
        if (!userReview) {
          setReviewForm({ pesan: '', rating: 5 });
        }
      } else {
        const error = await res.json();
        alert(`Gagal: ${error.message}`);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Gagal mengirim review');
    }
  };

  // Fungsi untuk delete review
  const deleteReview = async () => {
    if (!userReview) return;
    
    if (!confirm('Apakah Anda yakin ingin menghapus review ini?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const res = await fetch(
        `http://localhost:5001/api/review/${userReview.id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (res.ok) {
        alert('Review berhasil dihapus!');
        setUserReview(null);
        setReviewForm({ pesan: '', rating: 5 });
        await loadReviews(selectedLaporan);
      } else {
        const error = await res.json();
        alert(`Gagal: ${error.message}`);
      }
    } catch (err) {
      console.error('Error deleting review:', err);
      alert('Gagal menghapus review');
    }
  };

  // Komponen Rating Stars
  const RatingStars = ({ rating, onRate, readonly = false }) => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`btn btn-sm ${star <= rating ? 'text-warning' : 'text-secondary'}`}
            onClick={() => !readonly && onRate && onRate(star)}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '1.5rem',
              cursor: readonly ? 'default' : 'pointer'
            }}
            disabled={readonly}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  // Format tanggal review
  const formatReviewDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 60) {
        return `${diffMins} menit yang lalu`;
      } else if (diffHours < 24) {
        return `${diffHours} jam yang lalu`;
      } else if (diffDays < 7) {
        return `${diffDays} hari yang lalu`;
      } else {
        return date.toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      }
    } catch {
      return dateString;
    }
  };

  // ==========================
  // HANDLER FUNCTIONS
  // ==========================
  const handleMarkerClick = async (desa) => {
    console.log('Marker clicked:', desa);
    setSelectedDesa(desa);
    setShowModal(true);
    setTabAktif('akan-datang');
    setErrorKegiatan(null);

    // Reset data sebelumnya
    setKegiatanAkanDatang([]);
    setKegiatanSelesai([]);

    // Load data kegiatan akan datang
    await loadKegiatanAkanDatang(desa.id);
  };

  const loadKegiatanAkanDatang = async (lokasiId) => {
    try {
      setLoadingKegiatan(prev => ({ ...prev, akanDatang: true }));
      setErrorKegiatan(null);
      
      console.log(`Loading kegiatan akan datang for lokasi: ${lokasiId}`);
      
      const endpoints = [
        `http://localhost:5001/api/peta/kegiatan/${lokasiId}/akan-datang`,
        `http://localhost:5001/api/kegiatan/akan-datang/${lokasiId}`,
      ];
      
      let success = false;
      let data = [];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const res = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          
          if (res.ok) {
            data = await res.json();
            console.log(`Success from ${endpoint}:`, data);
            setKegiatanAkanDatang(data);
            success = true;
            break;
          }
        } catch (endpointErr) {
          console.warn(`Endpoint ${endpoint} error:`, endpointErr.message);
        }
      }
      
      if (!success) {
        throw new Error('Semua endpoint gagal. Periksa koneksi backend.');
      }
      
    } catch (err) {
      console.error('Error loading kegiatan akan datang:', err);
      setErrorKegiatan(`Gagal mengambil data: ${err.message}`);
      setKegiatanAkanDatang([]);
    } finally {
      setLoadingKegiatan(prev => ({ ...prev, akanDatang: false }));
    }
  };

  const loadKegiatanSelesai = async (lokasiId) => {
    try {
      setLoadingKegiatan(prev => ({ ...prev, selesai: true }));
      setErrorKegiatan(null);
      
      console.log(`Loading kegiatan selesai for lokasi: ${lokasiId}`);
      
      const endpoints = [
        `http://localhost:5001/api/peta/kegiatan/${lokasiId}/selesai`,
        `http://localhost:5001/api/laporan/selesai/${lokasiId}`,
      ];
      
      let success = false;
      let data = [];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`Trying endpoint: ${endpoint}`);
          const res = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          
          if (res.ok) {
            data = await res.json();
            console.log(`Success from ${endpoint}:`, data);
            setKegiatanSelesai(data);
            success = true;
            break;
          }
        } catch (endpointErr) {
          console.warn(`Endpoint ${endpoint} error:`, endpointErr.message);
        }
      }
      
      if (!success) {
        throw new Error('Semua endpoint gagal. Periksa koneksi backend.');
      }
      
    } catch (err) {
      console.error('Error loading kegiatan selesai:', err);
      setErrorKegiatan(`Gagal mengambil data: ${err.message}`);
      setKegiatanSelesai([]);
    } finally {
      setLoadingKegiatan(prev => ({ ...prev, selesai: false }));
    }
  };

  const handleTabChange = (tab) => {
    setTabAktif(tab);
    setErrorKegiatan(null);

    if (tab === 'selesai' && selectedDesa && selectedDesa.id && kegiatanSelesai.length === 0) {
      loadKegiatanSelesai(selectedDesa.id);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDesa(null);
    setKegiatanAkanDatang([]);
    setKegiatanSelesai([]);
    setErrorKegiatan(null);
    setLoadingKegiatan({ akanDatang: false, selesai: false });
  };

  // Format tanggal menjadi lebih user-friendly
  const formatTanggal = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Format jam menjadi lebih user-friendly
  const formatJam = (timeString) => {
    if (!timeString) return '-';
    return timeString.substring(0, 5);
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
                  <div className="text-center">
                    <strong>{desa.nama}</strong>
                    <br />
                    <small className="text-muted">
                      {desa.isPuskesmas ? '🏥 Puskesmas' : '📍 Desa'}
                    </small>
                    <br />
                    <button 
                      className="btn btn-sm btn-primary mt-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkerClick(desa);
                      }}
                    >
                      Lihat Kegiatan
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      {/* MODAL UTAMA */}
      {showModal && selectedDesa && (
        <>
          <div className="modal-backdrop show" style={{ opacity: 0.5 }}></div>

          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content border-0 shadow-lg">

                {/* HEADER */}
                <div className="modal-header bg-success text-white">
                  <div>
                    <h5 className="modal-title fw-bold mb-1">
                      <i className="bi bi-geo-alt-fill me-2"></i>
                      {selectedDesa.nama}
                    </h5>
                    <p className="mb-0 small opacity-75">
                      Informasi kegiatan di {selectedDesa.isPuskesmas ? 'puskesmas' : 'desa'} ini
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={closeModal}
                    aria-label="Close"
                  />
                </div>

                {/* TABS */}
                <div className="modal-body p-0">
                  <ul className="nav nav-tabs nav-fill border-bottom">
                    <li className="nav-item">
                      <button
                        className={`nav-link py-3 ${tabAktif === 'akan-datang' ? 'active fw-bold' : ''}`}
                        onClick={() => handleTabChange('akan-datang')}
                        disabled={loadingKegiatan.akanDatang}
                      >
                        <i className="bi bi-calendar3 me-2"></i>
                        Kegiatan Akan Datang
                        {loadingKegiatan.akanDatang && (
                          <span className="spinner-border spinner-border-sm ms-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </span>
                        )}
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className={`nav-link py-3 ${tabAktif === 'selesai' ? 'active fw-bold' : ''}`}
                        onClick={() => handleTabChange('selesai')}
                        disabled={loadingKegiatan.selesai}
                      >
                        <i className="bi bi-check-circle me-2"></i>
                        Kegiatan Selesai
                        {loadingKegiatan.selesai && (
                          <span className="spinner-border spinner-border-sm ms-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </span>
                        )}
                      </button>
                    </li>
                  </ul>

                  <div className="p-4">
                    {/* Error Message */}
                    {errorKegiatan && (
                      <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        <strong>Perhatian:</strong> {errorKegiatan}
                        <button 
                          type="button" 
                          className="btn-close" 
                          onClick={() => setErrorKegiatan(null)}
                          aria-label="Close"
                        ></button>
                      </div>
                    )}

                    {/* TAB CONTENT: AKAN DATANG */}
                    {tabAktif === 'akan-datang' && (
                      <div>
                        {loadingKegiatan.akanDatang ? (
                          <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 text-muted">Memuat kegiatan akan datang...</p>
                          </div>
                        ) : kegiatanAkanDatang.length === 0 ? (
                          <div className="text-center py-5">
                            <i className="bi bi-calendar-x text-muted" style={{ fontSize: '3rem' }}></i>
                            <p className="mt-3 text-muted">
                              Tidak ada kegiatan yang akan datang di lokasi ini.
                            </p>
                          </div>
                        ) : (
                          <div className="row g-3">
                            {kegiatanAkanDatang.map((item, index) => (
                              <div key={item.id || index} className="col-12">
                                <div className="card border-success border-start border-4 shadow-sm">
                                  <div className="card-body">
                                    <h5 className="card-title fw-bold text-success mb-3">
                                      <i className="bi bi-calendar-event me-2"></i>
                                      {item.judul || 'Judul tidak tersedia'}
                                    </h5>
                                    
                                    {item.deskripsi && (
                                      <p className="card-text mb-3">
                                        {item.deskripsi}
                                      </p>
                                    )}

                                    <div className="row small text-muted mt-3">
                                      <div className="col-md-6 mb-2">
                                        <i className="bi bi-tag-fill me-2 text-primary"></i>
                                        <strong>Jenis Kegiatan:</strong> {item.jenis_kegiatan || item.jenis_kegiatan_id || 'Tidak diketahui'}
                                      </div>
                                      <div className="col-md-6 mb-2">
                                        <i className="bi bi-calendar-date me-2 text-primary"></i>
                                        <strong>Tanggal:</strong> {formatTanggal(item.tanggal)}
                                      </div>
                                      <div className="col-md-6 mb-2">
                                        <i className="bi bi-clock me-2 text-primary"></i>
                                        <strong>Waktu:</strong> {formatJam(item.jam_mulai)} - {formatJam(item.jam_selesai)}
                                      </div>
                                      <div className="col-md-6 mb-2">
                                        <i className="bi bi-person-circle me-2 text-primary"></i>
                                        <strong>Penanggung Jawab:</strong> {item.full_name || 'Tidak diketahui'}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* TAB CONTENT: SELESAI */}
                    {tabAktif === 'selesai' && (
                      <div>
                        {loadingKegiatan.selesai ? (
                          <div className="text-center py-5">
                            <div className="spinner-border text-success" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-3 text-muted">Memuat kegiatan selesai...</p>
                          </div>
                        ) : kegiatanSelesai.length === 0 ? (
                          <div className="text-center py-5">
                            <i className="bi bi-check-circle text-muted" style={{ fontSize: '3rem' }}></i>
                            <p className="mt-3 text-muted">
                              Belum ada laporan kegiatan selesai di lokasi ini.
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className="mb-3">
                              <small className="text-muted">
                                Menampilkan {kegiatanSelesai.length} laporan
                              </small>
                            </div>
                            <div className="row g-3">
                              {kegiatanSelesai.map((item, index) => (
                                <div key={item.id_laporan || index} className="col-12">
                                  <div className="card border-secondary border-start border-4 shadow-sm">
                                    <div className="card-body">
                                      <div className="d-flex justify-content-between align-items-start mb-3">
                                        <h5 className="card-title fw-bold mb-0">
                                          <i className="bi bi-file-earmark-text me-2"></i>
                                          {item.judul_laporan || item.judul || 'Laporan Kegiatan'}
                                        </h5>
                                        <span className="badge bg-success">
                                          <i className="bi bi-check-circle me-1"></i>
                                          Selesai
                                        </span>
                                      </div>

                                      {item.kegiatan?.judul && (
                                        <h6 className="text-muted mb-3">
                                          <i className="bi bi-card-heading me-2"></i>
                                          Kegiatan: {item.kegiatan.judul}
                                        </h6>
                                      )}

                                      {item.detail_kegiatan && (
                                        <div className="mb-3">
                                          <h6 className="fw-bold mb-2">
                                            <i className="bi bi-info-circle me-2"></i>
                                            Detail Kegiatan:
                                          </h6>
                                          <p className="card-text">
                                            {item.detail_kegiatan}
                                          </p>
                                        </div>
                                      )}

                                      <div className="row small text-muted mt-3">
                                        <div className="col-md-6 mb-2">
                                          <i className="bi bi-calendar-check me-2 text-secondary"></i>
                                          <strong>Tanggal Laporan:</strong> {formatTanggal(item.tanggal_laporan || item.tanggal)}
                                        </div>
                                        {item.nama_file && (
                                          <div className="col-md-6 mb-2">
                                            <i className="bi bi-file-earmark me-2 text-secondary"></i>
                                            <strong>File:</strong> {item.nama_file}
                                          </div>
                                        )}
                                        
                                        {(item.kegiatan || (item.jenis_kegiatan || item.jenis_kegiatan_id)) && (
                                          <>
                                            <div className="col-md-6 mb-2">
                                              <i className="bi bi-tag-fill me-2 text-secondary"></i>
                                              <strong>Jenis:</strong> {item.kegiatan?.jenis_kegiatan || item.jenis_kegiatan || item.jenis_kegiatan_id || 'Tidak diketahui'}
                                            </div>
                                            {item.kegiatan?.tanggal && (
                                              <div className="col-md-6 mb-2">
                                                <i className="bi bi-calendar-date me-2 text-secondary"></i>
                                                <strong>Tanggal Kegiatan:</strong> {formatTanggal(item.kegiatan.tanggal)}
                                              </div>
                                            )}
                                            {(item.kegiatan?.jam_mulai || item.jam_mulai) && (
                                              <div className="col-md-6 mb-2">
                                                <i className="bi bi-clock me-2 text-secondary"></i>
                                                <strong>Waktu:</strong> {formatJam(item.kegiatan?.jam_mulai || item.jam_mulai)} - {formatJam(item.kegiatan?.jam_selesai || item.jam_selesai)}
                                              </div>
                                            )}
                                            {(item.kegiatan?.full_name || item.full_name) && (
                                              <div className="col-md-6 mb-2">
                                                <i className="bi bi-person-circle me-2 text-secondary"></i>
                                                <strong>Penanggung Jawab:</strong> {item.kegiatan?.full_name || item.full_name}
                                              </div>
                                            )}
                                          </>
                                        )}

                                        {item.kegiatan?.deskripsi && (
                                          <div className="col-12 mb-2">
                                            <i className="bi bi-card-text me-2 text-secondary"></i>
                                            <strong>Deskripsi Kegiatan:</strong> {item.kegiatan.deskripsi}
                                          </div>
                                        )}
                                      </div>

                                      {/* Jika ada gambar */}
                                      {item.img && (
                                        <div className="mt-3">
                                          <h6 className="fw-bold mb-2">
                                            <i className="bi bi-image me-2"></i>
                                            Dokumentasi:
                                          </h6>
                                          <div className="text-center">
                                            <img
                                              src={`data:image/jpeg;base64,${item.img}`}
                                              alt="Dokumentasi kegiatan"
                                              className="img-fluid rounded shadow-sm"
                                              style={{ maxHeight: '300px' }}
                                            />
                                          </div>
                                        </div>
                                      )}

                                      {/* SECTION REVIEW/KOMENTAR */}
                                      <div className="mt-4 border-top pt-3">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                          <h6 className="fw-bold mb-0">
                                            <i className="bi bi-chat-left-text me-2"></i>
                                            Komentar & Rating
                                          </h6>
                                          <div className="text-muted small">
                                            ⭐ {reviewStats.average_rating?.toFixed(1) || '0.0'}
                                          </div>
                                        </div>

                                        {/* Tombol untuk membuka modal review */}
                                        {user ? (
                                          <button
                                            className="btn btn-sm btn-outline-primary mb-3"
                                            onClick={() => openReviewModal(item.id_laporan)}
                                          >
                                            <i className="bi bi-pencil me-1"></i>
                                            {userReview ? 'Edit Komentar' : 'Beri Komentar'}
                                          </button>
                                        ) : (
                                          <div className="alert alert-warning mb-3 py-2">
                                            <i className="bi bi-info-circle me-2"></i>
                                            Silakan login untuk memberikan komentar
                                          </div>
                                        )}

                                        {/* Tampilkan beberapa komentar terbaru */}
                                        {reviews.slice(0, 2).map((review) => (
                                          <div key={review.id} className="card mb-2">
                                            <div className="card-body py-2">
                                              <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                  <strong>{review.full_name}</strong>
                                                  <div className="small text-muted">
                                                    {formatReviewDate(review.tanggal)}
                                                  </div>
                                                </div>
                                                {review.rating && (
                                                  <div className="text-warning">
                                                    {'★'.repeat(review.rating)}
                                                    {'☆'.repeat(5 - review.rating)}
                                                  </div>
                                                )}
                                              </div>
                                              <p className="mb-0 mt-1">{review.pesan}</p>
                                            </div>
                                          </div>
                                        ))}

                                        {reviews.length > 2 && (
                                          <button
                                            className="btn btn-link btn-sm text-decoration-none"
                                            onClick={() => openReviewModal(item.id_laporan)}
                                          >
                                            Lihat {reviews.length - 2} komentar lainnya...
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* FOOTER */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeModal}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Tutup
                  </button>
                  <small className="text-muted ms-auto">
                    Total: {tabAktif === 'akan-datang' ? kegiatanAkanDatang.length : kegiatanSelesai.length} data
                  </small>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* MODAL REVIEW */}
      {showReviewModal && (
        <>
          <div className="modal-backdrop show" style={{ opacity: 0.5 }}></div>

          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-chat-left-text me-2"></i>
                    {userReview ? 'Edit Komentar' : 'Beri Komentar'}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowReviewModal(false);
                      setSelectedLaporan(null);
                      setReviews([]);
                      setUserReview(null);
                      setReviewForm({ pesan: '', rating: 5 });
                    }}
                  ></button>
                </div>

                <div className="modal-body">
                  {loadingReviews ? (
                    <div className="text-center py-3">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Form Review */}
                      <div className="mb-3">
                        <label className="form-label">Rating</label>
                        <RatingStars
                          rating={reviewForm.rating}
                          onRate={(rating) => setReviewForm({...reviewForm, rating})}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Komentar</label>
                        <textarea
                          className="form-control"
                          rows="4"
                          value={reviewForm.pesan}
                          onChange={(e) => setReviewForm({...reviewForm, pesan: e.target.value})}
                          placeholder="Bagikan pengalaman atau pendapat Anda..."
                        ></textarea>
                      </div>

                      {/* List Reviews */}
                      {reviews.length > 0 && (
                        <div className="mt-4">
                          <h6>Komentar Lainnya ({reviews.length})</h6>
                          {reviews.map((review) => (
                            <div key={review.id} className="card mb-2">
                              <div className="card-body py-2">
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <strong>{review.full_name}</strong>
                                    {review.user_id === user?.id && (
                                      <span className="badge bg-info ms-2">Anda</span>
                                    )}
                                  </div>
                                  <small className="text-muted">
                                    {formatReviewDate(review.tanggal)}
                                  </small>
                                </div>
                                {review.rating && (
                                  <div className="text-warning small">
                                    {'★'.repeat(review.rating)}
                                  </div>
                                )}
                                <p className="mb-0 mt-1">{review.pesan}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="modal-footer">
                  {userReview && (
                    <button
                      type="button"
                      className="btn btn-outline-danger me-auto"
                      onClick={deleteReview}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Hapus
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowReviewModal(false);
                      setSelectedLaporan(null);
                      setReviews([]);
                      setUserReview(null);
                      setReviewForm({ pesan: '', rating: 5 });
                    }}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={submitReview}
                    disabled={!reviewForm.pesan.trim()}
                  >
                    {userReview ? 'Update' : 'Kirim'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}