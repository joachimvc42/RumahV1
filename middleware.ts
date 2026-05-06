import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RENTALS_HOST = 'rentals.rumahya.com';
// Local-dev alias: add `127.0.0.1 rentals.localhost` to /etc/hosts
const RENTALS_HOST_DEV = 'rentals.localhost';

function isRentalsHost(hostname: string): boolean {
  return hostname === RENTALS_HOST || hostname.startsWith(RENTALS_HOST_DEV);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') ?? request.nextUrl.hostname;

  const rentals = isRentalsHost(hostname);

  // ── Block direct /rent/* access from invest domain ──────────────────
  if (!rentals && pathname.startsWith('/rent')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // ── Invest domain: redirect old /rentals/* to rentals subdomain ──────
  if (!rentals && (pathname === '/rentals' || pathname.startsWith('/rentals/'))) {
    const target = new URL(`https://${RENTALS_HOST}${pathname}`);
    return NextResponse.redirect(target, { status: 301 });
  }

  // ── Rentals subdomain ────────────────────────────────────────────────
  if (rentals) {
    // Already rewritten (internal re-entry) — just tag it
    if (pathname.startsWith('/rent')) {
      const res = NextResponse.next();
      res.headers.set('x-site', 'rentals');
      res.headers.set('x-locale', 'en');
      return res;
    }

    // Sitemap / robots served from /rent/* too
    const rewritePath = pathname === '/' ? '/rent' : `/rent${pathname}`;
    const url = request.nextUrl.clone();
    url.pathname = rewritePath;
    const res = NextResponse.rewrite(url);
    res.headers.set('x-site', 'rentals');
    res.headers.set('x-locale', 'en');
    return res;
  }

  // ── Invest domain: locale detection ─────────────────────────────────
  const locale = pathname.startsWith('/fr')
    ? 'fr'
    : pathname.startsWith('/es')
    ? 'es'
    : 'en';

  const res = NextResponse.next();
  res.headers.set('x-locale', locale);
  res.headers.set('x-site', 'invest');
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|api).*)'],
};
