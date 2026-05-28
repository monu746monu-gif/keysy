"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/utils"

export interface MacBookMockupProps {
  videoSrc?: string
  children?: React.ReactNode
  className?: string
}

export function MacBookMockup({ videoSrc, children, className }: MacBookMockupProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={cn("relative mx-auto w-full max-w-4xl", className)}
    >
      <div className="relative rounded-t-[1.6rem] bg-zinc-950 p-2 shadow-[0_32px_80px_rgba(0,0,0,0.28)] ring-1 ring-black/20 md:p-3">
        <div className="pointer-events-none absolute left-1/2 top-2 z-20 h-4 w-24 -translate-x-1/2 rounded-b-xl bg-zinc-950 md:top-3 md:h-5 md:w-32" />
        <div className="pointer-events-none absolute inset-x-8 top-1 h-px bg-white/20" />

        <div className="relative aspect-[16/10] overflow-hidden rounded-t-[1rem] rounded-b-md bg-black ring-1 ring-white/10">
          {videoSrc ? (
            <video
              className="h-full w-full object-cover"
              src={videoSrc}
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <div className="h-full w-full">{children}</div>
          )}
        </div>
      </div>

      <div className="relative mx-auto h-5 w-[108%] -translate-x-[3.7%] rounded-b-[2rem] bg-gradient-to-b from-zinc-200 via-zinc-300 to-zinc-400 shadow-[0_18px_42px_rgba(0,0,0,0.22)] ring-1 ring-black/10 md:h-7">
        <div className="absolute left-1/2 top-0 h-2 w-28 -translate-x-1/2 rounded-b-xl bg-zinc-400/70 md:h-2.5 md:w-40" />
        <div className="absolute inset-x-8 top-0 h-px bg-white/80" />
      </div>
    </motion.div>
  )
}
