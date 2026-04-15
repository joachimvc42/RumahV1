'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = pathname.startsWith('/admin');
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/rentals" className="brand">
          <span className="brand-name">Rumah<span>Ya</span></span>
        </Link>

        <button
          className={`nav-toggle ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span /><span /><span />
        </button>

        <nav className={`primary-nav ${menuOpen ? 'is-open' : ''}`}>
          {!isAdmin && (
            <>
              <Link href="/rentals" className={isActive('/rentals') ? 'nav-link is-active' : 'nav-link'} onClick={closeMenu}>Rentals</Link>
              <Link href="/investments" className={isActive('/investments') ? 'nav-link is-active' : 'nav-link'} onClick={closeMenu}>Investments</Link>
              <Link href="/" className={pathname === '/' ? 'nav-link is-active' : 'nav-link'} onClick={closeMenu}>About us</Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link href="/admin" className={pathname === '/admin' ? 'nav-link is-active' : 'nav-link'} onClick={closeMenu}>Rentals</Link>
              <Link href="/admin/investments" className={isActive('/admin/investments') ? 'nav-link is-active' : 'nav-link'} onClick={closeMenu}>Investments</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}