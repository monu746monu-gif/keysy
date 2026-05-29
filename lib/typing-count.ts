export const TYPING_COUNT_KEY = "keysy-typing-count"
export const TYPING_COUNT_CHANGE_EVENT = "keysy-typing-count-change"

const TYPING_COUNT_API = "/api/typing-count"
const FLUSH_INTERVAL_MS = 1500
const FLUSH_BATCH_SIZE = 10

let pendingIncrements = 0
let flushTimer: ReturnType<typeof setTimeout> | null = null
let lifecycleListenersInstalled = false

export function readTypingCount(): number {
  if (typeof window === "undefined") return 0

  const saved = window.localStorage.getItem(TYPING_COUNT_KEY)
  const parsed = saved ? Number.parseInt(saved, 10) : 0
  return Number.isFinite(parsed) ? parsed : 0
}

export async function readGlobalTypingCount(): Promise<number> {
  if (typeof window === "undefined") return 0

  try {
    const response = await fetch(TYPING_COUNT_API, { cache: "no-store" })
    if (!response.ok) return readTypingCount()

    const data = await response.json() as { count?: unknown }
    const serverCount = typeof data.count === "number" && Number.isFinite(data.count)
      ? data.count
      : 0
    const count = Math.max(serverCount, readTypingCount())
    writeTypingCount(count)
    return count
  } catch {
    return readTypingCount()
  }
}

export function incrementTypingCount(): number {
  if (typeof window === "undefined") return 0

  const next = readTypingCount() + 1
  writeTypingCount(next)
  emitTypingCountChange(next)
  queueTypingCountIncrement()
  return next
}

function queueTypingCountIncrement() {
  installLifecycleFlushListeners()
  pendingIncrements += 1

  if (pendingIncrements >= FLUSH_BATCH_SIZE) {
    flushTypingCount()
    return
  }

  if (!flushTimer) {
    flushTimer = setTimeout(flushTypingCount, FLUSH_INTERVAL_MS)
  }
}

function flushTypingCount() {
  if (typeof window === "undefined" || pendingIncrements <= 0) return

  if (flushTimer) {
    clearTimeout(flushTimer)
    flushTimer = null
  }

  const increment = pendingIncrements
  pendingIncrements = 0
  const body = JSON.stringify({ increment })

  if (navigator.sendBeacon) {
    const sent = navigator.sendBeacon(
      TYPING_COUNT_API,
      new Blob([body], { type: "application/json" }),
    )
    if (sent) return
  }

  fetch(TYPING_COUNT_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {
    pendingIncrements += increment
  })
}

function writeTypingCount(count: number) {
  window.localStorage.setItem(TYPING_COUNT_KEY, String(count))
}

function emitTypingCountChange(count: number) {
  window.dispatchEvent(new CustomEvent(TYPING_COUNT_CHANGE_EVENT, { detail: count }))
}

function installLifecycleFlushListeners() {
  if (lifecycleListenersInstalled || typeof window === "undefined") return

  lifecycleListenersInstalled = true
  window.addEventListener("pagehide", flushTypingCount)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushTypingCount()
  })
}
