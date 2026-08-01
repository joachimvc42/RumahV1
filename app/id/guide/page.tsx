import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cara warga asing memiliki tanah di Indonesia (PT PMA & leasehold) — RumahYa',
  description:
    'Bisakah warga asing membeli tanah di Indonesia? Ya — melalui PT PMA (hak milik/HGB) atau leasehold. RumahYa menjelaskan struktur yang sesuai, uji tuntas, dan proses untuk Lombok.',
  alternates: {
    canonical: 'https://rumahya.com/id/guide',
    languages: {
      en: 'https://rumahya.com/guide',
      fr: 'https://rumahya.com/fr/guide',
      es: 'https://rumahya.com/es/guide',
      id: 'https://rumahya.com/id/guide',
    },
  },
  openGraph: {
    title: 'Cara warga asing memiliki tanah di Indonesia — panduan RumahYa',
    description:
      'PT PMA, HGB, leasehold: cara legal dan sesuai bagi warga asing berinvestasi di tanah Indonesia, dijelaskan langkah demi langkah.',
    url: 'https://rumahya.com/id/guide',
    type: 'article',
    locale: 'id_ID',
    images: [
      { url: 'https://rumahya.com/og-image.jpg', width: 1200, height: 630, alt: 'RumahYa — Panduan properti Indonesia untuk warga asing' },
    ],
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Cara warga asing memiliki tanah di Indonesia (PT PMA & leasehold)',
  description:
    'Struktur legal dan sesuai yang digunakan warga asing untuk berinvestasi di tanah Indonesia — PT PMA (HGB hak milik) dan leasehold — dengan uji tuntas dan proses RumahYa.',
  author: { '@type': 'Organization', name: 'RumahYa', url: 'https://rumahya.com' },
  publisher: { '@type': 'Organization', name: 'RumahYa' },
  inLanguage: 'id',
  mainEntityOfPage: 'https://rumahya.com/id/guide',
};

export default function GuidePageID() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="guide-page">
        <section className="container guide-hero">
          <p className="eyebrow">Panduan investor · Lombok, Indonesia</p>
          <h1>Bisakah warga asing memiliki tanah di Indonesia? Ya — begini caranya.</h1>
          <p className="guide-lead">
            Indonesia tidak mengizinkan kepemilikan hak milik langsung oleh warga asing — tetapi
            menyediakan dua jalur yang sepenuhnya legal untuk menguasai tanah: <strong>PT PMA</strong>{' '}
            yang memegang hak <strong>HGB</strong> (hak milik efektif), atau <strong>leasehold</strong>{' '}
            (biasanya 25–30 tahun, dapat diperpanjang). Panduan ini menjelaskan keduanya, uji tuntas
            yang melindungi Anda, dan bagaimana RumahYa membimbing Anda dari minat hingga serah terima.
          </p>
        </section>

        <section className="container guide-section">
          <h2>Jalur 1 — PT PMA (hak milik via HGB)</h2>
          <p>
            PT PMA adalah badan hukum Indonesia dengan kepemilikan asing. Ia dapat memegang hak{' '}
            <strong>Hak Guna Bangunan (HGB)</strong> — setara praktis dengan hak milik untuk tujuan
            investasi, dapat diperpanjang selama puluhan tahun. Anda mengendalikan perusahaan, dan
            perusahaan mengendalikan tanah. Ini adalah struktur yang digunakan sebagian besar investor
            asing serius untuk villa dan land banking di Lombok.
          </p>
          <ul>
            <li>Perusahaan dengan kepemilikan asing (Anda adalah pemegang saham)</li>
            <li>Memegang hak HGB atas tanah — dapat dibankkan, diperpanjang, dialihkan</li>
            <li>Sesuai sepenuhnya dengan hukum investasi Indonesia</li>
            <li>Ideal untuk investasi jangka panjang dan pengembangan</li>
          </ul>
        </section>

        <section className="container guide-section">
          <h2>Jalur 2 — Leasehold</h2>
          <p>
            Leasehold adalah pintu masuk paling sederhana. Anda menyewa tanah (dan villa di atasnya)
            untuk jangka waktu tetap — biasanya 25 hingga 30 tahun, sering dengan opsi perpanjangan.
            Tidak perlu mendirikan badan hukum, modal awal lebih rendah, dan hak tetap pada pemilik
            Indonesia. Banyak pembeli mulai dengan sewa lalu beralih ke struktur PT PMA.
          </p>
          <ul>
            <li>Tanpa pendirian entitas — penutupan lebih cepat</li>
            <li>Modal awal lebih rendah daripada struktur hak milik</li>
            <li>Ketentuan keluar dan perpanjangan yang jelas dan tetap</li>
          </ul>
        </section>

        <section className="container guide-section">
          <h2>Mengapa uji tuntas adalah segalanya</h2>
          <p>
            Di Indonesia, risikonya jarang pada harga — melainkan pada <strong>hak</strong>. Rantai
            kepemilikan yang bersih, izin terverifikasi, dan notaris yang mengonfirmasi penjual dapat
            secara legal mentransfer aset adalah hal yang tidak bisa ditawar. Setiap listing di
            RumahYa diperiksa haknya sebelum sampai kepada Anda. Kami tidak akan menunjukkan petak
            yang tidak akan kami beli sendiri.
          </p>
          <ul>
            <li>Verifikasi hak dan rantai kepemilikan</li>
            <li>Konfirmasi izin dan zonasi</li>
            <li>Koordinasi notaris untuk transfer bersih</li>
            <li>Kunjungan lapangan, foto, dan survei</li>
          </ul>
        </section>

        <section className="container guide-section">
          <h2>Proses RumahYa</h2>
          <ol>
            <li>Konsultasi awal untuk memahami budget dan tujuan Anda</li>
            <li>Shortlist properti terverifikasi sesuai kriteria Anda</li>
            <li>Kunjungan lokasi dikoordinasi oleh tim Lombok kami</li>
            <li>Uji tuntas hukum: cek hak, verifikasi izin, koordinasi notaris</li>
            <li>Dukungan transaksi hingga serah terima</li>
          </ol>
        </section>

        <section className="container guide-cta">
          <h2>Siap melihat tanah terverifikasi?</h2>
          <p>Jelajahi peluang saat ini, atau bicara dengan tim Lombok kami — tanpa kewajiban.</p>
          <div className="guide-cta-buttons">
            <Link href="/id/opportunities" className="lc2-btn-wa">Lihat peluang</Link>
            <a
              href="https://wa.me/6287873487940?text=Halo%20RumahYa%2C%20saya%20ingin%20memahami%20cara%20membeli%20tanah%20di%20Lombok%20sebagai%20warga%20asing"
              target="_blank"
              rel="noopener noreferrer"
              className="lc2-btn-wa"
            >
              WhatsApp
            </a>
          </div>
        </section>
      </main>
    </>
  );
}
