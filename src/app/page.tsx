'use client'

import Hero from '@/src/components/Hero'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    const script = document.querySelector('script[src="https://unpkg.com/aos@2.3.1/dist/aos.js"]')
    if (typeof window !== 'undefined' && (window as any).AOS) {
      (window as any).AOS.init()
    }
  }, [])

  return (
    <main>
      <Hero />
    </main>
  )
}
