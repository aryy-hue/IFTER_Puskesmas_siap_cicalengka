export default function KontakSection() {
  const contactItems = [
    {
      icon: 'fas fa-map-marker-alt',
      title: 'Alamat',
      content: 'Jl. Raya Cicalengka No. 123, Kec. Cicalengka, Kab. Bandung, Jawa Barat 40395'
    },
    {
      icon: 'fas fa-phone',
      title: 'Telepon',
      content: '(022) 1234567\n081234567890 (WhatsApp)'
    },
    {
      icon: 'fas fa-envelope',
      title: 'Email',
      content: 'puskesmas.cicalengka@email.com'
    },
    {
      icon: 'fas fa-clock',
      title: 'Jam Operasional',
      content: 'Senin - Jumat: 07.00 - 16.00\nSabtu: 07.00 - 14.00\nUGD: 24 Jam'
    }
  ]

  return (
    <section id="kontak" className="py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Hubungi Kami</h2>
          <p className="section-subtitle">Kami siap melayani kebutuhan kesehatan Anda</p>
        </div>
        <div className="row">
          {contactItems.map((item, index) => (
            <div key={index} className="col-md-6 mb-4">
              <div 
                className="card h-100 contact-card animate-slide-up" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-body text-center">
                  <i className={`${item.icon} fa-2x text-success mb-3`}></i>
                  <h5>{item.title}</h5>
                  <p style={{ whiteSpace: 'pre-line' }}>{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
