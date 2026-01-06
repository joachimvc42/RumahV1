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
    const checkAdmin = async () => {
      const { data: auth } = await supabase.auth.getUser();

      if (!auth.user) {
        router.replace('/admin/login');
        return;
      }

      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', auth.user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        router.replace('/admin/login');
        return;
      }

      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) return null;

  return <>{children}</>;
}
