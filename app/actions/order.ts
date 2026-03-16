"use server";

import { OrderService } from '@/services/order.service';
import { ProductRepository } from '@/repositories/product.repository';
import { OrderRepository } from '@/repositories/order.repository';
import { AuthService } from '@/services/auth.service';
import { revalidatePath } from 'next/cache';

export async function createOrderAction(data: {
  formulaName: string;
  form: string;
  caps: number;
  partnerId: number;
  items: { productId: number; dosePerCap: number }[];
}) {
  const session = await AuthService.getSession();
  if (!session) throw new Error('Não autenticado');

  const order = await OrderService.createOrder({
    ...data,
    clientEmail: session.email,
  }, ProductRepository);

  revalidatePath('/');
  return order;
}

export async function getClientOrdersAction() {
  const session = await AuthService.getSession();
  if (!session) throw new Error('Não autenticado');

  return OrderRepository.findAllByClient(session.email);
}
