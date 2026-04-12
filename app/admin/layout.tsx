/**
 * Parent layout for /admin: no auth here so /admin/login can render immediately.
 * Protected routes live under @/app/admin/(protected)/layout.tsx
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
