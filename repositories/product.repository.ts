import prisma from '@/lib/db'
import type { Prisma } from '@prisma/client'

export class ProductRepository {
  static async findAll(filters: { categoryId?: string; search?: string; partnerId?: number; includeInactive?: boolean } = {}) {
    const { categoryId, search, partnerId, includeInactive } = filters
    
    return prisma.product.findMany({
      where: {
        AND: [
          includeInactive ? {} : { active: true },
          categoryId ? { categoryId } : {},
          partnerId ? { partnerId } : {},
          search ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { desc: { contains: search, mode: 'insensitive' } },
            ]
          } : {}
        ]
      },
      include: {
        category: true
      },
      orderBy: {
        name: 'asc'
      }
    })
  }

  static async findById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true
      }
    })
  }

  static async create(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data })
  }

  static async update(id: number, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({
      where: { id },
      data
    })
  }

  static async delete(id: number) {
    return prisma.product.delete({
      where: { id }
    })
  }
}
