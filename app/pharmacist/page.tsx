import { AuthService } from '@/services/auth.service';
import { redirect } from 'next/navigation';
import { PharmacistContainer } from '@/components/pharmacist/PharmacistContainer';
import { OrderRepository } from '@/repositories/order.repository';

export default async function PharmacistPage() {
  const session = await AuthService.getSession();
  
  if (!session || (session.role !== 'PHARMA' && session.role !== 'ADMIN')) {
    redirect('/login');
  }

  // To be implemented: Fetch real data for pharmacist
  const orders = await OrderRepository.findAll();
  
  return (
    <PharmacistContainer 
      currentUser={session}
      initialOrders={orders}
    />
  );
}
