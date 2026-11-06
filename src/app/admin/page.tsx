import type { Metadata } from 'next';
import AdminPanel from '@/components/admin/AdminPanel';

// The footer links here, so crawlers will find it: keep it out of search results
export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};

export default function AdminPage() {
  return <AdminPanel />;
}
