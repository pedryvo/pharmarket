import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// Configure Neon to use the 'ws' package for WebSockets in Node.js
neonConfig.webSocketConstructor = ws

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL
  
  if (!connectionString) {
    throw new Error('DATABASE_URL is missing in environment variables')
  }

  // Create a connection pool for Neon
  const pool = new Pool({ 
    connectionString,
    connectionTimeoutMillis: 5000,
    max: 1 // In serverless, it's often better to keep few connections per instance
  })

  // Use the Prisma Neon adapter
  const adapter = new PrismaNeon(pool as any)
  return new PrismaClient({ adapter })
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
