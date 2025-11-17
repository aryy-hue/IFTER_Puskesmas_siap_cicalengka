import { Poppins } from 'next/font/google'
import './globals.css'

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
})

export const metadata = {
  title: 'SIAPCicalengka - Puskesmas Cicalengka',
  description: 'Melayani dengan hati untuk kesehatan masyarakat Cicalengka dan sekitarnya.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </head>
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  )
}
