import React, { useRef, useState, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Sun({ hasExploded, ...props }) {
  const group = useRef()
  const { nodes, materials, scene } = useGLTF('/sun/scene.gltf')
  const [scale, setScale] = useState(1)
  const [opacity, setOpacity] = useState(1)
  const animationTime = useRef(0)

  // Najdeme všechny materiály v modelu
  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        // Nastavíme materiály jako průhledné
        child.material.transparent = true
        child.material.opacity = 1
      }
    })
  }, [scene])

  useFrame((state, delta) => {
    if (hasExploded) {
      animationTime.current += delta

      // Animace po dobu 2 sekund
      if (animationTime.current < 2) {
        const progress = animationTime.current / 2
        // Exponenciální křivka pro plynulejší přechod
        const easeProgress = 1 - Math.pow(1 - progress, 2)
        
        // Zmenšení na 60% původní velikosti
        setScale(1 - (0.4 * easeProgress))
        
        // Snížení průhlednosti na 30%
        const newOpacity = 1 - (0.7 * easeProgress)
        setOpacity(newOpacity)
        
        // Aplikujeme průhlednost na všechny materiály
        scene.traverse((child) => {
          if (child.isMesh) {
            child.material.opacity = newOpacity
          }
        })
      }
    }

    // Rotace slunce
    if (group.current) {
      group.current.rotation.y += delta * 0.2
    }
  })

  return (
    <group ref={group} {...props} scale={props.scale * scale}>
      <primitive object={scene} />
    </group>
  )
}

// Pre-load the model
useGLTF.preload('/sun/scene.gltf') 