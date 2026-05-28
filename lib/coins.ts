export const COINS_STORAGE_KEY = "keysy-total-coins"
export const TYPING_CARD_POINTS_TARGET = 500

export function calculateCoinReward(): number {
  return 5
}

export function getCoinRewardMessage(reward: number): string {
  return `You won ${reward} points!`
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
