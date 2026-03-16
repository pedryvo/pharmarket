import { ProductRepository } from '@/repositories/product.repository';
import { CategoryRepository } from '@/repositories/category.repository';
import { PartnerRepository } from '@/repositories/partner.repository';

export class CatalogService {
  static async getCatalog(filters: { categoryId?: string; search?: string } = {}) {
    const categories = await CategoryRepository.findAll();
    const products = await ProductRepository.findAll(filters);
    const partners = await PartnerRepository.findAllActive();
    
    return {
      categories,
      products,
      partners
    };
  }

  static async getProductDetails(id: number) {
    return ProductRepository.findById(id);
  }
}
