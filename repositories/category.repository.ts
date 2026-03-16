import prisma from '@/lib/db'
import type { Prisma } from '@prisma/client'

export class CategoryRepository {
  static async findAll() {
    return prisma.category.findMany({
      orderBy: {
        label: 'asc'
      }
    })
  }

  static async findById(id: string) {
    return prisma.category.findUnique({
      where: { id }
    })
  }

  static async create(data: { id: string; label: string; bg: string; color: string }) {
    return prisma.category.create({ data })
  }

  static async update(id: string, data: Prisma.CategoryUpdateInput) {
    return prisma.category.update({
      where: { id },
      data
    })
  }

  static async delete(id: string) {
    return prisma.category.delete({
      where: { id }
    })
  }
}
