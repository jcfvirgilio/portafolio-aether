"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { projects, type Project } from "@/lib/projects";
import { createProjectTexture } from "@/lib/artwork";

function GlowDust({ animated }: { animated: boolean }) {
  const cloud = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const pos = new Float32Array(1450 * 3);
    const colors = new Float32Array(1450 * 3);
    let seed = 583;
    const random = () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const pA = new THREE.Color("#e6abdb");
    const pB = new THREE.Color("#dfe1a0");
    const pC = new THREE.Color("#72c9b9");
    for (let i = 0; i < 1450; i++) {
      const a = random() * Math.PI * 2;
      const r = 1 + Math.pow(random(), 0.8) * 7;
      pos[i * 3] = Math.cos(a) * r + 1.25;
      pos[i * 3 + 1] = Math.sin(a) * r * 0.73;
      pos[i * 3 + 2] = (random() - 0.5) * 5 - 1.5;
      const color = pA.clone().lerp(random() > 0.5 ? pB : pC, random());
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geom;
  }, []);

  useFrame((state, dt) => {
    if (cloud.current && animated) {
      cloud.current.rotation.y -= Math.min(dt, 0.05) * 0.007;
      cloud.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.09) * 0.06;
    }
  });
  return (
    <points geometry={geometry} ref={cloud}>
      <pointsMaterial vertexColors size={0.033} transparent opacity={0.75} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function ProjectCard({
  item,
  index,
  progress,
  animated,
  onOpen,
}: {
  item: Project;
  index: number;
  progress: number;
  animated: boolean;
  onOpen: (index: number) => void;
}) {
  const group = useRef<THREE.Group>(null);
  const { viewport, pointer } = useThree();
  const small = viewport.width < 9.7;
  const texture = useMemo(() => createProjectTexture(item), [item]);
  useEffect(() => () => texture.dispose(), [texture]);
  const focusPosition = progress * (projects.length - 1);
  const deltaPosition = index - focusPosition;
  const near = Math.abs(deltaPosition) < 3;

  useFrame((state, delta) => {
    if (!group.current) return;
    const difference = index - progress * (projects.length - 1);
    const abs = Math.abs(difference);
    const easing = animated ? Math.min(delta, 0.05) : 0.2;
    const x = (small ? 0 : 1.65) + difference * (small ? 4.1 : 5.15);
    const y = Math.sin(difference * 1.1) * 0.47 - abs * 0.16;
    const z = -abs * 1.8 - (difference < 0 ? 0.4 : 0);
    group.current.position.x = THREE.MathUtils.damp(group.current.position.x, x, 5.5, easing);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, y + (animated ? Math.sin(state.clock.elapsedTime * 0.55 + index) * 0.09 : 0), 5, easing);
    group.current.position.z = THREE.MathUtils.damp(group.current.position.z, z, 5, easing);
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, -difference * 0.23 + (abs < 0.6 ? pointer.x * 0.045 : 0), 5.5, easing);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, abs < 0.6 ? -pointer.y * 0.045 : 0, 5.5, easing);
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, difference * -0.065, 5.5, easing);
    const targetScale = (small ? 0.86 : 1.15) * Math.max(0.56, 1 - abs * 0.18);
    const smoothScale = THREE.MathUtils.damp(group.current.scale.x, targetScale, 5.2, easing);
    group.current.scale.setScalar(smoothScale);
  });

  return (
    <group
      ref={group}
      visible={near}
      onClick={(event) => {
        event.stopPropagation();
        if (Math.abs(index - progress * (projects.length - 1)) < 0.55) onOpen(index);
      }}
    >
      <RoundedBox args={[5.23, 3.67, 0.105]} radius={0.13} smoothness={4} position={[0, 0, -0.08]}>
        <meshStandardMaterial color={item.accent} metalness={0.74} roughness={0.24} transparent opacity={0.85} />
      </RoundedBox>
      <RoundedBox args={[5.2, 3.64, 0.1]} radius={0.14} smoothness={4}>
        <meshPhysicalMaterial color="#111016" metalness={0.4} roughness={0.18} clearcoat={1} clearcoatRoughness={0.1} />
      </RoundedBox>
      <mesh position={[0, 0, 0.073]}>
        <planeGeometry args={[5.12, 3.56]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} side={THREE.FrontSide} />
      </mesh>
      <mesh position={[0, 0.02, 0.084]} rotation={[0, 0, -0.21]}>
        <planeGeometry args={[1.8, 4.9]} />
        <meshBasicMaterial color="#fff9f2" transparent opacity={0.022} depthWrite={false} />
      </mesh>
    </group>
  );
}

function OrbitArtifacts({ progress, animated }: { progress: number; animated: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current || !animated) return;
    group.current.rotation.y += Math.min(delta, 0.05) * 0.04;
    group.current.rotation.z = progress * 0.8 + Math.sin(state.clock.elapsedTime * 0.13) * 0.08;
  });
  return (
    <group ref={group} position={[1.5, 0, -4.4]}>
      <mesh position={[-3, 1.5, -1]} rotation={[0.45, 1, 0.15]}>
        <torusGeometry args={[2.1, 0.019, 8, 120]} />
        <meshStandardMaterial color="#b3a2b8" metalness={0.9} roughness={0.32} transparent opacity={0.5} />
      </mesh>
      <mesh position={[3, -0.6, -1]} rotation={[1.1, 0.24, -0.3]}>
        <torusGeometry args={[2.6, 0.012, 6, 132]} />
        <meshStandardMaterial color="#e4b187" metalness={0.92} roughness={0.26} transparent opacity={0.35} />
      </mesh>
      <mesh position={[4, 1.8, -1.1]} rotation={[0.8, 0.3, 0.3]}>
        <icosahedronGeometry args={[0.56, 1]} />
        <meshStandardMaterial color="#b3a8c8" metalness={0.8} roughness={0.15} transparent opacity={0.24} wireframe />
      </mesh>
    </group>
  );
}

export default function WorkScene({
  progress,
  animated = true,
  onOpen,
}: {
  progress: number;
  animated?: boolean;
  onOpen: (index: number) => void;
}) {
  return (
    <Canvas
      frameloop={animated ? "always" : "demand"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 12], fov: 43, near: 0.1, far: 90 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      fallback={<div className="webgl-fallback gallery-fallback" aria-label="Project gallery" />}
      aria-label="Interactive three-dimensional gallery of original concept projects"
    >
      <ambientLight intensity={2.0} />
      <directionalLight position={[-3, 6, 5]} intensity={3.1} color="#fff0df" />
      <pointLight position={[3, 0, 7]} intensity={26} distance={14} color="#d9a4c9" />
      <pointLight position={[-4, -2, 3]} intensity={12} distance={12} color="#7ebbc2" />
      <GlowDust animated={animated} />
      <OrbitArtifacts progress={progress} animated={animated} />
      {projects.map((project, index) => (
        <ProjectCard key={project.id} item={project} index={index} progress={progress} animated={animated} onOpen={onOpen} />
      ))}
    </Canvas>
  );
}
