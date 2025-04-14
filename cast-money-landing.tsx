"use client"

import { useEffect, useRef, useState } from "react"

export default function CastMoneyLanding() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    // Initialize particles array
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
    }[] = []

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      setIsMobile(window.innerWidth < 768)
      initParticles()
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    function createMoneyLogoPath() {
      const path = []
      const centerX = window.innerWidth / 2
      const centerY = window.innerHeight / 2 - 40 // Slightly above center
      const scale = Math.min(window.innerWidth, window.innerHeight) * 0.15

      // Create $ shape
      // Vertical line
      for (let i = -1; i <= 1; i += 0.05) {
        path.push(centerX, centerY + i * scale)
      }

      // Top curve
      for (let i = 0; i <= Math.PI; i += 0.1) {
        path.push(centerX + Math.cos(i) * scale * 0.5, centerY - scale * 0.5 + Math.sin(i) * scale * 0.5)
      }

      // Bottom curve
      for (let i = 0; i <= Math.PI; i += 0.1) {
        path.push(centerX - Math.cos(i) * scale * 0.5, centerY + scale * 0.5 + Math.sin(i) * scale * 0.5)
      }

      // Add some random points around for more particles
      for (let i = 0; i < 300; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * scale * 2.5
        path.push(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
      }

      return path
    }

    function initParticles() {
      particles.length = 0
      const logoPath = createMoneyLogoPath()

      // Main color palette - variations of turquoise
      const colors = ["#30D5C8", "#20C5B8", "#40E5D8", "#10B5A8"]

      // Create particles from the logo path
      for (let i = 0; i < logoPath.length; i += 2) {
        if (Math.random() > 0.2) {
          // Use 80% of the points
          particles.push({
            x: Math.random() * canvas.width, // Start from random positions
            y: Math.random() * canvas.height,
            originalX: logoPath[i],
            originalY: logoPath[i + 1],
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            alpha: 0.6 + Math.random() * 0.4,
            speed: 0.5 + Math.random() * 1.5,
          })
        }
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

        // Gradually return to original position
        p.vx += (p.originalX - p.x) * 0.02
        p.vy += (p.originalY - p.y) * 0.02

        // Update position
        p.x += p.vx * p.speed
        p.y += p.vy * p.speed

        // Dampen velocity
        p.vx *= 0.95
        p.vy *= 0.95

        // Draw particle
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
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

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold text-[#30D5C8] md:text-7xl lg:text-8xl">$money</h1>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-10 mx-auto text-center text-white md:bottom-12">
        <p className="text-sm md:text-base">
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
        <div className="mt-4 flex justify-center space-x-6">
          <a
            href="https://x.com/thecastmoney"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="transition-transform hover:scale-110"
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iDNTIutilv8ZIbH8212ceoYWKEyHFx.png"
              alt="X (Twitter)"
              className="h-6 w-6"
            />
          </a>
          <a
            href="https://warpcast.com/~/channel/castmoney"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Farcaster"
            className="transition-transform hover:scale-110"
          >
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-LvYUz9N8ZVLWQZGGs3Dp4aQevlXSWR.png"
              alt="Farcaster"
              className="h-6 w-6"
            />
          </a>
        </div>
      </div>
    </div>
  )
}
