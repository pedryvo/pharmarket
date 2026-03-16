import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws
neonConfig.pipelineConnect = false

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    console.error('DB INIT ERROR: DATABASE_URL environment variable is missing!')
    throw new Error('DATABASE_URL is required')
  }

  try {
    console.log('DB INIT: Attempting connection to Neon...')
    const pool = new Pool({ connectionString })
    const adapter = new PrismaNeon(pool as any)
    const client = new PrismaClient({ adapter })
    console.log('DB INIT: PrismaClient initialized with Neon adapter.')
    return client
  } catch (err) {
    console.error('DB INIT ERROR: Failed to initialize PrismaClient:', err)
    throw err
  }
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
