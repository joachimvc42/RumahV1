'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user || user.user_metadata?.role !== 'admin') {
        router.replace('/admin/login');
      } else {
        setLoading(false);
      }
    });
  }, [router]);

  if (loading) return null;

  return <>{children}</>;
}
