import prisma from '@/lib/db'
import { Prisma, OrderStatus } from '@prisma/client'

export class OrderRepository {
  static async create(data: Prisma.OrderCreateInput) {
    return prisma.order.create({
      data,
      include: {
        items: true
      }
    })
  }

  static async findById(id: string) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        partner: true,
        client: true
      }
    })
  }

  static async findAllByClient(clientEmail: string) {
    return prisma.order.findMany({
      where: { clientEmail },
      include: { items: true, partner: true },
      orderBy: { date: 'desc' }
    })
  }

  static async findAllByPharmacist(pharmacistEmail: string) {
    return prisma.order.findMany({
      where: {
        partner: {
          pharmacistEmail
        }
      },
      orderBy: { date: 'desc' },
      include: {
        items: true,
        client: true,
        partner: true
      }
    })
  }

  static async updateStatus(id: string, status: OrderStatus, pharmacistNote?: string) {
    return prisma.order.update({
      where: { id },
      data: {
        status,
        pharmacistNote
      },
      include: {
        items: true,
        client: true,
        partner: true
      }
    })
  }

  static async findAll() {
    return prisma.order.findMany({
      orderBy: { date: 'desc' },
      include: {
        client: true,
        partner: true,
        items: true
      }
    })
  }

  static async delete(id: string) {
    return prisma.order.delete({
      where: { id }
    })
  }
}
