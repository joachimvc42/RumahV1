'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // isAdmin must default to false so SSR and first client render match;
  // useEffect then promotes it client-side, avoiding hydration mismatch.
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(pathname?.startsWith('/admin') ?? false);
  }, [pathname]);

  // Subtle header state on scroll — denser shadow + tighter padding
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + '/');
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={closeMenu}>
          <span className="brand-name">Rumah<span>Ya</span></span>
        </Link>

        <button
          className={`nav-toggle ${menuOpen ? 'is-open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          aria-expanded={menuOpen}
        >
          <span /><span /><span />
        </button>

        <nav className={`primary-nav ${menuOpen ? 'is-open' : ''}`}>
          {!isAdmin && (
            <>
              <Link
                href="/"
                className={pathname === '/' ? 'nav-link is-active' : 'nav-link'}
                onClick={closeMenu}
              >
                Rentals
              </Link>
              <Link
                href="/investments"
                className={isActive('/investments') ? 'nav-link is-active' : 'nav-link'}
                onClick={closeMenu}
              >
                Investments
              </Link>
              <Link
                href="/about"
                className={isActive('/about') ? 'nav-link is-active' : 'nav-link'}
                onClick={closeMenu}
              >
                About
              </Link>
              <Link
                href="/about#contact"
                className="nav-cta"
                onClick={closeMenu}
              >
                Contact
              </Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link
                href="/admin"
                className={pathname === '/admin' ? 'nav-link is-active' : 'nav-link'}
                onClick={closeMenu}
              >
                Rentals
              </Link>
              <Link
                href="/admin/investments"
                className={isActive('/admin/investments') ? 'nav-link is-active' : 'nav-link'}
                onClick={closeMenu}
              >
                Investments
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
