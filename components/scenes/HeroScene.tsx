"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function seeded(seed: number) {
  let val = seed >>> 0;
  return () => {
    val = (val * 1664525 + 1013904223) >>> 0;
    return val / 4294967296;
  };
}

function GoldDust({ count, animated }: { count: number; animated: boolean }) {
  const cloud = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const random = seeded(101);
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const gold = new THREE.Color("#f1c77b");
    const orange = new THREE.Color("#b86d46");
    const cream = new THREE.Color("#fff5d3");
    for (let i = 0; i < count; i++) {
      const theta = random() * Math.PI * 2;
      const radius = 0.9 + Math.pow(random(), 0.58) * 5.7;
      const height = (random() - 0.5) * (2.6 + 4.8 * radius / 6);
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = height + Math.sin(theta * 2) * 0.26;
      positions[i * 3 + 2] = (random() - 0.5) * 5.1;
      const c = (random() > 0.72 ? cream : gold).clone().lerp(orange, random() * 0.75);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geom;
  }, [count]);

  useFrame((state, delta) => {
    if (cloud.current && animated) {
      cloud.current.rotation.y += Math.min(delta, 0.05) * 0.019;
      cloud.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.025;
    }
  });

  return (
    <points ref={cloud} geometry={geometry}>
      <pointsMaterial
        vertexColors
        size={0.032}
        transparent
        opacity={0.76}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Ribbon({ reverse, color }: { reverse?: boolean; color: string }) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const y = -3.5 + t * 5.1;
      const x = (reverse ? -1 : 1) * (0.08 + 1.18 * Math.sin(Math.PI * t)) * Math.cos(Math.PI * t);
      const z = Math.sin(Math.PI * t * 1.2) * (reverse ? -0.31 : 0.38);
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 180, 0.027, 7, false);
  }, [reverse]);
  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial color={color} metalness={0.94} roughness={0.2} emissive="#a66335" emissiveIntensity={0.12} />
    </mesh>
  );
}

function Sculpture({ animated }: { animated: boolean }) {
  const group = useRef<THREE.Group>(null);
  const interior = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const small = viewport.width < 9.2;

  useFrame((state, delta) => {
    if (!group.current || !animated) return;
    const t = state.clock.elapsedTime;
    const pointerX = state.pointer.x;
    const pointerY = state.pointer.y;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointerX * 0.15 + Math.sin(t * 0.22) * 0.07, 2.5, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -pointerY * 0.09, 2, delta);
    group.current.position.y = Math.sin(t * 0.65) * 0.12;
    if (interior.current) interior.current.rotation.z += Math.min(delta, 0.05) * 0.065;
  });

  return (
    <group position={small ? [0, 0.34, 0] : [2.85, -0.08, 0]} scale={small ? 0.74 : 1.07} ref={group}>
      <GoldDust count={small ? 1250 : 2400} animated={animated} />
      <Ribbon color="#a87954" />
      <Ribbon reverse color="#e9c990" />
      <group position={[0, 1.28, 0]} rotation={[0.1, 0.19, -0.13]}>
        <mesh rotation={[0.13, 0.15, 0]}>
          <torusGeometry args={[0.93, 0.055, 14, 160]} />
          <meshStandardMaterial color="#eccd8f" metalness={1} roughness={0.12} emissive="#94642c" emissiveIntensity={0.12} />
        </mesh>
        <mesh rotation={[0.36, -0.24, 0.3]}>
          <torusGeometry args={[1.01, 0.019, 12, 140]} />
          <meshStandardMaterial color="#b78351" metalness={1} roughness={0.18} />
        </mesh>
        <mesh rotation={[0.1, 0.22, 0]}>
          <torusGeometry args={[0.79, 0.012, 9, 160]} />
          <meshStandardMaterial color="#ffe5aa" metalness={1} roughness={0.1} emissive="#d3a25d" emissiveIntensity={0.21} />
        </mesh>
        <group ref={interior}>
          <mesh rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.56, 0.56, 0.1]} />
            <meshStandardMaterial color="#dfb47d" metalness={1} roughness={0.16} />
          </mesh>
          <mesh position={[0, 0, 0.075]} rotation={[0, 0, Math.PI / 4]}>
            <boxGeometry args={[0.33, 0.33, 0.06]} />
            <meshStandardMaterial color="#1c1013" metalness={0.5} roughness={0.28} />
          </mesh>
          <mesh position={[0, 0, 0.13]}>
            <octahedronGeometry args={[0.14, 0]} />
            <meshStandardMaterial color="#fbe1a3" metalness={0.85} roughness={0.1} emissive="#d39e4a" emissiveIntensity={0.24} />
          </mesh>
        </group>
      </group>
      <pointLight position={[0.7, 2.1, 2]} color="#ffd4a0" intensity={6} distance={7} />
      <pointLight position={[-1.9, -1, -1]} color="#ba6b46" intensity={5} distance={7} />
    </group>
  );
}

export default function HeroScene({ animated = true }: { animated?: boolean }) {
  return (
    <Canvas
      frameloop={animated ? "always" : "demand"}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 12.5], fov: 42, near: 0.1, far: 100 }}
      fallback={<div className="webgl-fallback hero-fallback" aria-label="Abstract golden sculpture" />}
      aria-label="Animated abstract gold sculpture surrounded by floating particles"
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[-4, 7, 6]} intensity={3.5} color="#ffe6ba" />
      <directionalLight position={[5, -3, 1]} intensity={2.4} color="#f08b51" />
      <Sculpture animated={animated} />
    </Canvas>
  );
}
