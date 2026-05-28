export const COINS_STORAGE_KEY = "keysy-total-coins"

export function calculateCoinReward(accuracy: number): number {
  if (accuracy >= 90) return 10
  if (accuracy >= 80) return 5
  return 0
}

export function getCoinRewardMessage(reward: number): string {
  if (reward > 0) return `You won ${reward} coins!`
  return "Try again! Get 80% accuracy to win coins."
}

export function readStoredCoins(): number {
  if (typeof window === "undefined") return 0

  const saved = window.localStorage.getItem(COINS_STORAGE_KEY)
  const parsed = saved ? Number.parseInt(saved, 10) : 0
  return Number.isFinite(parsed) ? parsed : 0
}

export function writeStoredCoins(coins: number) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(COINS_STORAGE_KEY, String(coins))
}
