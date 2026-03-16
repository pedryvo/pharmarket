import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws
neonConfig.pipelineConnect = false

const prismaClientSingleton = () => {
  const connectionString = `${process.env.DATABASE_URL || ''}`
  console.log('DB INIT: URL length:', connectionString.length, 'ends with:', connectionString.slice(-10))
  
  if (!connectionString) {
    console.warn('DB INIT: DATABASE_URL is missing!')
  }

  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool as any)
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
