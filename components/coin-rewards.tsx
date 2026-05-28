"use client"

import { AnimatePresence, motion } from "motion/react"

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
    <div className="fixed right-4 top-20 z-40 flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-50 px-3 py-2 font-mono text-sm font-bold text-yellow-950 shadow-lg shadow-yellow-950/10">
      <CoinIcon className="h-6 w-6" />
      <span className="tabular-nums">{coins}</span>
    </div>
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
          className="fixed left-1/2 top-24 z-50 w-[min(92vw,24rem)] -translate-x-1/2"
        >
          <div className="overflow-hidden rounded-2xl border border-yellow-500/30 bg-white shadow-2xl shadow-yellow-950/15">
            <div className="flex items-center gap-3 px-5 py-4">
              <motion.div
                initial={{ rotate: -18, scale: 0.7 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.08, type: "spring", stiffness: 500, damping: 18 }}
              >
                <CoinIcon className="h-11 w-11 text-xl" />
              </motion.div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-zinc-950">{message}</p>
                <p className="mt-0.5 text-xs font-medium text-zinc-500">
                  {reward > 0 ? "Accuracy bonus added to your balance." : "Keep practicing to unlock rewards."}
                </p>
              </div>
            </div>
            <motion.div
              className="h-1 bg-yellow-300"
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
