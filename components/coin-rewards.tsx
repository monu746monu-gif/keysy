"use client"

import { AnimatePresence, motion } from "motion/react"
import { TYPING_CARD_POINTS_TARGET } from "@/lib/coins"

interface CoinBadgeProps {
  coins: number
}

interface RewardPopupProps {
  message: string | null
  reward: number
}

function CoinIcon({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-flex items-center justify-center rounded-full bg-yellow-300 text-yellow-950 shadow-[inset_0_-2px_0_rgba(0,0,0,0.18)] ${className}`}
    >
      <span className="text-[0.72em] font-black leading-none">K</span>
    </span>
  )
}

export function CoinBadge({ coins }: CoinBadgeProps) {
  return (
    <button
      type="button"
      className="fixed right-4 top-3 z-50 flex cursor-default items-center gap-2 rounded-full border border-orange-300/70 bg-orange-100 px-3.5 py-2 font-mono text-sm font-bold text-orange-950 shadow-lg shadow-orange-950/10"
      aria-label={`Points earned: ${coins}`}
    >
      <CoinIcon className="h-6 w-6 bg-orange-300 text-orange-950" />
      <span className="text-xs uppercase text-orange-900/80">Points</span>
      <span className="tabular-nums">{coins}</span>
    </button>
  )
}

export function RewardPopup({ message, reward }: RewardPopupProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 18, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="fixed left-1/2 top-24 z-50 w-[min(92vw,25rem)] -translate-x-1/2"
        >
          <div className="relative overflow-hidden rounded-2xl border border-orange-300/70 bg-white shadow-2xl shadow-orange-950/15">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {["✿", "❀", "✽", "✿", "❀", "✽"].map((flower, index) => (
                <motion.span
                  key={`${flower}-${index}`}
                  aria-hidden
                  className="absolute text-lg text-orange-300"
                  initial={{ opacity: 0, x: "50%", y: "50%", scale: 0.4, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: `${index % 2 === 0 ? "-" : ""}${52 + index * 11}%`,
                    y: `${index < 3 ? "-" : ""}${34 + index * 7}%`,
                    scale: [0.4, 1.1, 0.9],
                    rotate: index % 2 === 0 ? 28 : -28,
                  }}
                  transition={{ duration: 2.8, delay: index * 0.08, ease: "easeOut" }}
                  style={{ left: "50%", top: "50%" }}
                >
                  {flower}
                </motion.span>
              ))}
            </div>
            <div className="relative flex items-center gap-3 px-5 py-4">
              <motion.div
                initial={{ rotate: -18, scale: 0.7 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.08, type: "spring", stiffness: 500, damping: 18 }}
              >
                <CoinIcon className="h-11 w-11 bg-orange-300 text-xl text-orange-950" />
              </motion.div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-950">
                  {message ?? `You won ${reward} points!`}
                </p>
                <p className="mt-0.5 text-xs font-medium text-zinc-500">
                  After {TYPING_CARD_POINTS_TARGET} points you will earn a typing card.
                </p>
              </div>
            </div>
            <motion.div
              className="h-1 bg-orange-300"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 3, ease: "linear" }}
              style={{ transformOrigin: "left" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
