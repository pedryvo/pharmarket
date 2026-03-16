import { ProductRepository } from '@/repositories/product.repository';
import { CategoryRepository } from '@/repositories/category.repository';
import { PartnerRepository } from '@/repositories/partner.repository';
import { PlatformSettingRepository } from '@/repositories/platform-setting.repository';
import { UserRepository } from '@/repositories/user.repository';
import { OrderRepository } from '@/repositories/order.repository';
import type { Prisma } from '@prisma/client';

export class AdminService {
  // Products
  static async createProduct(data: any) {
    return ProductRepository.create(data);
  }

  static async updateProduct(id: number, data: any) {
    return ProductRepository.update(id, data);
  }

  static async deleteProduct(id: number) {
    return ProductRepository.delete(id);
  }

  // Categories
  static async createCategory(data: any) {
    return CategoryRepository.create(data);
  }

  static async updateCategory(id: string, data: any) {
    return CategoryRepository.update(id, data);
  }

  static async deleteCategory(id: string) {
    return CategoryRepository.delete(id);
  }

  // Partners
  static async createPartner(data: any) {
    return PartnerRepository.create(data);
  }

  static async updatePartner(id: number, data: any) {
    return PartnerRepository.update(id, data);
  }

  static async deletePartner(id: number) {
    return PartnerRepository.delete(id);
  }

  // Settings
  static async updateSettings(data: any) {
    return PlatformSettingRepository.updateSettings(data);
  }

  // Users
  static async updateUser(id: string, data: any) {
    return UserRepository.update(id, data);
  }

  static async deleteUser(id: string) {
    return UserRepository.delete(id);
  }

  // Dashboard Data
  static async getDashboardData() {
    const [products, categories, settings, users, partners, orders] = await Promise.all([
      ProductRepository.findAll({ includeInactive: true }),
      CategoryRepository.findAll(),
      PlatformSettingRepository.getSettings(),
      UserRepository.findAll(),
      PartnerRepository.findAll(),
      OrderRepository.findAll()
    ]);

    return {
      products,
      categories,
      settings,
      users,
      partners,
      orders
    };
  }

  // Orders
  static async updateOrderStatus(id: string, status: any, note?: string) {
    return OrderRepository.updateStatus(id, status, note);
  }

  static async deleteOrder(id: string) {
    return OrderRepository.delete(id);
  }
}
