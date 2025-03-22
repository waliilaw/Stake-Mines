"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

export default function useSound(isMuted: boolean) {
  const [soundsLoaded, setSoundsLoaded] = useState(false)
  const [userInteracted, setUserInteracted] = useState(false)
  const clickSoundRef = useRef<HTMLAudioElement | null>(null)
  const diamondSoundRef = useRef<HTMLAudioElement | null>(null)
  const bombSoundRef = useRef<HTMLAudioElement | null>(null)
  const cashoutSoundRef = useRef<HTMLAudioElement | null>(null)
  const startGameSoundRef = useRef<HTMLAudioElement | null>(null)
  const winSoundRef = useRef<HTMLAudioElement | null>(null)
  const loseSoundRef = useRef<HTMLAudioElement | null>(null)

  // Initialize audio elements
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Create audio elements but don't load them yet
      clickSoundRef.current = new Audio()
      diamondSoundRef.current = new Audio()
      bombSoundRef.current = new Audio()
      cashoutSoundRef.current = new Audio()
      startGameSoundRef.current = new Audio()
      winSoundRef.current = new Audio()
      loseSoundRef.current = new Audio()

      // Set sources but with preload="none" to avoid loading until needed
      if (clickSoundRef.current) clickSoundRef.current.src = "/sounds/click.mp3"
      if (diamondSoundRef.current) diamondSoundRef.current.src = "/sounds/diamond.mp3"
      if (bombSoundRef.current) bombSoundRef.current.src = "/sounds/bomb.mp3"
      if (cashoutSoundRef.current) cashoutSoundRef.current.src = "/sounds/cashout.mp3"
      if (startGameSoundRef.current) startGameSoundRef.current.src = "/sounds/start-game.mp3"
      if (winSoundRef.current) winSoundRef.current.src = "/sounds/win.mp3"
      if (loseSoundRef.current) loseSoundRef.current.src = "/sounds/lose.mp3"

      setSoundsLoaded(true)
    }

    // Listen for user interaction to enable sounds
    const handleUserInteraction = () => {
      setUserInteracted(true)
      // Remove event listeners after first interaction
      window.removeEventListener("click", handleUserInteraction)
      window.removeEventListener("touchstart", handleUserInteraction)
      window.removeEventListener("keydown", handleUserInteraction)
    }

    window.addEventListener("click", handleUserInteraction)
    window.addEventListener("touchstart", handleUserInteraction)
    window.addEventListener("keydown", handleUserInteraction)

    return () => {
      // Cleanup audio elements and event listeners
      clickSoundRef.current = null
      diamondSoundRef.current = null
      bombSoundRef.current = null
      cashoutSoundRef.current = null
      startGameSoundRef.current = null
      winSoundRef.current = null
      loseSoundRef.current = null

      window.removeEventListener("click", handleUserInteraction)
      window.removeEventListener("touchstart", handleUserInteraction)
      window.removeEventListener("keydown", handleUserInteraction)
    }
  }, [])

  const playSound = (soundRef: React.RefObject<HTMLAudioElement | null>) => {
    // Don't play if muted, sound not loaded, or no user interaction yet
    if (isMuted || !soundRef.current || !userInteracted || !soundsLoaded) return

    // Create a new audio element for each play to avoid issues with concurrent sounds
    const sound = new Audio(soundRef.current.src)

    // Play with promise handling for autoplay restrictions
    const playPromise = sound.play()

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Silently handle autoplay restrictions without console errors
        // This will happen if the browser still blocks despite our precautions
      })
    }
  }

  return {
    playClickSound: () => playSound(clickSoundRef),
    playDiamondSound: () => playSound(diamondSoundRef),
    playBombSound: () => playSound(bombSoundRef),
    playCashoutSound: () => playSound(cashoutSoundRef),
    playStartGameSound: () => playSound(startGameSoundRef),
    playWinSound: () => playSound(winSoundRef),
    playLoseSound: () => playSound(loseSoundRef),
    soundsEnabled: userInteracted && soundsLoaded && !isMuted,
  }
}

