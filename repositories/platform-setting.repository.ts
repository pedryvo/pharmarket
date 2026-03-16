import prisma from '@/lib/db'
import { Prisma } from '@prisma/client'

export class PlatformSettingRepository {
  static async getSettings() {
    return prisma.platformSetting.findFirst({
      where: { id: 1 }
    })
  }

  static async updateSettings(data: Prisma.PlatformSettingUpdateInput) {
    return prisma.platformSetting.update({
      where: { id: 1 },
      data
    })
  }

  static async ensureInitialized() {
    const exists = await prisma.platformSetting.findFirst({ where: { id: 1 } })
    if (!exists) {
      await prisma.platformSetting.create({
        data: { id: 1 }
      })
    }
  }
}
