"use server";

import { ProductRepository } from '@/repositories/product.repository';
import { CategoryRepository } from '@/repositories/category.repository';
import { PartnerRepository } from '@/repositories/partner.repository';
import { PlatformSettingRepository } from '@/repositories/platform-setting.repository';
import type { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { AuthService } from '@/services/auth.service';

async function ensureAdmin() {
  const session = await AuthService.getSession();
  if (!session || session.role !== 'ADMIN') {
    throw new Error('Não autorizado');
  }
}

async function ensureStaff() {
  const session = await AuthService.getSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'PHARMA')) {
    throw new Error('Não autorizado');
  }
}

// Products
export async function createProductAction(data: any) {
  await ensureAdmin();
  await ProductRepository.create(data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateProductAction(id: number, data: any) {
  await ensureAdmin();
  await ProductRepository.update(id, data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteProductAction(id: number) {
  await ensureAdmin();
  await ProductRepository.delete(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

// Categories
export async function createCategoryAction(data: any) {
  await ensureAdmin();
  await CategoryRepository.create(data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateCategoryAction(id: string, data: any) {
  await ensureAdmin();
  await CategoryRepository.update(id, data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteCategoryAction(id: string) {
  await ensureAdmin();
  await CategoryRepository.delete(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

// Partners
export async function createPartnerAction(data: any) {
  await ensureAdmin();
  await PartnerRepository.create(data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updatePartnerAction(id: number, data: any) {
  await ensureAdmin();
  await PartnerRepository.update(id, data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deletePartnerAction(id: number) {
  await ensureAdmin();
  await PartnerRepository.delete(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

// Settings
export async function updateSettingsAction(data: any) {
  await ensureAdmin();
  await PlatformSettingRepository.updateSettings(data);
  revalidatePath('/');
  revalidatePath('/admin');
}

// Orders
export async function updateOrderStatusAction(id: string, status: any, note?: string) {
  await ensureStaff();
  const { OrderRepository } = await import('@/repositories/order.repository');
  await OrderRepository.updateStatus(id, status, note);
  revalidatePath('/admin');
  revalidatePath('/pharmacist');
}
