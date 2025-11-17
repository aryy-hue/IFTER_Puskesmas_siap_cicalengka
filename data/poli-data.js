const poliData = [
  {
    id: "umum",
    name: "Poli Umum",
    icon: "fas fa-user-md",
    doctor: "Dr. Ahmad Fauzi",
    specialty: "Dokter Umum",
    description: "Melayani pemeriksaan kesehatan umum, pengobatan penyakit ringan, dan rujukan jika diperlukan.",
    schedule: "08:00 - 14:00",
    status: "Tersedia",
    animationDelay: "0s",
    doctors: [
      {
        name: "Dr. Ahmad Wijaya, Sp.PD",
        specialization: "Dokter Spesialis Penyakit Dalam",
        schedule: "08:00 - 14:00",
        status: "Tersedia"
      },
      {
        name: "Dr. Siti Rahayu",
        specialization: "Dokter Umum",
        schedule: "14:00 - 20:00",
        status: "Belum Mulai"
      },
      {
        name: "Dr. Budi Santoso",
        specialization: "Dokter Umum",
        schedule: "Senin - Sabtu: 10:00 - 16:00",
        status: "Belum Mulai"
      },
      {
        name: "Dr. Rina Wijaya",
        specialization: "Dokter Umum",
        schedule: "Selasa - Jumat: 13:00 - 19:00",
        status: "Belum Mulai"
      }
    ]
  },
  {
    id: "anak",
    name: "Poli Anak",
    icon: "fas fa-baby",
    doctor: "Dr. Siti Rahayu",
    specialty: "Spesialis Anak",
    description: "Melayani pemeriksaan kesehatan anak, imunisasi, dan konsultasi tumbuh kembang anak.",
    schedule: "09:00 - 15:00",
    status: "Tersedia",
    animationDelay: "0.1s",
    doctors: [
      {
        name: "Dr. Maria Ulfa, Sp.A",
        specialization: "Dokter Spesialis Anak",
        schedule: "08:00 - 12:00",
        status: "Tersedia"
      },
      {
        name: "Dr. Budi Santoso, Sp.A",
        specialization: "Dokter Spesialis Anak",
        schedule: "13:00 - 17:00",
        status: "Belum Mulai"
      },
      {
        name: "Dr. Andi Pratama",
        specialization: "Spesialis Anak",
        schedule: "Rabu - Minggu: 08:00 - 14:00",
        status: "Belum Mulai"
      }
    ]
  },
  {
    id: "gigi",
    name: "Poli Gigi",
    icon: "fas fa-tooth",
    doctor: "Drg. Maya Sari",
    specialty: "Dokter Gigi",
    description: "Melayani pemeriksaan kesehatan gigi, penambalan, pencabutan, dan perawatan gigi lainnya.",
    schedule: "10:00 - 16:00",
    status: "Tersedia",
    animationDelay: "0.2s",
    doctors: [
      {
        name: "Drg. Anita Sari",
        specialization: "Dokter Gigi",
        schedule: "09:00 - 15:00",
        status: "Tersedia"
      },
      {
        name: "Drg. Hendra Gunawan",
        specialization: "Dokter Gigi Spesialis Ortodonti",
        schedule: "Selasa & Kamis: 13:00 - 19:00",
        status: "Belum Mulai"
      }
    ]
  },
  {
    id: "gizi",
    name: "Poli Gizi",
    icon: "fas fa-apple-alt",
    doctor: "Ns. Rina Wulandari, AMG",
    specialty: "Ahli Gizi",
    description: "Melayani konsultasi gizi, penyusunan menu sehat, dan edukasi pola makan seimbang.",
    schedule: "08:30 - 12:30",
    status: "Tersedia",
    animationDelay: "0.3s",
    doctors: [
      {
        name: "Ns. Rina Wulandari, AMG",
        specialization: "Ahli Gizi",
        schedule: "Senin - Jumat: 08:30 - 12:30",
        status: "Tersedia"
      }
    ]
  },
  {
    id: "kia",
    name: "Poli KIA",
    icon: "fas fa-female",
    doctor: "Ns. Dewi Lestari, S.Kep",
    specialty: "Bidan",
    description: "Melayani pemeriksaan kehamilan, persalinan, KB, dan kesehatan reproduksi perempuan.",
    schedule: "08:00 - 14:00",
    status: "Tersedia",
    animationDelay: "0.4s",
    doctors: [
      {
        name: "Ns. Dewi Lestari, S.Kep",
        specialization: "Bidan",
        schedule: "Senin - Jumat: 08:00 - 14:00",
        status: "Tersedia"
      },
      {
        name: "Ns. Sari Indah, S.Kep",
        specialization: "Bidan",
        schedule: "Selasa - Sabtu: 10:00 - 16:00",
        status: "Belum Mulai"
      }
    ]
  },
  {
    id: "kandungan",
    name: "Poli Kandungan",
    icon: "fas fa-female",
    doctor: "Dr. Rina Melati, Sp.OG",
    specialty: "Dokter Spesialis Kandungan",
    description: "Kesehatan ibu dan janin",
    schedule: "10:00 - 16:00",
    status: "Tersedia",
    animationDelay: "0.5s",
    doctors: [
      {
        name: "Dr. Rina Melati, Sp.OG",
        specialization: "Dokter Spesialis Kandungan",
        schedule: "10:00 - 16:00",
        status: "Tersedia"
      }
    ]
  },
  {
    id: "mata",
    name: "Poli Mata",
    icon: "fas fa-eye",
    doctor: "Dr. Andi Pratama, Sp.M",
    specialty: "Dokter Spesialis Mata",
    description: "Pelayanan kesehatan mata",
    schedule: "08:00 - 12:00 (Senin & Kamis)",
    status: "Tersedia",
    animationDelay: "0.6s",
    doctors: [
      {
        name: "Dr. Andi Pratama, Sp.M",
        specialization: "Dokter Spesialis Mata",
        schedule: "08:00 - 12:00 (Senin & Kamis)",
        status: "Tersedia"
      }
    ]
  },
  {
    id: "ugd",
    name: "UGD",
    icon: "fas fa-ambulance",
    doctor: "Tim Medis UGD",
    specialty: "24 Jam",
    description: "Melayani keadaan darurat medis 24 jam dengan tenaga medis yang siap siaga.",
    schedule: "24 Jam",
    status: "Tersedia",
    animationDelay: "0.7s",
    doctors: [
      {
        name: "Dr. Kevin Maulana",
        specialization: "Dokter Jaga UGD",
        schedule: "24 Jam",
        status: "Tersedia"
      },
      {
        name: "Dr. Lisa Permata",
        specialization: "Dokter Jaga UGD",
        schedule: "24 Jam",
        status: "Tersedia"
      },
      {
        name: "Tim Medis UGD",
        specialization: "Dokter Jaga & Perawat",
        schedule: "24 Jam Setiap Hari",
        status: "Tersedia"
      }
    ]
  }
];

// Data tambahan untuk doctorsData (jika masih diperlukan terpisah)
export const doctorsData = {
  umum: [
    {
      name: "Dr. Ahmad Fauzi",
      specialty: "Dokter Umum",
      schedule: "Senin - Jumat: 08:00 - 14:00",
      status: "Tersedia"
    },
    {
      name: "Dr. Budi Santoso",
      specialty: "Dokter Umum",
      schedule: "Senin - Sabtu: 10:00 - 16:00",
      status: "Belum Mulai"
    }
  ],
  anak: [
    {
      name: "Dr. Siti Rahayu",
      specialty: "Spesialis Anak",
      schedule: "Senin - Jumat: 09:00 - 15:00",
      status: "Tersedia"
    }
  ],
  // ... dan seterusnya untuk poli lainnya
};

// Nama poli untuk modal
export const poliNames = {
  umum: "Poli Umum",
  anak: "Poli Anak", 
  gigi: "Poli Gigi",
  gizi: "Poli Gizi",
  kia: "Poli KIA",
  kandungan: "Poli Kandungan",
  mata: "Poli Mata",
  ugd: "Unit Gawat Darurat"
};

export default poliData;