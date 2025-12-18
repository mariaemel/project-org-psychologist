import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import MobileMenu from '@/components/Header/MobileMenu';

const nunitoSans = localFont({
  src: [
    { path: "../../public/fonts/NunitoSans-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/NunitoSans-Bold.ttf", weight: "700", style: "bold" },
  ],
  variable: "--font-nunito",
  display: "swap",
});

const raleway = localFont({
  src: [
    { path: "../../public/fonts/Raleway-v4020-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Raleway-v4020-Bold.otf", weight: "700", style: "bold" },
  ],
  variable: "--font-raleway",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'Василина Денисюк',
  description: 'Организационный психолог',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`
      ${nunitoSans.variable}
      ${raleway.variable}
    `}>
      <body>
        <div className="background">
          <Header />
          <MobileMenu />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
