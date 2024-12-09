import NavBar from '@/components/navbar/NavBar'
import './globals.css'
import { Inter } from 'next/font/google'
import Footer from '@/components/footer/Footer'
import { ThemeContextProvider } from '@/context/ThemeContext'
import ThemeProvider from '@/providers/ThemeProvider'
import AuthProvider from '@/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Convertic AI Blog',
  description: 'Convertic AI Blog',
}

export default function BlogLayout({ children }) {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <ThemeProvider>
          <div className="container-full">
            <div className="wrapper">
              <NavBar />
                {children}
              <Footer />
            </div>
          </div>
        </ThemeProvider>
      </ThemeContextProvider>
    </AuthProvider>
  )
}
