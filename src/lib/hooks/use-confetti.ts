"use client"

import { useCallback, useRef } from "react"
import confetti from "canvas-confetti"

export default function useConfetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const createConfetti = useCallback((options?: confetti.Options) => {
    if (!canvasRef.current) {
      canvasRef.current = document.createElement("canvas")
      canvasRef.current.style.position = "fixed"
      canvasRef.current.style.inset = "0"
      canvasRef.current.style.width = "100%"
      canvasRef.current.style.height = "100%"
      canvasRef.current.style.pointerEvents = "none"
      canvasRef.current.style.zIndex = "9999"
      document.body.appendChild(canvasRef.current)
    }

    const myConfetti = confetti.create(canvasRef.current, {
      resize: true,
      useWorker: true,
    })

    myConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      ...options,
    })
  }, [])

  const fireworks = useCallback(() => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const interval: any = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)

      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      })

      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
      })
    }, 250)
  }, [])

  const schoolPride = useCallback(() => {
    const end = Date.now() + 5 * 1000

    // Green and pink colors for the mines game theme
    const colors = ["#00ff00", "#ff00ff"]
    ;(function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      })

      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    })()
  }, [])

  const realisticLook = useCallback(() => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
    }

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })

    fire(0.2, {
      spread: 60,
    })

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  }, [])

  const cleanup = useCallback(() => {
    if (canvasRef.current) {
      document.body.removeChild(canvasRef.current)
      canvasRef.current = null
    }
  }, [])

  return {
    createConfetti,
    fireworks,
    schoolPride,
    realisticLook,
    cleanup,
  }
}

