import prisma from '@/lib/db'

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

  static async create(data: { id: string; label: string; ico: string; bg: string; color: string }) {
    return prisma.category.create({ data })
  }
}
