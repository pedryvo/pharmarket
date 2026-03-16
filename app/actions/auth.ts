"use server";

import { AuthService } from '@/services/auth.service';
import { redirect } from 'next/navigation';

export async function logoutAction() {
  await AuthService.logout();
  redirect('/login');
}
