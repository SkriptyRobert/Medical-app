import React, { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { Sun } from './Sun'
import { Explosion } from './Explosion'
import { Impact } from './Impact'
import { Bum } from './Bum'
import CustomerApp from './CustomerApp'

export default function App() {
  const [meteorPosition, setMeteorPosition] = useState({ x: 12, y: 6, z: 0 })
  const [hasExploded, setHasExploded] = useState(false)
  const [showCustomerApp, setShowCustomerApp] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Předáváme pozici z Explosion komponenty
  const handleMeteorPosition = (position) => {
    setMeteorPosition(position)
  }

  // Sledování exploze a přechod na novou scénu
  const handleExplosion = () => {
    setHasExploded(true)
    
    // Po 5 sekundách začneme přechod
    setTimeout(() => {
      setIsTransitioning(true)
      // Po 1 sekundě přechodu přepneme na novou aplikaci
      setTimeout(() => {
        setShowCustomerApp(true)
      }, 1000)
    }, 5000)
  }

  if (showCustomerApp) {
    return <CustomerApp />
  }

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black' }}>
      {/* Přechodový overlay */}
      {isTransitioning && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'black',
            opacity: 0,
            animation: 'fadeIn 1s forwards',
            zIndex: 1000
          }}
        />
      )}
      
      <Canvas 
        camera={{ 
          position: [0, 0, 8],
          fov: 75,
          up: [0, 1, 0],
          far: 1000,
          near: 0.1
        }}
      >
        <ambientLight intensity={4} />
        <pointLight position={[10, 10, 10]} intensity={5} />
        <pointLight position={[-10, -10, -10]} intensity={40} />
        <Stars radius={100} depth={60} count={4000} factor={4} saturation={0} fade />
        <Sun position={[0, 0, 0]} scale={0.085} hasExploded={hasExploded} />
        <Explosion scale={0.45} onPositionUpdate={handleMeteorPosition} />
        <Impact position={[0, 0, 0]} scale={0.4} />
        <Bum position={[0, 0, 0]} meteorPosition={meteorPosition} onExplode={handleExplosion} />
      </Canvas>

      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  )
} 