"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OrbitalSystemProps {
  electronCount?: number;
  rotationSpeed?: number;
  orbitalCount?: number;
  particleDensity?: number;
  enableMouseInteraction?: boolean;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const ELECTRON_COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#2563eb", "#1d4ed8"];

// ─── Electron ────────────────────────────────────────────────────────────────

interface ElectronProps {
  radius: number;
  speed: number;
  offset: number;
  tiltX: number;
  tiltZ: number;
  color: string;
}

function Electron({ radius, speed, offset, tiltX, tiltZ, color }: ElectronProps) {
  const ref = useRef<THREE.Mesh>(null!);
  const trailRef = useRef<THREE.Points>(null!);
  const trailHistory = useRef<THREE.Vector3[]>([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;

    const x = radius * Math.cos(t);
    const z = radius * Math.sin(t);

    const pos = new THREE.Vector3(
      x * Math.cos(tiltZ) - 0 * Math.sin(tiltZ),
      radius * Math.sin(t) * Math.sin(tiltX),
      z * Math.cos(tiltX) + x * Math.sin(tiltZ)
    );

    ref.current.position.copy(pos);

    // Trail
    trailHistory.current.push(pos.clone());
    if (trailHistory.current.length > 20) {
      trailHistory.current.shift();
    }

    if (trailRef.current) {
      const positions = new Float32Array(trailHistory.current.length * 3);
      trailHistory.current.forEach((p, i) => {
        positions[i * 3] = p.x;
        positions[i * 3 + 1] = p.y;
        positions[i * 3 + 2] = p.z;
      });
      trailRef.current.geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );
      trailRef.current.geometry.setDrawRange(0, trailHistory.current.length);
    }
  });

  return (
    <group>
      <mesh ref={ref}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <points ref={trailRef}>
        <bufferGeometry />
        <pointsMaterial
          size={0.018}
          color={color}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// ─── Orbital Ring ────────────────────────────────────────────────────────────

interface OrbitalRingProps {
  radius: number;
  tiltX: number;
  tiltZ: number;
  opacity: number;
}

function OrbitalRing({ radius, tiltX, tiltZ, opacity }: OrbitalRingProps) {
  return (
    <mesh rotation-x={tiltX} rotation-z={tiltZ}>
      <ringGeometry args={[radius - 0.01, radius, 80]} />
      <meshBasicMaterial
        color="#3b82f6"
        transparent
        opacity={opacity}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── Core ────────────────────────────────────────────────────────────────────

function Core() {
  const ref = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const pulse = 0.8 + 0.2 * Math.sin(clock.getElapsedTime() * 0.8);
    ref.current.scale.setScalar(pulse);

    const glowPulse = 0.6 + 0.4 * Math.sin(clock.getElapsedTime() * 0.5);
    glowRef.current.scale.setScalar(glowPulse);
    (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
      0.15 + 0.1 * Math.sin(clock.getElapsedTime() * 0.6);
  });

  return (
    <group>
      {/* Inner core */}
      <mesh ref={ref}>
        <sphereGeometry args={[0.2, 24, 24]} />
        <meshBasicMaterial color="#60a5fa" />
      </mesh>
      {/* Glow layer */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshBasicMaterial
          color="#3b82f6"
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ─── Particles ───────────────────────────────────────────────────────────────

function BackgroundParticles({ density = 1 }: { density?: number }) {
  const ref = useRef<THREE.Points>(null!);
  const count = Math.floor(60 * density);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 1.8 + Math.random() * 2.2;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#3b82f6"
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Scene Content ───────────────────────────────────────────────────────────

function SceneContent({
  electronCount = 8,
  rotationSpeed = 1,
  orbitalCount = 4,
  particleDensity = 1,
  enableMouseInteraction = true,
}: OrbitalSystemProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const targetRotation = useRef({ x: 0, y: 0 });
  const { pointer } = useThree();

  useFrame(({ clock }) => {
    if (enableMouseInteraction) {
      // Smooth interpolation toward pointer
      targetRotation.current.x +=
        (pointer.y * 0.3 - targetRotation.current.x) * 0.03;
      targetRotation.current.y +=
        (pointer.x * 0.3 - targetRotation.current.y) * 0.03;

      groupRef.current.rotation.x = targetRotation.current.x;
      groupRef.current.rotation.y = targetRotation.current.y;
    }

    // Slow auto-rotation
    groupRef.current.rotation.z += 0.002 * rotationSpeed;
  });

  const orbitals = useMemo(() => {
    const items: {
      radius: number;
      tiltX: number;
      tiltZ: number;
      elecCount: number;
      baseSpeed: number;
    }[] = [];

    for (let i = 0; i < orbitalCount; i++) {
      const radius = 0.9 + i * 0.35;
      const tiltX = (i / orbitalCount) * Math.PI * 0.5 + 0.2;
      const tiltZ = (i / orbitalCount) * Math.PI * 0.35;
      items.push({
        radius,
        tiltX,
        tiltZ,
        elecCount: Math.max(2, Math.floor(electronCount / orbitalCount)),
        baseSpeed: 0.4 + i * 0.12,
      });
    }
    return items;
  }, [orbitalCount, electronCount]);

  return (
    <group ref={groupRef}>
      <Core />

      {orbitals.map((orb, i) => (
        <group key={i}>
          <OrbitalRing
            radius={orb.radius}
            tiltX={orb.tiltX}
            tiltZ={orb.tiltZ}
            opacity={0.15 + i * 0.03}
          />
          {Array.from({ length: orb.elecCount }).map((_, j) => (
            <Electron
              key={`e-${i}-${j}`}
              radius={orb.radius}
              speed={orb.baseSpeed * rotationSpeed}
              offset={(j / orb.elecCount) * Math.PI * 2}
              tiltX={orb.tiltX}
              tiltZ={orb.tiltZ}
              color={ELECTRON_COLORS[j % ELECTRON_COLORS.length]}
            />
          ))}
        </group>
      ))}

      <BackgroundParticles density={particleDensity} />
    </group>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function OrbitalSystem({
  electronCount = 8,
  rotationSpeed = 1,
  orbitalCount = 4,
  particleDensity = 1,
  enableMouseInteraction = true,
}: OrbitalSystemProps) {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
  }, []);

  // SSR placeholder — nothing rendered
  if (!mounted) {
    return <div className="h-full w-full" />;
  }

  if (reducedMotion) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="relative h-32 w-32">
          <div className="absolute inset-0 animate-glow rounded-full bg-primary-500/20 blur-2xl" />
          <div className="absolute inset-2 rounded-full bg-primary-500/10" />
          <div className="absolute inset-4 rounded-full bg-primary-500/5" />
        </div>
      </div>
    );
  }

  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: enableMouseInteraction ? "auto" : "none",
      }}
    >
      <SceneContent
        electronCount={electronCount}
        rotationSpeed={rotationSpeed}
        orbitalCount={orbitalCount}
        particleDensity={particleDensity}
        enableMouseInteraction={enableMouseInteraction}
      />
    </Canvas>
  );
}
