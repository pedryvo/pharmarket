import prisma from '@/lib/db'
import type { Prisma, Role } from '@prisma/client'

export class UserRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email }
    })
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id }
    })
  }

  static async create(data: Prisma.UserCreateInput) {
    return prisma.user.create({ data })
  }

  static async findAll() {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    })
  }

  static async update(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id },
      data
    })
  }

  static async delete(id: string) {
    return prisma.user.delete({
      where: { id }
    })
  }
}
