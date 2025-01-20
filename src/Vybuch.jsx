import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import * as THREE from 'three'

export function Vybuch(props) {
  const group = useRef()
  const { scene, animations } = useGLTF('/vybuch/scene.gltf')
  const { actions } = useAnimations(animations, group)
  
  console.log('Vybuch - Načtená scéna:', scene)
  console.log('Vybuch - Animace:', animations)
  console.log('Vybuch - Akce:', actions)
  
  // Pozice ve středu scény
  const position = { x: 0, y: 0, z: 0 }
  const scale = 2.0

  useEffect(() => {
    console.log('Vybuch - useEffect spuštěn')
    if (group.current) {
      console.log('Vybuch - group.current existuje')
      group.current.position.x = position.x
      group.current.position.y = position.y
      group.current.position.z = position.z
      console.log('Vybuch - Pozice nastavena:', position)

      group.current.scale.set(scale, scale, scale)
      console.log('Vybuch - Scale nastaven:', scale)

      if (actions && Object.keys(actions).length > 0) {
        console.log('Vybuch - Spouštím animace')
        Object.values(actions).forEach(action => {
          action.reset()
          action.timeScale = 0.80
          action.play()
          action.clampWhenFinished = true
          action.loop = THREE.LoopOnce
        })
      } else {
        console.log('Vybuch - Žádné animace k dispozici')
      }

      scene.visible = true
      console.log('Vybuch - Viditelnost nastavena na:', scene.visible)
      console.log('Vybuch - Aktuální transformace:', {
        position: group.current.position,
        scale: group.current.scale,
        rotation: group.current.rotation
      })
    } else {
      console.log('Vybuch - group.current neexistuje')
    }

    return () => {
      console.log('Vybuch - Cleanup spuštěn')
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

useGLTF.preload('/vybuch/scene.gltf') 