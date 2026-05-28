import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const DATA_PATH = path.join(process.cwd(), "data", "typing-count.json")
const REDIS_KEY = "keysy:typing-count"

type CountFile = {
  count: number
}

export async function GET() {
  return NextResponse.json({ count: await readCount() })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { increment?: unknown } | null
  const increment = normalizeIncrement(body?.increment)

  if (increment <= 0) {
    return NextResponse.json({ count: await readCount() })
  }

  return NextResponse.json({ count: await addCount(increment) })
}

function normalizeIncrement(value: unknown) {
  const increment = typeof value === "number" ? Math.floor(value) : 0
  if (!Number.isFinite(increment)) return 0
  return Math.max(0, Math.min(increment, 1000))
}

async function readCount() {
  if (hasRedisConfig()) {
    const result = await redisCommand<number | string | null>(["GET", REDIS_KEY])
    const parsed = typeof result === "number" ? result : Number.parseInt(result ?? "0", 10)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return readFileCount()
}

async function addCount(increment: number) {
  if (hasRedisConfig()) {
    const result = await redisCommand<number>(["INCRBY", REDIS_KEY, increment])
    return typeof result === "number" && Number.isFinite(result) ? result : readCount()
  }

  const current = await readFileCount()
  const next = current + increment
  await writeFileCount(next)
  return next
}

function hasRedisConfig() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
}

async function redisCommand<T>(command: Array<string | number>): Promise<T> {
  const response = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([command]),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error(`Redis command failed: ${response.status}`)
  }

  const data = await response.json() as Array<{ result: T }>
  return data[0]?.result
}

async function readFileCount() {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf8")
    const data = JSON.parse(raw) as CountFile
    return typeof data.count === "number" && Number.isFinite(data.count) ? data.count : 0
  } catch {
    return 0
  }
}

async function writeFileCount(count: number) {
  await fs.mkdir(path.dirname(DATA_PATH), { recursive: true })
  await fs.writeFile(DATA_PATH, JSON.stringify({ count }, null, 2))
}
