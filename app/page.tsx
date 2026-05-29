"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import {
  readGlobalTypingCount,
  readTypingCount,
  TYPING_COUNT_CHANGE_EVENT,
} from "@/lib/typing-count"
import { readStoredCoins } from "@/lib/coins"
import { CoinBadge } from "@/components/coin-rewards"
import { MacBookMockup } from "@/components/macbook-mockup"

export default function Page() {
  const [tryCount, setTryCount] = useState(0)
  const [coins, setCoins] = useState(0)

  useEffect(() => {
    const refreshTypingCount = () => {
      void readGlobalTypingCount().then(setTryCount)
    }
    const handleTypingCountChange = () => {
      setTryCount(readTypingCount())
    }
    const handleStorage = (event: StorageEvent) => {
      if (event.key === "keysy-typing-count") {
        setTryCount(readTypingCount())
      }
    }
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refreshTypingCount()
    }

    refreshTypingCount()
    window.addEventListener(TYPING_COUNT_CHANGE_EVENT, handleTypingCountChange)
    window.addEventListener("storage", handleStorage)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    const refreshTimer = window.setInterval(refreshTypingCount, 15000)

    const timer = window.setTimeout(() => {
      setCoins(readStoredCoins())
    }, 0)

    return () => {
      window.clearTimeout(timer)
      window.clearInterval(refreshTimer)
      window.removeEventListener(TYPING_COUNT_CHANGE_EVENT, handleTypingCountChange)
      window.removeEventListener("storage", handleStorage)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  return (
    <>
      <CoinBadge coins={coins} />
      <main className="flex flex-1 items-center bg-white px-6 py-12 text-black md:px-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <MacBookMockup videoSrc="/keeby-demo.mp4" className="order-1" />

          <section className="order-2 flex flex-col items-center text-center lg:items-start lg:text-left">
            <Image
              src="/keysy-logo.png"
              alt="Keysy logo"
              width={192}
              height={115}
              priority
              className="mb-5 h-24 w-40 object-contain md:h-28 md:w-48"
            />
            <div className="flex max-w-xl flex-col items-center gap-3 lg:items-start">
              <div className="flex flex-col items-center gap-4 md:flex-row md:items-end lg:items-center">
                <h1
                  className="text-5xl font-light leading-tight text-[#f97316] md:text-7xl"
                  style={{
                    fontFamily: "'Comic Sans MS', 'Trebuchet MS', cursive",
                  }}
                >
                  Your keyboard, but better
                </h1>
                <div className="relative shrink-0 pt-10">
                  <div className="absolute -top-1 left-1/2 z-10 w-max max-w-36 -translate-x-1/2 rounded-2xl border border-orange-200 bg-white px-3 py-2 text-center text-xs font-bold text-orange-950 shadow-lg shadow-orange-950/10">
                    helllo are u ready?
                    <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-r border-b border-orange-200 bg-white" />
                  </div>
                  <Image
                    src="/111-sticker.png"
                    alt=""
                    width={124}
                    height={128}
                    className="h-24 w-24 object-contain drop-shadow-xl md:h-28 md:w-28"
                  />
                </div>
              </div>
            </div>
            <div className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-black/60">
              typing count{" "}
              <span className="font-semibold text-black">{tryCount}</span>
            </div>
            <Link
              href="/typing"
              className="mt-7 rounded-full bg-[#f97316] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition-transform hover:scale-[1.03] hover:bg-[#ea580c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316] focus-visible:ring-offset-2"
            >
              Try it
            </Link>
          </section>
        </div>
      </main>
    </>
  )
}
