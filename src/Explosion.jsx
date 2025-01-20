import React, { useRef, useEffect, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Explosion({ onPositionUpdate, ...props }) {
  const group = useRef()
  const { scene, animations } = useGLTF('/explosion/scene.gltf')
  const { actions } = useAnimations(animations, group)
  const [hasExploded, setHasExploded] = useState(false)
  const startPosition = { x: 12, y: 6, z: 0 } // Vzdálenější start
  const targetPosition = { x: 0, y: 0, z: 0 } // Střed scény
  const speed = 0.0050 // Pomalejší rychlost pro delší trasu

  useEffect(() => {
    // Nastavíme počáteční pozici
    if (group.current) {
      group.current.position.x = startPosition.x
      group.current.position.y = startPosition.y
      group.current.position.z = startPosition.z
    }
  }, [])

  useFrame(() => {
    if (group.current && !hasExploded) {
      // Výpočet vzdálenosti od cíle
      const distance = Math.sqrt(
        Math.pow(group.current.position.x - targetPosition.x, 2) +
        Math.pow(group.current.position.y - targetPosition.y, 2)
      )

      // Aktualizace pozice pro Bum komponentu
      onPositionUpdate?.({
        x: group.current.position.x,
        y: group.current.position.y,
        z: group.current.position.z
      })

      // Pokud jsme dostatečně blízko cíle, spustíme explozi
      if (distance < 1.0) {
        setHasExploded(true)
        // Spustíme animaci exploze
        Object.values(actions).forEach(action => {
          action.reset()
          action.timeScale = 0.40
          action.play()
        })
      } else {
        // Pohyb směrem k cíli
        group.current.position.x -= (group.current.position.x - targetPosition.x) * speed
        group.current.position.y -= (group.current.position.y - targetPosition.y) * speed
        
        // Rotace během letu
        group.current.rotation.z += 0.02
      }
    }
  })

  return (
    <group ref={group} {...props}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/explosion/scene.gltf') 