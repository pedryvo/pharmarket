import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    throw new Error('DATABASE_URL is missing in environment variables')
  }

  // Use standard pg Pool for better stability in Node.js environments
  const pool = new pg.Pool({ 
    connectionString,
    connectionTimeoutMillis: 10000, // Increased timeout for Neon cold starts
    max: 1 // Recommended for serverless to avoid connection exhaustion
  })

  // Use the Prisma standard PG adapter
  const adapter = new PrismaPg(pool as any)
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
