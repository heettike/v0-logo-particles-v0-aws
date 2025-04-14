"use client"

import { useEffect, useRef, useState } from "react"
import { DollarSignPath } from "./dollar-sign-path"

export default function MoneyParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Initialize particles array BEFORE handleResize is defined
    const particles: {
      x: number
      y: number
      size: number
      originalX: number
      originalY: number
      vx: number
      vy: number
      color: string
      alpha: number
      speed: number
      type: "dollar" | "sparkle"
    }[] = []

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768)
      initParticles()
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    function initParticles() {
      particles.length = 0
      const logoPath = DollarSignPath()

      // Main color palette
      const colors = ["#30D5C8", "#20C5B8", "#40E5D8", "#10B5A8"]

      // Create particles from the dollar sign path
      for (let i = 0; i < logoPath.length; i += 2) {
        if (Math.random() > 0.3) {
          // Only use some of the points to avoid overcrowding
          particles.push({
            x: logoPath[i],
            y: logoPath[i + 1],
            originalX: logoPath[i],
            originalY: logoPath[i + 1],
            vx: (Math.random() - 0.5) * 1,
            vy: (Math.random() - 0.5) * 1,
            size: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 0.6 + Math.random() * 0.4,
            speed: 0.5 + Math.random() * 2,
            type: "dollar",
          })
        }
      }

      // Add some floating money symbols
      const symbols = ["$", "€", "£", "¥", "₿"]
      const symbolCount = Math.min(20, Math.floor(window.innerWidth / 50))

      for (let i = 0; i < symbolCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          originalX: Math.random() * canvas.width,
          originalY: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 1,
          vy: -0.5 - Math.random() * 1,
          size: Math.random() * 14 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.2 + Math.random() * 0.3,
          speed: 0.2 + Math.random() * 0.5,
          type: "sparkle",
        })
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw a subtle gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "rgba(0, 10, 10, 1)")
      gradient.addColorStop(1, "rgba(0, 0, 0, 1)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        // Mouse interaction
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - p.x
          const dy = mouseRef.current.y - p.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 150

          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance
            p.vx -= dx * force * 0.02
            p.vy -= dy * force * 0.02
          }
        }

        // Update position
        p.x += p.vx * p.speed
        p.y += p.vy * p.speed

        // Boundary check with bounce effect
        if (p.x < 0 || p.x > canvas.width) {
          p.vx *= -1
          p.x = p.x < 0 ? 0 : canvas.width
        }

        if (p.y < 0 || p.y > canvas.height) {
          p.vy *= -1
          p.y = p.y < 0 ? 0 : canvas.height
        }

        // Gradually return to original position for dollar sign particles
        if (p.type === "dollar") {
          p.vx += (p.originalX - p.x) * 0.003
          p.vy += (p.originalY - p.y) * 0.003

          // Dampen velocity
          p.vx *= 0.98
          p.vy *= 0.98

          // Draw particle
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = p.color
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.type === "sparkle") {
          // For money symbols, reset when they go off screen
          if (p.y < -20) {
            p.y = canvas.height + 20
            p.x = Math.random() * canvas.width
          }

          // Draw money symbol
          ctx.globalAlpha = p.alpha
          ctx.fillStyle = p.color
          ctx.font = `${p.size}px Arial`
          ctx.fillText("$", p.x, p.y)
        }
      }

      ctx.globalAlpha = 1
      requestAnimationFrame(animate)
    }

    // Mouse/touch interaction
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
      mouseRef.current.active = true
    }

    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX
        mouseRef.current.y = e.touches[0].clientY
        mouseRef.current.active = true
      }
    }

    const handleTouchEnd = () => {
      mouseRef.current.active = false
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mouseleave", handleMouseLeave)
    canvas.addEventListener("touchmove", handleTouchMove)
    canvas.addEventListener("touchend", handleTouchEnd)

    initParticles()
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mouseleave", handleMouseLeave)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleTouchEnd)
    }
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 touch-none" />

      <div className="absolute bottom-8 left-8 z-10 text-white md:bottom-12 md:left-12">
        <h1 className="text-4xl font-bold text-[#30D5C8] md:text-5xl">$money</h1>
        <p className="mt-2 text-sm md:text-base">
          check out our hot tokens frame{" "}
          <a
            href="https://hot.cast.money"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#30D5C8] underline transition-colors hover:text-[#40E5D8]"
          >
            hot.cast.money
          </a>
        </p>
        <div className="mt-4 flex space-x-4">
          <a
            href="https://x.com/thecastmoney"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="transition-transform hover:scale-110"
          >
            <TwitterIcon />
          </a>
          <a
            href="https://warpcast.com/~/channel/castmoney"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Farcaster"
            className="transition-transform hover:scale-110"
          >
            <FarcasterIcon />
          </a>
        </div>
      </div>
    </div>
  )
}

function TwitterIcon() {
  return (
    <img
      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iDNTIutilv8ZIbH8212ceoYWKEyHFx.png"
      alt="X (Twitter)"
      className="h-6 w-6"
    />
  )
}

function FarcasterIcon() {
  return (
    <img
      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-LvYUz9N8ZVLWQZGGs3Dp4aQevlXSWR.png"
      alt="Farcaster"
      className="h-6 w-6"
    />
  )
}
