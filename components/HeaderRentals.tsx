'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

export default function HeaderRentals() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const prefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = stored ? stored === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = useCallback(() => {
    setDark(prev => {
      const next = !prev;
      document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={closeMenu}>
          <span className="brand-name">Rumah<span>Ya</span></span>
          <span className="brand-badge">Rentals</span>
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
          <Link
            href="/"
            className={isActive('/') && pathname === '/' ? 'nav-link is-active' : 'nav-link'}
            onClick={closeMenu}
          >
            Rentals
          </Link>
          <Link
            href="/map"
            className={isActive('/map') ? 'nav-link is-active' : 'nav-link'}
            onClick={closeMenu}
          >
            Map
          </Link>
          <Link
            href="/about"
            className={isActive('/about') ? 'nav-link is-active' : 'nav-link'}
            onClick={closeMenu}
          >
            About
          </Link>

          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={dark ? 'Light mode' : 'Dark mode'}
          >
            {dark ? '☀️' : '🌙'}
          </button>

          <a
            href="https://rumahya.com"
            className="nav-link nav-link-invest"
            title="RumahYa Investments"
          >
            Invest in Lombok →
          </a>
        </nav>
      </div>
    </header>
  );
}
