'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

/**
 * Auth guard for routes under /admin except /admin/login (sibling route, not in this group).
 */
export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

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

      if (error || userRow?.role !== 'admin') {
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

  return <>{children}</>;
}
