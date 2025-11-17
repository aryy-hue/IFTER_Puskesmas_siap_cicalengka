import './globals.css'

export const metadata = {
  title: 'SIAPCicalengka - Puskesmas Cicalengka',
  description: 'Melayani dengan hati untuk kesehatan masyarakat Cicalengka dan sekitarnya',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-poppins">
        {children}
        
        {/* Scripts */}
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js" async></script>
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" async></script>
      </body>
    </html>
  )
}