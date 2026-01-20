'use client'

import { useState } from 'react'
import jsPDF from 'jspdf'

export default function ApprovalLaporanPage() {
  const laporan = [
    {
      id: 1,
      judul: 'Laporan Posyandu',
      petugas: 'Admin Poli',
      createdAt: '2025-11-25',
      periode: 'November 2025',
      detail: 'Kegiatan penimbangan balita dan imunisasi.',
      images: ['/img/puskesmas.jpg']
    }
  ]

  // ================= FILTER STATE =================
  const [searchJudul, setSearchJudul] = useState('')
  const [searchPeriode, setSearchPeriode] = useState('')

  const filteredLaporan = laporan.filter((item) => {
    const judulMatch = item.judul
      .toLowerCase()
      .includes(searchJudul.toLowerCase())

    const periodeMatch = item.periode
      .toLowerCase()
      .includes(searchPeriode.toLowerCase())

    return judulMatch && periodeMatch
  })

  // ================= PDF =================
  const handleDownloadPDF = async (item) => {
    const doc = new jsPDF()

    // HEADER
    doc.setFontSize(14)
    doc.text('PUSKESMAS CICALENGKA', 105, 15, { align: 'center' })
    doc.setFontSize(10)
    doc.text(
      'Jl. Raya Cicalengka No. 123, Kabupaten Bandung',
      105,
      21,
      { align: 'center' }
    )
    doc.line(20, 25, 190, 25)

    // JUDUL
    doc.setFontSize(13)
    doc.text('LAPORAN KEGIATAN', 105, 35, { align: 'center' })
    doc.setFontSize(11)
    doc.text(item.judul.toUpperCase(), 105, 42, { align: 'center' })

    // INFO
    doc.text('Periode', 20, 55)
    doc.text(`: ${item.periode}`, 60, 55)

    doc.text('Tanggal', 20, 63)
    doc.text(
      `: ${new Date(item.createdAt).toLocaleDateString('id-ID')}`,
      60,
      63
    )

    let y = 78

    // ISI
    doc.text('1. Latar Belakang', 20, y)
    y += 8
    doc.text(item.detail, 25, y, { maxWidth: 160 })

    y += 30
    doc.text('2. Tujuan Kegiatan', 20, y)
    y += 8
    doc.text(
      'Meningkatkan pelayanan kesehatan kepada masyarakat.',
      25,
      y,
      { maxWidth: 160 }
    )

    y += 20
    doc.text('3. Waktu dan Tempat', 20, y)
    y += 8
    doc.text(
      `Dilaksanakan pada periode ${item.periode} di wilayah kerja Puskesmas Cicalengka.`,
      25,
      y,
      { maxWidth: 160 }
    )

    y += 25
    doc.text('4. Uraian Kegiatan', 20, y)
    y += 8
    doc.text(item.detail, 25, y, { maxWidth: 160 })

    // DOKUMENTASI
    y += 35
    doc.text('5. Dokumentasi Kegiatan', 20, y)

    if (item.images && item.images.length > 0) {
      for (const imgPath of item.images) {
        const img = new Image()
        img.src = imgPath

        await new Promise((resolve) => {
          img.onload = () => {
            doc.addImage(img, 'JPEG', 25, y + 5, 60, 45)
            resolve()
          }
        })

        y += 55
        if (y > 240) {
          doc.addPage()
          y = 30
        }
      }
    } else {
      doc.text('-', 25, y + 10)
    }

    // PENUTUP
    if (y > 200) doc.addPage()

    doc.text(
      'Demikian laporan kegiatan ini dibuat sebagai bahan dokumentasi.',
      20,
      y + 20
    )

    doc.text(
      `Cicalengka, ${new Date().toLocaleDateString('id-ID')}`,
      130,
      y + 40
    )
    doc.text('Mengetahui,', 130, y + 50)
    doc.text('Kepala Puskesmas', 130, y + 70)

    doc.save(`Laporan-Kegiatan-${item.judul}.pdf`)
  }

  return (
    <div>
      <h1 className="h4 mb-4">Approval Laporan</h1>

      {/* FILTER */}
      <div className="card mb-3">
        <div className="card-body d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Cari judul laporan"
            value={searchJudul}
            onChange={(e) => setSearchJudul(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            placeholder="Filter periode (contoh: November 2025)"
            value={searchPeriode}
            onChange={(e) => setSearchPeriode(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="card shadow-sm">
        <div className="card-body table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-success">
              <tr>
                <th>Judul</th>
                <th>Petugas</th>
                <th>Tanggal</th>
                <th>PDF</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLaporan.length > 0 ? (
                filteredLaporan.map((l) => (
                  <tr key={l.id}>
                    <td>{l.judul}</td>
                    <td>{l.petugas}</td>
                    <td>
                      {new Date(l.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td>
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleDownloadPDF(l)}
                      >
                        Download
                      </button>
                    </td>
                    <td>
                      <button className="btn btn-success btn-sm me-2">
                        Approve
                      </button>
                      <button className="btn btn-danger btn-sm">
                        Tolak
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    Data tidak ditemukan
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
