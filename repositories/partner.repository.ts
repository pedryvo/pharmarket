import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export class PartnerRepository {
  static async findAll() {
    return prisma.partner.findMany({
      include: {
        pharmacist: {
          select: { name: true, email: true }
        }
      }
    })
  }

  static async findAllActive() {
    return prisma.partner.findMany({
      where: { active: true },
      include: {
        pharmacist: {
          select: { name: true, email: true }
        }
      }
    })
  }

  static async findById(id: number) {
    return prisma.partner.findUnique({
      where: { id },
      include: {
        pharmacist: true
      }
    })
  }

  static async create(data: Prisma.PartnerCreateInput) {
    return prisma.partner.create({ data })
  }

  static async update(id: number, data: Prisma.PartnerUpdateInput) {
    return prisma.partner.update({
      where: { id },
      data
    })
  }

  static async delete(id: number) {
    return prisma.partner.delete({
      where: { id }
    })
  }
}
