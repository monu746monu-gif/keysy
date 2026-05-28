"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { readTypingCount } from "@/lib/typing-count"
import { MacBookMockup } from "@/components/macbook-mockup"

export default function Page() {
  const [tryCount, setTryCount] = useState(0)

  useEffect(() => {
    setTryCount(readTypingCount())
  }, [])

  return (
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
          <h1
            className="max-w-xl text-5xl font-light leading-tight text-[#f97316] md:text-7xl"
            style={{ fontFamily: "'Comic Sans MS', 'Trebuchet MS', cursive" }}
          >
            Your keyboard, but better
          </h1>
          <div className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-black/60">
            typing count <span className="font-semibold text-black">{tryCount}</span>
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
  )
}
