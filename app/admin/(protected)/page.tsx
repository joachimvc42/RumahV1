'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * The admin home now points straight at the listings (investments) section —
 * the rentals dashboard is retired from this marketplace build.
 */
export default function AdminHomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/investments');
  }, [router]);
  return <div style={{ padding: 40 }}>Redirecting…</div>;
}
