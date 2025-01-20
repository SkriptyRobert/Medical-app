import React, { useRef, useEffect, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Impact(props) {
  const group = useRef()
  const { scene, animations } = useGLTF('/impact/timeframe_explosion/scene.gltf')
  const { actions } = useAnimations(animations, group)
  const [hasExploded, setHasExploded] = useState(false)
  const [shouldRemove, setShouldRemove] = useState(false)
  const startPosition = { x: 12, y: 6, z: 0 }
  const targetPosition = { x: 0, y: 0, z: 0 }
  const speed = 0.0050

  useEffect(() => {
    if (group.current) {
      group.current.position.x = startPosition.x
      group.current.position.y = startPosition.y
      group.current.position.z = startPosition.z

      const angle = Math.atan2(
        targetPosition.y - startPosition.y,
        targetPosition.x - startPosition.x
      )
      
      group.current.rotation.z = angle + Math.PI / 2

      // Spouštíme animaci hned na začátku
      Object.values(actions).forEach(action => {
        action.reset()
        action.timeScale = 0.80
        action.play()
        action.clampWhenFinished = true
        action.loop = THREE.LoopOnce
      })
    }

    // Cleanup funkce
    return () => {
      // Zastavíme a vyčistíme všechny animace
      Object.values(actions).forEach(action => {
        action.stop()
        action.reset()
      })
      // Odstraníme scénu a vyčistíme paměť
      if (scene) {
        scene.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose()
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose())
            } else {
              object.material.dispose()
            }
          }
        })
      }
    }
  }, [actions, scene])

  useFrame((state, delta) => {
    if (group.current && !hasExploded) {
      const distance = Math.sqrt(
        Math.pow(group.current.position.x - targetPosition.x, 2) +
        Math.pow(group.current.position.y - targetPosition.y, 2)
      )

      if (distance < 1.0) {
        setHasExploded(true)
        // Zastavíme všechny animace
        Object.values(actions).forEach(action => {
          action.stop()
        })
        // Nastavíme časovač pro odstranění komponenty
        setTimeout(() => {
          setShouldRemove(true)
        }, 100) // Krátké zpoždění pro zajištění plynulosti
      } else {
        group.current.position.x -= (group.current.position.x - targetPosition.x) * speed
        group.current.position.y -= (group.current.position.y - targetPosition.y) * speed
      }
    }
  })

  // Pokud je shouldRemove true, nevrátíme nic (komponenta se odstraní)
  if (shouldRemove) return null

  return (
    <group ref={group} {...props}>
      <primitive object={scene} />
    </group>
  )
}

// Předběžné načtení modelu
useGLTF.preload('/impact/timeframe_explosion/scene.gltf') 