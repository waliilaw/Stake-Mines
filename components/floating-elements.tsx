"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

export default function FloatingElements() {
  const [elements, setElements] = useState<
    Array<{
      id: number
      x: number
      y: number
      rotation: number
      scale: number
      type: "diamond" | "mine" | "money"
    }>
  >([])

  useEffect(() => {
    // Create random floating elements
    const newElements = []
    const count = 15

    for (let i = 0; i < count; i++) {
      newElements.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1.5,
        type: ["diamond", "mine", "money"][Math.floor(Math.random() * 3)] as "diamond" | "mine" | "money",
      })
    }

    setElements(newElements)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element) => (
        <motion.div
          key={element.id}
          className="absolute opacity-20"
          style={{
            left: `${element.x}%`,
            top: `${element.y}%`,
          }}
          animate={{
            y: ["-20px", "20px"],
            x: ["-20px", "20px"],
            rotate: [element.rotation, element.rotation + 40],
          }}
          transition={{
            y: {
              duration: 3 + Math.random() * 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            },
            x: {
              duration: 4 + Math.random() * 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
            },
            rotate: {
              duration: 10 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
          }}
        >
          {element.type === "diamond" && (
            <Image
              src="/images/diamond.png"
              alt="Diamond"
              width={40 * element.scale}
              height={40 * element.scale}
              className="drop-shadow-glow"
            />
          )}

          {element.type === "mine" && (
            <Image
              src="/images/mine.png"
              alt="Mine"
              width={40 * element.scale}
              height={40 * element.scale}
              className="drop-shadow-red"
            />
          )}

          
        </motion.div>
      ))}
    </div>
  )
}

