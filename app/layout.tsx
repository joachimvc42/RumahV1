import type { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

export const metadata: Metadata = {
  title: 'RumahYa – Lombok long-term rentals & land',
  description: 'RumahYa supports foreign investors and expatriates in Lombok by sourcing villas and land opportunities and securing each project with local due diligence, legal verification and on-the-ground property management.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="page-main">
          <div className="container">
            {children}
          </div>
        </main>
        <Footer />
      </body>
    </html>
  );
}

