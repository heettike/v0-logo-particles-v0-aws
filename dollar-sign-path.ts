// This creates a dollar sign shape for our particles
export const DollarSignPath = () => {
  const path = []
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  const scale = Math.min(window.innerWidth, window.innerHeight) * 0.2

  // Create dollar sign shape
  for (let i = 0; i < 100; i++) {
    const angle = (i / 100) * Math.PI * 2
    // Vertical line
    path.push(centerX, centerY - scale * Math.cos(angle) * 0.8)

    // Top curve
    path.push(centerX + scale * 0.5 * Math.sin(angle * 2), centerY - scale * 0.5 + scale * 0.3 * Math.cos(angle * 3))

    // Bottom curve
    path.push(centerX - scale * 0.5 * Math.sin(angle * 2), centerY + scale * 0.5 + scale * 0.3 * Math.cos(angle * 3))
  }

  // Add some random points around for more particles
  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * scale * 1.2
    path.push(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius)
  }

  return path
}
