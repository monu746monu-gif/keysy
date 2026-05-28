export const TYPING_COUNT_KEY = "keysy-typing-count"

export function readTypingCount(): number {
  if (typeof window === "undefined") return 0

  const saved = window.localStorage.getItem(TYPING_COUNT_KEY)
  const parsed = saved ? Number.parseInt(saved, 10) : 0
  return Number.isFinite(parsed) ? parsed : 0
}

export function incrementTypingCount(): number {
  if (typeof window === "undefined") return 0

  const next = readTypingCount() + 1
  window.localStorage.setItem(TYPING_COUNT_KEY, String(next))
  return next
}
