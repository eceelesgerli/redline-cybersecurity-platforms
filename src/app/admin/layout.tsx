import { redirect } from 'next/navigation';
import { getCurrentAdmin } from '@/lib/auth';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  if (!admin) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminSidebar admin={admin} />
      <main className="flex-1 p-8 ml-64">
        {children}
      </main>
    </div>
  );
}
