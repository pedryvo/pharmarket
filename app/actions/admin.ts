"use server";

import { AdminService } from '@/services/admin.service';
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
  await AdminService.createProduct(data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateProductAction(id: number, data: any) {
  await ensureAdmin();
  await AdminService.updateProduct(id, data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteProductAction(id: number) {
  await ensureAdmin();
  await AdminService.deleteProduct(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

// Categories
export async function createCategoryAction(data: any) {
  await ensureAdmin();
  await AdminService.createCategory(data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updateCategoryAction(id: string, data: any) {
  await ensureAdmin();
  await AdminService.updateCategory(id, data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deleteCategoryAction(id: string) {
  await ensureAdmin();
  await AdminService.deleteCategory(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

// Partners
export async function createPartnerAction(data: any) {
  await ensureAdmin();
  await AdminService.createPartner(data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function updatePartnerAction(id: number, data: any) {
  await ensureAdmin();
  await AdminService.updatePartner(id, data);
  revalidatePath('/');
  revalidatePath('/admin');
}

export async function deletePartnerAction(id: number) {
  await ensureAdmin();
  await AdminService.deletePartner(id);
  revalidatePath('/');
  revalidatePath('/admin');
}

// Settings
export async function updateSettingsAction(data: any) {
  await ensureAdmin();
  await AdminService.updateSettings(data);
  revalidatePath('/');
  revalidatePath('/admin');
}

// Orders
export async function updateOrderStatusAction(id: string, status: any, note?: string) {
  await ensureStaff();
  await AdminService.updateOrderStatus(id, status, note);
  revalidatePath('/admin');
  revalidatePath('/pharmacist');
}

export async function deleteOrderAction(id: string) {
  await ensureAdmin();
  await AdminService.deleteOrder(id);
  revalidatePath('/admin');
}

// Users
export async function updateUserAction(id: string, data: any) {
  await ensureAdmin();
  await AdminService.updateUser(id, data);
  revalidatePath('/admin');
}

export async function deleteUserAction(id: string) {
  await ensureAdmin();
  await AdminService.deleteUser(id);
  revalidatePath('/admin');
}
