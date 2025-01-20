import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

export function Meteorite2(props) {
  const group = useRef()
  const { scene, animations } = useGLTF('/explosion/scene.gltf')
  const { actions } = useAnimations(animations, group)
  
  console.log('Meteorite2 - Načtená scéna:', scene)
  console.log('Meteorite2 - Animace:', animations)
  console.log('Meteorite2 - Akce:', actions)
  
  const position = { x: -4, y: 0, z: 0 }
  const scale = 3.0

  useEffect(() => {
    console.log('Meteorite2 - useEffect spuštěn')
    if (group.current) {
      console.log('Meteorite2 - group.current existuje')
      group.current.position.x = position.x
      group.current.position.y = position.y
      group.current.position.z = position.z
      console.log('Meteorite2 - Pozice nastavena:', position)

      group.current.scale.set(scale, scale, scale)
      console.log('Meteorite2 - Scale nastaven:', scale)

      if (actions && Object.keys(actions).length > 0) {
        console.log('Meteorite2 - Spouštím animace')
        Object.values(actions).forEach(action => {
          action.reset()
          action.timeScale = 0.80
          action.play()
          action.clampWhenFinished = true
          action.loop = THREE.LoopOnce
        })
      } else {
        console.log('Meteorite2 - Žádné animace k dispozici')
      }

      scene.visible = true
      console.log('Meteorite2 - Viditelnost nastavena na:', scene.visible)
      console.log('Meteorite2 - Aktuální transformace:', {
        position: group.current.position,
        scale: group.current.scale,
        rotation: group.current.rotation
      })
    } else {
      console.log('Meteorite2 - group.current neexistuje')
    }

    return () => {
      console.log('Meteorite2 - Cleanup spuštěn')
      if (actions) {
        Object.values(actions).forEach(action => {
          action.stop()
          action.reset()
        })
      }
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

  return (
    <group ref={group} {...props}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload('/explosion/scene.gltf') 