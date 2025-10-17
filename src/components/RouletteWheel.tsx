import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import { motion } from 'framer-motion'
import type { RouletteItem, RouletteSettings } from '../App'

interface RouletteWheelProps {
  items: RouletteItem[]
  settings: RouletteSettings
  onTick?: () => void
}

export interface RouletteWheelRef {
  spin: (targetIndex: number) => void
  getCurrentWinner: () => number
}

const RouletteWheel = forwardRef<RouletteWheelRef, RouletteWheelProps>(
  ({ items, settings, onTick }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rotationRef = useRef(0)
    const animationRef = useRef<number>()

    useImperativeHandle(ref, () => ({
      spin: (targetIndex: number) => {
        if (!canvasRef.current || items.length === 0) return

        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')!
        
        // Keep current rotation as starting point (don't reset to 0)
        const startRotation = rotationRef.current
        
        const anglePerItem = (Math.PI * 2) / items.length
        
        // Calculate the angle where the target item should be when the pointer (top) hits it
        // Since items are now drawn with index 0 at the top (-π/2), and we want the CENTER of the target slice at the top
        const targetItemCenterAngle = targetIndex * anglePerItem
        
        // Add random offset within the target slice for more natural variation
        const cryptoArray = new Uint32Array(3)
        crypto.getRandomValues(cryptoArray)
        const sliceOffset = (cryptoArray[0] / 0xFFFFFFFF - 0.5) * anglePerItem * 0.7 // ±35% of slice width
        
        // We need to rotate the wheel so that targetItemCenterAngle ends up at 0 (top)
        // The rotation needed is -targetItemCenterAngle + random offset
        let finalRotation = -targetItemCenterAngle + sliceOffset
        
        // Add extra spins with more randomness for visual effect
        const baseSpins = 3 + (cryptoArray[1] / 0xFFFFFFFF) * 4 // 3-7 spins
        const extraRotation = (cryptoArray[2] / 0xFFFFFFFF) * Math.PI * 2 // Random extra 0-2π
        const extraSpins = baseSpins + extraRotation / (Math.PI * 2)
        
        const totalRotationFromZero = finalRotation + extraSpins * Math.PI * 2
        
        const startTime = performance.now()
        const duration = settings.speed
        let lastTickIndex = -1

        const animate = (currentTime: number) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / duration, 1)
          
          // Enhanced easing function with subtle micro-variations
          let eased = 1 - Math.pow(1 - progress, 3) // Base cubic-out easing
          
          // Add very subtle randomness that decreases as we approach the end
          if (progress < 0.85) {
            const variationStrength = Math.max(0, 0.85 - progress) * 0.8
            const microVariation = (Math.random() - 0.5) * 0.008 * variationStrength
            eased = Math.max(0, Math.min(1, eased + microVariation))
          }
          
          const currentRotation = startRotation + (totalRotationFromZero * eased)
          rotationRef.current = currentRotation
          
          // Calculate current item at pointer for tick sounds
          if (progress > 0.1 && progress < 0.9) {
            const normalizedRotation = ((currentRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
            const currentItemAtPointer = Math.floor((normalizedRotation / anglePerItem) % items.length)
            
            if (currentItemAtPointer !== lastTickIndex) {
              onTick?.()
              lastTickIndex = currentItemAtPointer
            }
          }
          
          drawWheel(ctx, canvas, items, currentRotation)
          
          if (progress < 1) {
            animationRef.current = requestAnimationFrame(animate)
          } else {
            // Animation finished - keep the current rotation where it stopped
            // Don't set to finalRotation as that would "snap" to a specific position
            // The currentRotation is already where the animation naturally ended
          }
        }
        
        animationRef.current = requestAnimationFrame(animate)
      },
      getCurrentWinner: () => {
        if (items.length === 0) return 0
        
        const anglePerItem = (Math.PI * 2) / items.length
        const normalizedRotation = ((rotationRef.current % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
        
        // Calculate which item is currently at the pointer (top)
        // Since we draw with offset -π/2, we need to account for that
        const itemAtPointer = Math.floor((normalizedRotation / anglePerItem) % items.length)
        
        return itemAtPointer
      }
    }))

    const drawWheel = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      items: RouletteItem[],
      rotation: number
    ) => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(centerX, centerY) - 30
      
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      if (items.length === 0) {
        // Draw empty wheel
        ctx.beginPath()
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
        ctx.fillStyle = '#374151'
        ctx.fill()
        ctx.strokeStyle = '#6b7280'
        ctx.lineWidth = 3
        ctx.stroke()
        
        ctx.fillStyle = '#9ca3af'
        ctx.font = '18px Inter'
        ctx.textAlign = 'center'
        ctx.fillText('Adicione itens', centerX, centerY)
        return
      }
      
      ctx.save()
      ctx.translate(centerX, centerY)
      ctx.rotate(rotation)
      
      const anglePerItem = (Math.PI * 2) / items.length
      
      // Draw segments
      items.forEach((item, index) => {
        // Offset by -π/2 so that index 0 starts at the top (where the pointer is)
        const startAngle = index * anglePerItem - Math.PI / 2
        const endAngle = startAngle + anglePerItem
        
        // Draw segment
        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, radius, startAngle, endAngle)
        ctx.closePath()
        ctx.fillStyle = item.color
        ctx.fill()
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)'
        ctx.lineWidth = 2
        ctx.stroke()
        
        // Draw text
        ctx.save()
        ctx.rotate(startAngle + anglePerItem / 2)
        ctx.translate(radius * 0.65, 0)
        ctx.rotate(Math.PI / 2)
        ctx.fillStyle = 'white'
        ctx.font = 'bold 18px Inter'
        ctx.textAlign = 'center'
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
        ctx.shadowBlur = 4
        
        // Wrap text if too long
        const maxWidth = 120
        if (ctx.measureText(item.name).width > maxWidth) {
          const words = item.name.split(' ')
          let line = ''
          let y = -10
          
          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' '
            const metrics = ctx.measureText(testLine)
            const testWidth = metrics.width
            
            if (testWidth > maxWidth && n > 0) {
              ctx.fillText(line.trim(), 0, y)
              line = words[n] + ' '
              y += 20
            } else {
              line = testLine
            }
          }
          ctx.fillText(line.trim(), 0, y)
        } else {
          ctx.fillText(item.name, 0, 0)
        }
        
        ctx.restore()
      })
      
      ctx.restore()
      
      // Draw center circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, 40, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
      ctx.fill()
      ctx.strokeStyle = '#6b7280'
      ctx.lineWidth = 4
      ctx.stroke()
    }

    useEffect(() => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')!
      
      // Set canvas size with device pixel ratio
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      
      drawWheel(ctx, canvas, items, rotationRef.current)
    }, [items])

    useEffect(() => {
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }, [])

    return (
      <div className="relative">
        <motion.canvas
          ref={canvasRef}
          width={1200}
          height={1200}
          className="w-[1200px] h-[1200px] rounded-full shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
        
        {/* Pointer */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 text-5xl text-cyan-400 drop-shadow-lg">
          ▼
        </div>
      </div>
    )
  }
)

RouletteWheel.displayName = 'RouletteWheel'

export default RouletteWheel