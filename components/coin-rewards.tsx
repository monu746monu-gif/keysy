"use client"

import Image from "next/image"
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
      className="fixed right-4 top-3 z-50 flex cursor-default items-center gap-2 rounded-full border border-orange-300/70 bg-orange-100 py-2 pr-3.5 pl-2 font-mono text-sm font-bold text-orange-950 shadow-lg shadow-orange-950/10"
      aria-label={`Points earned: ${coins}`}
    >
      <Image
        src="/111-sticker.png"
        alt=""
        width={44}
        height={45}
        className="h-9 w-9 object-contain drop-shadow-sm"
      />
      <CoinIcon className="h-6 w-6 bg-orange-300 text-orange-950" />
      <span className="text-xs uppercase text-orange-900/80">Points</span>
      <span className="tabular-nums">{coins}</span>
    </button>
  )
}

export function RewardPopup({ message, reward }: RewardPopupProps) {
  const flowers = ["✿", "❀", "✽", "✿", "❀", "✽", "✿", "❀"]

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: 18, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className="fixed left-1/2 top-20 z-50 w-[min(92vw,34rem)] -translate-x-1/2"
        >
          <div className="relative overflow-hidden rounded-3xl border border-orange-300/70 bg-white shadow-2xl shadow-orange-950/20">
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {flowers.map((flower, index) => (
                <motion.span
                  key={`${flower}-${index}`}
                  aria-hidden
                  className="absolute text-xl text-orange-300"
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0.35, rotate: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: [
                      0,
                      index % 2 === 0 ? -80 - index * 12 : 76 + index * 12,
                    ],
                    y: [0, index < 4 ? -52 - index * 7 : 44 + index * 6],
                    scale: [0.35, 1.35, 0.9],
                    rotate: index % 2 === 0 ? 38 : -38,
                  }}
                  transition={{
                    duration: 2.8,
                    delay: index * 0.08,
                    ease: "easeOut",
                  }}
                  style={{ left: "6rem", top: "6rem" }}
                >
                  {flower}
                </motion.span>
              ))}
            </div>
            <div className="relative flex items-center gap-5 px-6 py-6 md:px-8 md:py-7">
              <motion.div
                initial={{ rotate: -16, scale: 0.55, y: 16 }}
                animate={{ rotate: [0, -5, 5, 0], scale: 1, y: [0, -5, 0] }}
                transition={{
                  rotate: {
                    duration: 1.4,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  },
                  scale: {
                    delay: 0.08,
                    type: "spring",
                    stiffness: 500,
                    damping: 18,
                  },
                  y: {
                    duration: 1.2,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                  },
                }}
                className="relative shrink-0 pt-9"
              >
                <div className="absolute top-0 left-1/2 z-10 w-max max-w-36 -translate-x-1/2 rounded-2xl border border-orange-200 bg-white px-3 py-2 text-center text-xs font-bold text-orange-950 shadow-lg shadow-orange-950/10">
                  see you soon again
                  <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r border-b border-orange-200 bg-white" />
                </div>
                <Image
                  src="/111-sticker.png"
                  alt=""
                  width={148}
                  height={153}
                  className="h-28 w-28 object-contain drop-shadow-xl md:h-32 md:w-32"
                />
              </motion.div>
              <div className="min-w-0">
                <p className="text-2xl font-black text-zinc-950 md:text-3xl">
                  You completed the test
                </p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-500 md:text-base">
                  {message ?? `You won ${reward} points!`} After{" "}
                  {TYPING_CARD_POINTS_TARGET} points you will earn a typing
                  card.
                </p>
              </div>
            </div>
            <motion.div
              className="h-1 bg-orange-300"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 5.2, ease: "linear" }}
              style={{ transformOrigin: "left" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
