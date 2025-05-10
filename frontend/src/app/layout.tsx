import type { Metadata } from "next";
import { Kotta_One, Inter, Roboto, Victor_Mono, Ubuntu_Sans_Mono, Caveat, Raleway } from "next/font/google";
import "./globals.css";
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'

const victorMono = Victor_Mono({ subsets: ["latin", "cyrillic"], weight: ["400"], variable: "--font-victor" });
const ubuntuMono = Ubuntu_Sans_Mono({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], variable: "--font-ubuntu" });
const caveat = Caveat({ subsets: ["latin", "cyrillic"], weight: ["400"], variable: "--font-caveat" });
const raleway = Raleway({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], variable: "--font-raleway" });
const inter = Inter({subsets: ['latin', 'cyrillic'],variable: '--font-inter', display: 'swap'})
const roboto = Roboto({subsets: ['latin', 'cyrillic'],variable: '--font-roboto', weight: ['400', '500', '700'],display: 'swap'})
const kotta = Kotta_One({weight: '400', subsets: ['latin'], variable: "--font-kotta", display: 'swap'})

export const metadata: Metadata = {
  title: 'Василина Денисюк',
  description: 'Организационный психолог',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${victorMono.variable} ${ubuntuMono.variable} ${caveat.variable} ${raleway.variable} ${inter.variable} ${roboto.variable} ${kotta.variable}`}>
      <body>
        <div className="background">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
