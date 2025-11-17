import Header from '../../components/Header'
import HeroSelection from '../../components/HeroSelection'
import DokterSelection from '../../components/DokterSelection'
import KontakSelection from '../../components/KontakSelection'
import Footer from '../../components/Footer'

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSelection />
        <DokterSection />
        <KontakSelection />
      </main>
      <Footer />
    </>
  )
}

// Dokter Section Component
function DokterSection() {
  return (
    <section id="dokter" className="py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="section-title">Dokter Hari Ini</h2>
          <p className="section-subtitle">Tim medis profesional siap melayani Anda</p>
        </div>
        <DokterSelection />
      </div>
    </section>
  )
}