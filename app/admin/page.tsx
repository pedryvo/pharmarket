import { AuthService } from '@/services/auth.service';
import { redirect } from 'next/navigation';
import { AdminService } from '@/services/admin.service';
import { AdminContainer } from '@/components/admin/AdminContainer';

export default async function AdminDashboard() {
  const session = await AuthService.getSession();
  if (!session || session.role !== 'ADMIN') redirect('/');

  const initialData = await AdminService.getDashboardData();

  return (
    <AdminContainer 
      session={session} 
      initialData={initialData} 
    />
  );
}
