import { PrismaClient } from '@prisma/client'

// Prisma error codes for transient connection problems (pooler blips, project
// waking from pause, brief network drops).
const TRANSIENT_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017'])

// Only retry READ operations — replaying a write on a connection that dropped
// mid-operation risks a duplicate. Reads are idempotent and safe to replay.
const READ_OPS = new Set([
  'findFirst', 'findFirstOrThrow', 'findUnique', 'findUniqueOrThrow',
  'findMany', 'count', 'aggregate', 'groupBy',
])

function makePrisma() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  }).$extends({
    query: {
      async $allOperations({ operation, args, query }) {
        const canRetry = READ_OPS.has(operation)
        let lastError: unknown
        for (let attempt = 0; attempt < 3; attempt++) {
          try {
            return await query(args)
          } catch (err) {
            lastError = err
            const code = (err as { code?: string })?.code
            if (!canRetry || !code || !TRANSIENT_CODES.has(code)) throw err
            // brief backoff: 200ms, 400ms
            await new Promise((r) => setTimeout(r, 200 * (attempt + 1)))
          }
        }
        throw lastError
      },
    },
  })
}

type ExtendedPrisma = ReturnType<typeof makePrisma>

const globalForPrisma = globalThis as unknown as { prisma?: ExtendedPrisma }

export const prisma = globalForPrisma.prisma ?? makePrisma()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
