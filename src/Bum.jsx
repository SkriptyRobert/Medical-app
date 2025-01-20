import React, { useRef, useMemo, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Bum({ meteorPosition, onExplode, ...props }) {
  const group = useRef()
  const { nodes, materials, scene } = useGLTF('/bum/bum.gltf')
  const particles = useRef()
  const [exploded, setExploded] = useState(false)
  const [scale, setScale] = useState(0) // Začínáme neviditelný
  const explosionTime = useRef(0)
  
  // Vytvoření geometrie a atributů pro částice
  const particleSystem = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const count = 2000
    
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    
    for(let i = 0; i < count; i++) {
      const i3 = i * 3
      const radius = Math.random() * 0.4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = radius * Math.cos(phi)
      
      velocities[i3] = positions[i3] * 4
      velocities[i3 + 1] = positions[i3 + 1] * 4
      velocities[i3 + 2] = positions[i3 + 2] * 4
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.userData.velocities = velocities
    
    return geometry
  }, [])

  useFrame((state, delta) => {
    // Kontrola vzdálenosti meteoritu od středu
    if (meteorPosition && !exploded) {
      const distance = Math.sqrt(
        Math.pow(meteorPosition.x, 2) +
        Math.pow(meteorPosition.y, 2)
      )
      
      console.log('Meteor distance:', distance, 'Position:', meteorPosition) // Debug log
      
      // Spustíme explozi, když je meteorit blízko středu
      if (distance < 1.0) { // Zvětšená vzdálenost pro snadnější spuštění
        console.log('Starting explosion!') // Debug log
        setExploded(true)
        explosionTime.current = 0
        setScale(0.1)
        onExplode?.() // Informujeme o explozi
      }
    }

    // Animace exploze
    if (exploded) {
      explosionTime.current += delta
      
      // Dramatická exploze
      if (explosionTime.current < 0.3) {
        const progress = explosionTime.current / 0.3
        const explosionScale = Math.pow(progress, 2) * 15.0
        setScale(0.1 + explosionScale)
      }

      if (particles.current) {
        const positions = particles.current.geometry.attributes.position.array
        const velocities = particles.current.geometry.userData.velocities
        
        for(let i = 0; i < positions.length; i += 3) {
          positions[i] += velocities[i] * delta * 3.0
          positions[i + 1] += velocities[i + 1] * delta * 3.0
          positions[i + 2] += velocities[i + 2] * delta * 3.0
          
          velocities[i] *= 0.98
          velocities[i + 1] *= 0.98
          velocities[i + 2] *= 0.98
        }
        
        particles.current.geometry.attributes.position.needsUpdate = true
      }

      // Velmi pomalá rotace během a po explozi
      if (group.current) {
        group.current.rotation.y += delta * 0.1 // Zpomaleno z 2.0 na 0.1
        group.current.rotation.x += delta * 0.05 // Zpomaleno z 1.5 na 0.05
      }
    }
  })

  return (
    <group ref={group} {...props}>
      <primitive object={scene} scale={scale} />
      <points ref={particles}>
        <primitive object={particleSystem} />
        <pointsMaterial
          size={0.2}
          sizeAttenuation={true}
          color={0xff3300}
          transparent
          opacity={0.9}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  )
}

useGLTF.preload('/bum/bum.gltf') 