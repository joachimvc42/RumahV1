'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { useAdminLang } from '@/lib/adminI18n';

/**
 * Auth guard for routes under /admin except /admin/login (sibling route, not in this group).
 */
export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // Force light mode in admin — dark mode makes the admin UI unreadable
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getUser();

      if (!data.user) {
        router.replace('/admin/login');
        return;
      }

      const { data: userRow, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (error || (userRow?.role !== 'admin' && userRow?.role !== 'superadmin')) {
        await supabase.auth.signOut();
        router.replace('/admin/login');
        return;
      }

      setLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  if (loading) {
    return <div style={{ padding: 40 }}>Checking admin access…</div>;
  }

  return (
    <>
      <AdminLangToggle />
      {children}
    </>
  );
}

/** Fixed EN / ID switcher for the seller area. */
function AdminLangToggle() {
  const { lang, setLang } = useAdminLang();
  const wrap: React.CSSProperties = {
    position: 'fixed', top: 12, right: 12, zIndex: 1000,
    display: 'flex', gap: 4, background: '#fff', border: '1px solid #e5e7eb',
    borderRadius: 999, padding: 4, boxShadow: '0 2px 10px rgba(15,23,42,0.12)',
  };
  const btn = (active: boolean): React.CSSProperties => ({
    padding: '5px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
    fontSize: 12, fontWeight: 800, letterSpacing: '0.04em',
    background: active ? '#2563eb' : 'transparent', color: active ? '#fff' : '#6b7280',
  });
  return (
    <div style={wrap} role="group" aria-label="Admin language">
      <button type="button" style={btn(lang === 'en')} onClick={() => setLang('en')}>EN</button>
      <button type="button" style={btn(lang === 'id')} onClick={() => setLang('id')}>ID</button>
    </div>
  );
}
