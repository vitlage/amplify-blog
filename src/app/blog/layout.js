import NavBar from '@/components/navbar/NavBar'
import './globals.css'
import { DM_Sans, IBM_Plex_Mono } from 'next/font/google'
import Footer from '@/components/footer/Footer'
import { ThemeContextProvider } from '@/context/ThemeContext'
import ThemeProvider from '@/providers/ThemeProvider'
import AuthProvider from '@/providers/AuthProvider'

const dmSans = DM_Sans({ subsets: ['latin'] })
// Meta text (dates, chips, read time) on the blog pages.
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-blog-mono',
})

export const metadata = {
  title: 'Convertic AI Blog',
  description: 'Convertic AI Blog',
}

export default function BlogLayout({ children }) {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <ThemeProvider>
          <div className={`container-fluid ${plexMono.variable}`}>
            <div className="wrapper">
              <NavBar />
                {children}
            </div>
          </div>
          <Footer />
        </ThemeProvider>
      </ThemeContextProvider>
    </AuthProvider>
  )
}
