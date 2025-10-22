import NavBar from '@/components/navbar/NavBar'
import './pricing.css'
import { DM_Sans } from 'next/font/google'
import Footer from '@/components/footer/Footer'
import { ThemeContextProvider } from '@/context/ThemeContext'
import ThemeProvider from '@/providers/ThemeProvider'
import AuthProvider from '@/providers/AuthProvider'

const dmSans = DM_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'Pricing - Convertic.ai | Interactive Email Marketing Plans',
  description: 'Choose the right plan for your needs. From free Beginner plan to Enterprise solutions. Make every email interactive with Convertic.ai.',
  openGraph: {
    title: 'Pricing - Convertic.ai',
    description: 'Choose the right plan for your needs. Interactive email marketing solutions.',
    url: 'https://convertic.ai/pricing',
  },
}

export default function PricingLayout({ children }) {
  return (
    <AuthProvider>
      <ThemeContextProvider>
        <ThemeProvider>
          <div className="container-fluid">
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
