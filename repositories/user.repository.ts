import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export class UserRepository {
  static async findByUsername(username: string) {
    return prisma.user.findUnique({
      where: { username }
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

  static async findAllByRole(role: Prisma.EnumRoleFilter) {
    return prisma.user.findMany({
      where: { role }
    })
  }
}
