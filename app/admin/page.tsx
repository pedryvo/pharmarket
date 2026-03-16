import { AuthService } from '@/services/auth.service';
import { redirect } from 'next/navigation';
import { AdminContainer } from '@/components/admin/AdminContainer';
import { ProductRepository } from '@/repositories/product.repository';
import { CategoryRepository } from '@/repositories/category.repository';
import { PlatformSettingRepository } from '@/repositories/platform-setting.repository';
import { UserRepository } from '@/repositories/user.repository';
import { PartnerRepository } from '@/repositories/partner.repository';
import { OrderRepository } from '@/repositories/order.repository';

export default async function AdminDashboard() {
  const session = await AuthService.getSession();
  if (!session || session.role !== 'ADMIN') redirect('/');

  const [products, categories, settings, users, partners, orders] = await Promise.all([
    ProductRepository.findAll({ includeInactive: true }),
    CategoryRepository.findAll(),
    PlatformSettingRepository.getSettings(),
    UserRepository.findAll(),
    PartnerRepository.findAll(),
    OrderRepository.findAll()
  ]);

  return (
    <AdminContainer 
      session={session} 
      initialData={{
        products,
        categories,
        settings,
        users,
        partners,
        orders
      }} 
    />
  );
}
