'use client';

import { useState, useEffect } from 'react';

export default function LaporanItem({ 
  item, 
  user, 
  openReviewModal, 
  formatTanggal, 
  formatJam,
  formatReviewDate 
}) {
  // State untuk review per item
  const [itemReviews, setItemReviews] = useState([]);
  const [itemReviewStats, setItemReviewStats] = useState({ 
    total_reviews: 0, 
    average_rating: 0 
  });
  const [loadingItemReviews, setLoadingItemReviews] = useState(true);
  const [userReview, setUserReview] = useState(null);
  
  // Helper function untuk format rating
  const formatAverageRating = (rating) => {
    if (!rating && rating !== 0) return '0.0';
    
    // Konversi ke number jika string
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    
    // Cek jika valid number
    if (isNaN(numRating)) return '0.0';
    
    // Format dengan 1 decimal
    return numRating.toFixed(1);
  };

  // Helper function untuk parse stats dari API response
  const parseReviewStats = (stats) => {
    if (!stats) return { total_reviews: 0, average_rating: 0 };
    
    return {
      total_reviews: stats.total_reviews || 0,
      average_rating: typeof stats.average_rating === 'string' 
        ? parseFloat(stats.average_rating) || 0
        : stats.average_rating || 0
    };
  };
  
  // Effect untuk load reviews per item
  useEffect(() => {
    const loadReviewsData = async () => {
      try {
        setLoadingItemReviews(true);
        
        const token = localStorage.getItem('token');
        const laporanId = item.id_laporan || item.id;
        
        if (!laporanId) {
          console.warn('No laporan ID found for item:', item);
          return;
        }
        
        console.log(`Loading reviews for laporan ID: ${laporanId}`);
        
        const headers = {
          'Content-Type': 'application/json'
        };
        
        // Gunakan endpoint public untuk semua (guest dan authenticated)
        const url = `http://localhost:5001/api/laporan/${laporanId}/reviews`;
        
        if (token && user) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const res = await fetch(url, { headers });
        
        if (res.ok) {
          const data = await res.json();
          
          // Parse stats untuk memastikan format yang benar
          const parsedStats = parseReviewStats(data.stats);
          
          setItemReviews(data.reviews || []);
          setItemReviewStats(parsedStats);
          
          // Cari review user saat ini (jika user login)
          if (user && data.reviews) {
            const currentUserReview = data.reviews.find(review => 
              review.user_id === user.id
            );
            setUserReview(currentUserReview);
          }
          
          console.log(`Successfully loaded ${data.reviews?.length || 0} reviews`, parsedStats);
        } else {
          console.error('Failed to load reviews:', res.status, res.statusText);
        }
      } catch (err) {
        console.error('Error loading item reviews:', err);
      } finally {
        setLoadingItemReviews(false);
      }
    };
    
    if (item.id_laporan) {
      loadReviewsData();
    }
  }, [item.id_laporan, user, item.id]);

  // Komponen Rating Stars untuk display
  const RatingStarsDisplay = ({ rating }) => {
    const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`${star <= (numericRating || 0) ? 'text-warning' : 'text-secondary'}`}
            style={{ 
              fontSize: '1.2rem',
              cursor: 'default'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="col-12">
      <div className="card border-secondary border-start border-4 shadow-sm">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <h5 className="card-title fw-bold mb-0">
              <i className="bi bi-file-earmark-text me-2"></i>
              {item.judul_laporan || item.judul || 'Laporan Kegiatan'}
            </h5>
            <div className="d-flex flex-column align-items-end gap-2">
              <span className="badge bg-success">
                <i className="bi bi-check-circle me-1"></i>
                Selesai
              </span>
              {/* Review Stats Badge */}
              {itemReviewStats.total_reviews > 0 && (
                <div className="d-flex align-items-center bg-warning bg-opacity-10 p-1 rounded">
                  <span className="text-warning fw-bold me-1">
                    ⭐ {formatAverageRating(itemReviewStats.average_rating)}
                  </span>
                  <small className="text-muted">
                    ({itemReviewStats.total_reviews})
                  </small>
                </div>
              )}
            </div>
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
              {itemReviewStats.total_reviews > 0 && (
                <div className="d-flex align-items-center">
                  <div className="me-2 text-warning fw-bold">
                    ⭐ {formatAverageRating(itemReviewStats.average_rating)}
                  </div>
                  <small className="text-muted">
                    ({itemReviewStats.total_reviews} komentar)
                  </small>
                </div>
              )}
            </div>

            {/* Tombol untuk membuka modal review */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              {user ? (
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => openReviewModal(item.id_laporan)}
                >
                  <i className="bi bi-pencil me-1"></i>
                  {userReview ? 'Edit Komentar' : 'Beri Komentar'}
                </button>
              ) : (
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => openReviewModal(item.id_laporan)}
                >
                  <i className="bi bi-chat-left-text me-1"></i>
                  Lihat Komentar ({itemReviewStats.total_reviews})
                </button>
              )}
              
              {/* Tombol lihat semua komentar */}
              {itemReviewStats.total_reviews > 0 && (
                <button
                  className="btn btn-link btn-sm text-decoration-none"
                  onClick={() => openReviewModal(item.id_laporan)}
                >
                  <i className="bi bi-chevron-right me-1"></i>
                  Lihat Semua
                </button>
              )}
            </div>

            {/* Tampilkan 2 komentar terbaru */}
            {loadingItemReviews ? (
              <div className="text-center py-2">
                <div className="spinner-border spinner-border-sm text-secondary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <small className="text-muted ms-2">Memuat komentar...</small>
              </div>
            ) : itemReviews.length === 0 ? (
              <div className="text-center py-3 border rounded bg-light">
                <i className="bi bi-chat-left-text text-muted me-2"></i>
                <small className="text-muted">
                  Belum ada komentar. {user ? 'Jadilah yang pertama berkomentar!' : 'Login untuk berkomentar!'}
                </small>
              </div>
            ) : (
              <>
                {itemReviews.slice(0, 2).map((review) => (
                  <div key={review.id} className="card mb-2 border-light shadow-sm">
                    <div className="card-body py-2">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong className="d-block">
                            {review.full_name}
                            {user && review.user_id === user.id && (
                              <span className="badge bg-info ms-2">Anda</span>
                            )}
                          </strong>
                          <div className="small text-muted">
                            {formatReviewDate(review.tanggal)}
                          </div>
                        </div>
                        {review.rating !== null && review.rating !== undefined && (
                          <RatingStarsDisplay rating={review.rating} />
                        )}
                      </div>
                      <p className="mb-0 mt-2">{review.pesan}</p>
                    </div>
                  </div>
                ))}

                {itemReviews.length > 2 && (
                  <button
                    className="btn btn-link btn-sm text-decoration-none w-100 text-center mt-2"
                    onClick={() => openReviewModal(item.id_laporan)}
                  >
                    <i className="bi bi-chevron-down me-1"></i>
                    Lihat {itemReviews.length - 2} komentar lainnya
                    <i className="bi bi-chevron-down ms-1"></i>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}