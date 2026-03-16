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

  static async findAllByClient(clientUsername: string) {
    return prisma.order.findMany({
      where: { clientUsername },
      orderBy: { date: 'desc' },
      include: {
        items: true
      }
    })
  }

  static async findAllByPharmacist(pharmacistUsername: string) {
    return prisma.order.findMany({
      where: {
        partner: {
          pharmacistUsername
        }
      },
      orderBy: { date: 'desc' },
      include: {
        items: true,
        client: true
      }
    })
  }

  static async updateStatus(id: string, status: OrderStatus, pharmacistNote?: string) {
    return prisma.order.update({
      where: { id },
      data: {
        status,
        pharmacistNote
      }
    })
  }

  static async findAll() {
    return prisma.order.findMany({
      orderBy: { date: 'desc' },
      include: {
        client: true,
        partner: true
      }
    })
  }
}
