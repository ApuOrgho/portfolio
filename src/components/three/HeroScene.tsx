"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useTheme } from "next-themes";
import type { Mesh } from "three";

function DistortedBlob() {
  const meshRef = useRef<Mesh>(null);
  const { resolvedTheme } = useTheme();
  const color = resolvedTheme === "dark" ? "#8b7cff" : "#6d5ef8";

  useFrame((state) => {
    if (!meshRef.current) return;
    const { pointer } = state;
    meshRef.current.rotation.y += 0.0015;
    meshRef.current.rotation.x = pointer.y * 0.25;
    meshRef.current.rotation.z = pointer.x * -0.15;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.5} floatIntensity={1.1}>
      <mesh ref={meshRef} position={[1.9, -0.1, -1.5]} scale={1.15}>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          color={color}
          distort={0.42}
          speed={2}
          roughness={0.15}
          metalness={0.3}
        />
      </mesh>
    </Float>
  );
}

function RingAccent() {
  const ref = useRef<Mesh>(null);
  const { resolvedTheme } = useTheme();
  const color = resolvedTheme === "dark" ? "#ff8a72" : "#ff6b57";

  useFrame(() => {
    if (!ref.current) return;
    ref.current.rotation.x += 0.0009;
    ref.current.rotation.y += 0.0015;
  });

  return (
    <mesh ref={ref} position={[2.9, 1.2, -1]} rotation={[1.1, 0.4, 0]}>
      <torusGeometry args={[0.4, 0.05, 16, 100]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
    </mesh>
  );
}

function Scene() {
  const sparkleColor = "#ffffff";
  const particles = useMemo(() => 45, []);

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 4]} intensity={1.4} />
      <directionalLight position={[-3, -2, -2]} intensity={0.4} />
      <DistortedBlob />
      <RingAccent />
      <Sparkles count={particles} scale={6} size={2} speed={0.25} color={sparkleColor} opacity={0.4} />
    </>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 38 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      className="!touch-none"
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  );
}
