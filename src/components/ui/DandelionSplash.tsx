"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, DepthOfField, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface SeedParticle {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  rotVel: THREE.Vector3;
  outVec: THREE.Vector3;
  target: THREE.Vector3;
  hasTarget: boolean;
  isDetached: boolean;
  detachDelay: number;
  baseScale: number;
  flower: 0 | 1; // which of the two dandelion flowers this seed belongs to
  stemLength: number;
  opacity: number;
}

interface DandelionSplashProps {
  onComplete: () => void;
  onSkip: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE TIMING (seconds)
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  S1_END:   1.5,   // Single seed close-up ends
  S2_END:   3.0,   // Flower fully revealed (longer reveal)
  S3_END:   4.5,   // Wind begins, seeds detach
  S4_END:   6.0,   // Seeds in 3D flight
  S5_END:   7.2,   // Logo shape formed (more convergence time)
  S6_END:   8.0,   // Brand name + tagline
  S7_END:   9.0,   // Background transparent, homepage visible
  S8_END:  10.0,   // Seeds dissolved, animation complete
};

// Single centered dandelion flower
const FLOWER_CENTER_POS = new THREE.Vector3(0, 0, 0);
const TOTAL_SEEDS = 300;

// Fibonacci sphere helper
function fibonacciSphere(count: number, radius: number) {
  const pts: THREE.Vector3[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    pts.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius));
  }
  return pts;
}

// ─────────────────────────────────────────────────────────────────────────────
// SINGLE SEED CLOSE-UP (Scene 1)
// ─────────────────────────────────────────────────────────────────────────────
const SingleSeed = ({ visible }: { visible: boolean }) => {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 0.6) * 0.15;
    groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.1;
    groupRef.current.position.y = Math.sin(t * 0.8) * 0.05;
  });
  if (!visible) return null;
  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Long elegant stem */}
      <mesh rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.015, 1.8, 6]} />
        <meshPhysicalMaterial color="#d4b896" roughness={0.4} metalness={0.1} />
      </mesh>
      {/* Seed body at top */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshPhysicalMaterial color="#d0c8b8" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Parachute wisps – 24 thin spokes radiating outward */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const spread = 0.45;
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * spread * 0.5,
              0.9 + 0.35,
              Math.sin(angle) * spread * 0.5,
            ]}
            rotation={[Math.cos(angle) * 0.7, 0, Math.sin(angle) * 0.7 + Math.PI]}
          >
            <cylinderGeometry args={[0.002, 0.001, 0.8, 3]} />
            <meshPhysicalMaterial
              color="#f0ede8"
              roughness={0.2}
              transparent
              opacity={0.85}
            />
          </mesh>
        );
      })}
      {/* Tip sphere at very top */}
      <mesh position={[0, 0.9 + 0.75, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.1} emissive="#aaffee" emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// ONE DANDELION FLOWER
// ─────────────────────────────────────────────────────────────────────────────
const DandelionFlower = ({ 
  position, 
  seedCount, 
  visible, 
  showSeeds 
}: { 
  position: THREE.Vector3; 
  seedCount: number; 
  visible: boolean;
  showSeeds: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const pts = useMemo(() => fibonacciSphere(seedCount, 0.55), [seedCount]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(t * 0.4 + position.x) * 0.06;
    groupRef.current.rotation.x = Math.cos(t * 0.3) * 0.04;
  });

  if (!visible) return null;

  return (
    <group ref={groupRef} position={position.toArray()}>
      {/* Main stem */}
      <mesh position={[0, -1.5, 0]}>
        <cylinderGeometry args={[0.018, 0.025, 2.5, 8]} />
        <meshPhysicalMaterial color="#6a8a5a" roughness={0.7} />
      </mesh>
      {/* Receptacle core */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshPhysicalMaterial color="#2a1f0a" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Seeds radiating outward (only if not yet detached) */}
      {showSeeds && pts.map((pt, i) => {
        const dir = pt.clone().normalize();
        const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        const euler = new THREE.Euler().setFromQuaternion(quat);
        return (
          <group key={i} rotation={euler.toArray() as [number, number, number, THREE.EulerOrder]} position={pt.toArray()}>
            <mesh>
              <cylinderGeometry args={[0.003, 0.003, 0.5, 4]} />
              <meshPhysicalMaterial color="#c0b080" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.28, 0]}>
              <sphereGeometry args={[0.032, 6, 6]} />
              <meshPhysicalMaterial color="#f8f4ee" roughness={0.2} transparent opacity={0.9} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SEED PARTICLE SYSTEM (Scenes 3 – 8)
// ─────────────────────────────────────────────────────────────────────────────
const SeedParticleSystem = ({
  onPhaseChange,
  onLogoGlowChange,
  isMobile,
}: {
  onPhaseChange: (p: number) => void;
  onLogoGlowChange: (g: number) => void;
  isMobile: boolean;
}) => {
  const stemsRef  = useRef<THREE.InstancedMesh>(null);
  const fluffsRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();

  const count = isMobile ? Math.floor(TOTAL_SEEDS * 0.5) : TOTAL_SEEDS;

  const particles = useMemo<SeedParticle[]>(() => {
    const list: SeedParticle[] = [];
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / (count - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;

      const startPos = new THREE.Vector3(
        FLOWER_CENTER_POS.x + x * 0.55,
        FLOWER_CENTER_POS.y + y * 0.55,
        FLOWER_CENTER_POS.z + z * 0.55
      );
      const outVec = new THREE.Vector3(x, y, z).normalize();
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), outVec);
      const euler = new THREE.Euler().setFromQuaternion(quat);

      list.push({
        pos: startPos.clone(),
        vel: new THREE.Vector3(),
        rot: euler,
        rotVel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15,
          (Math.random() - 0.5) * 0.15
        ),
        outVec,
        target: new THREE.Vector3(),
        hasTarget: false,
        isDetached: false,
        detachDelay: Math.random() * 1.2,
        baseScale: 0.7 + Math.random() * 0.5,
        flower: 0,
        stemLength: 0.45 + Math.random() * 0.15,
        opacity: 1,
      });
    }
    return list;
  }, [count]);

  // Precompute logo targets from the CPP logo image
  useEffect(() => {
    const img = new Image();
    img.src = "/assets/current_logo.png";
    img.onload = () => {
      const offCanvas = document.createElement("canvas");
      const ctx = offCanvas.getContext("2d");
      if (!ctx) return;

      const aspect = img.naturalWidth / img.naturalHeight;
      const drawW = 300;
      const drawH = Math.floor(drawW / aspect);
      offCanvas.width = drawW;
      offCanvas.height = drawH;
      ctx.drawImage(img, 0, 0, drawW, drawH);

      const data = ctx.getImageData(0, 0, drawW, drawH).data;
      const edgePts: { nx: number; ny: number }[] = [];

      for (let py = 1; py < drawH - 1; py += 2) {
        for (let px = 1; px < drawW - 1; px += 2) {
          const idx = (py * drawW + px) * 4;
          if (data[idx + 3] > 100) {
            const up    = data[((py - 1) * drawW + px) * 4 + 3];
            const down  = data[((py + 1) * drawW + px) * 4 + 3];
            const left  = data[(py * drawW + (px - 1)) * 4 + 3];
            const right = data[(py * drawW + (px + 1)) * 4 + 3];
            if (up < 100 || down < 100 || left < 100 || right < 100) {
              edgePts.push({ nx: px / drawW - 0.5, ny: -(py / drawH - 0.5) });
            }
          }
        }
      }
      edgePts.sort(() => Math.random() - 0.5);

      const logoW = Math.min(viewport.width * 0.55, 7);
      const logoH = logoW / aspect;

      for (let i = 0; i < particles.length; i++) {
        const ep = edgePts[i % edgePts.length];
        particles[i].target.set(ep.nx * logoW, ep.ny * logoH + 0.2, 0);
        particles[i].hasTarget = true;
      }
    };
  }, [particles, viewport]);

  const dummy      = useMemo(() => new THREE.Object3D(), []);
  const fluffDummy = useMemo(() => new THREE.Object3D(), []);
  // Reusable tmp vector to compute fluff world offset without GC
  const tmpVec     = useMemo(() => new THREE.Vector3(), []);
  const tmpMat     = useMemo(() => new THREE.Matrix4(), []);
  const startTime  = useRef(performance.now());
  const phase      = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const t  = (performance.now() - startTime.current) / 1000;

    // Phase transitions
    let newPhase = phase.current;
    if      (t < T.S1_END) newPhase = 1;
    else if (t < T.S2_END) newPhase = 2;
    else if (t < T.S3_END) newPhase = 3;
    else if (t < T.S4_END) newPhase = 4;
    else if (t < T.S5_END) newPhase = 5;
    else if (t < T.S6_END) newPhase = 6;
    else if (t < T.S7_END) newPhase = 7;
    else                   newPhase = 8;

    if (newPhase !== phase.current) {
      phase.current = newPhase;
      onPhaseChange(newPhase);
    }

    const logoGlow = t > T.S5_END
      ? Math.min(1, (t - T.S5_END) / 1.0)
      : 0;
    onLogoGlowChange(logoGlow);

    if (!stemsRef.current || !fluffsRef.current) return;

    for (let i = 0; i < count; i++) {
      const p = particles[i];

      // Scene 3+: wind begins
      if (t >= T.S2_END && t < T.S4_END) {
        const scatterT = t - T.S2_END;
        if (scatterT > p.detachDelay) {
          if (!p.isDetached) {
            p.isDetached = true;
            // Initial pop outward + wind
            p.vel.copy(p.outVec).multiplyScalar(1.8 + Math.random());
            p.vel.x += (Math.random() - 0.3) * 3.0;
            p.vel.y += 0.5 + Math.random() * 1.5;
            p.vel.z += (Math.random() - 0.5) * 2.0;
          }
          // Continuous turbulence
          p.vel.x += Math.sin(t * 2.1 + p.pos.y * 3) * 0.08;
          p.vel.y += Math.cos(t * 1.7 + p.pos.x * 2) * 0.04;
          p.vel.z += Math.sin(t * 2.5 + p.pos.z * 2) * 0.06;
          p.vel.multiplyScalar(0.97);
          p.pos.addScaledVector(p.vel, dt);
        }
      } else if (t >= T.S4_END && t < T.S5_END) {
        // Scene 5: converge to logo shape
        if (p.hasTarget) {
          const toTarget = p.target.clone().sub(p.pos);
          const dist = toTarget.length();
          if (dist > 0.02) {
            const speed = THREE.MathUtils.clamp(dist * 4.0, 0.5, 8.0);
            toTarget.normalize().multiplyScalar(speed);
            p.vel.lerp(toTarget, dt * 5.0);
            p.pos.addScaledVector(p.vel, dt);
          } else {
            p.vel.multiplyScalar(0.8);
          }
          // Gentle settling turbulence
          p.vel.x += Math.sin(t * 3 + i) * 0.01;
          p.vel.y += Math.cos(t * 2 + i) * 0.01;
        }
        // Orient toward camera
        p.rot.x = THREE.MathUtils.lerp(p.rot.x, Math.PI / 2, dt * 3);
        p.rot.y = THREE.MathUtils.lerp(p.rot.y, 0, dt * 3);
        p.rot.z = THREE.MathUtils.lerp(p.rot.z, 0, dt * 3);
      } else if (t >= T.S5_END) {
        // Gentle idle float after formation
        p.vel.x += Math.sin(t * 0.5 + i * 0.1) * 0.005;
        p.vel.y += Math.cos(t * 0.4 + i * 0.15) * 0.003;
        p.vel.multiplyScalar(0.99);
        p.pos.addScaledVector(p.vel, dt);

        // Dissolve opacity in final scene
        if (t > T.S7_END) {
          p.opacity = Math.max(0, 1 - (t - T.S7_END) / 1.0);
        }
      }

      // Rotation (only while flying)
      if (p.isDetached && t < T.S4_END + 0.5) {
        p.rot.x += p.rotVel.x;
        p.rot.y += p.rotVel.y;
        p.rot.z += p.rotVel.z;
      }

      const sc = p.baseScale * (t > T.S4_END ? 0.55 : 1.0);

      // Stem
      dummy.position.copy(p.pos);
      dummy.rotation.copy(p.rot);
      dummy.scale.setScalar(sc);
      dummy.updateMatrix();
      stemsRef.current.setMatrixAt(i, dummy.matrix);

      // Fluff: offset along the stem's LOCAL +Y axis using rotation matrix
      // tmpVec = local tip offset = (0, stemLength*sc*0.5, 0)
      // Then rotate it by the seed's euler to get world offset
      tmpMat.makeRotationFromEuler(p.rot);
      tmpVec.set(0, p.stemLength * sc * 0.5, 0).applyMatrix4(tmpMat);
      fluffDummy.position.copy(p.pos).add(tmpVec);
      fluffDummy.rotation.copy(p.rot);
      fluffDummy.scale.setScalar(sc);
      fluffDummy.updateMatrix();
      fluffsRef.current.setMatrixAt(i, fluffDummy.matrix);

      // Dissolve material opacity in Scene 8
      if (t > T.S7_END) {
        const matS = stemsRef.current.material as THREE.MeshPhysicalMaterial;
        const matF = fluffsRef.current.material as THREE.MeshPhysicalMaterial;
        const fade = Math.max(0, 1 - (t - T.S7_END) / 1.0);
        matS.opacity = fade;
        matF.opacity = fade * 0.88;
      }
    }

    stemsRef.current.instanceMatrix.needsUpdate  = true;
    fluffsRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      <instancedMesh ref={stemsRef} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[0.005, 0.007, 0.5, 5]} />
        <meshPhysicalMaterial
          color="#c8b87a"
          roughness={0.5}
          metalness={0.1}
          transparent
        />
      </instancedMesh>

      <instancedMesh ref={fluffsRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.07, 7, 7]} />
        <meshPhysicalMaterial
          color="#f5f0e8"
          roughness={0.15}
          metalness={0.05}
          emissive="#88ccbb"
          emissiveIntensity={0.08}
          transparent
          opacity={0.88}
        />
      </instancedMesh>
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CAMERA CONTROLLER
// ─────────────────────────────────────────────────────────────────────────────
const CameraController = ({ isMobile }: { isMobile: boolean }) => {
  const { camera } = useThree();
  const startTime = useRef(performance.now());

  useFrame(() => {
    const t = (performance.now() - startTime.current) / 1000;
    const cam = camera as THREE.PerspectiveCamera;

    // Scene 1: Very close macro shot of single seed
    if (t < T.S1_END) {
      const prog = t / T.S1_END;
      cam.position.set(
        Math.sin(prog * 0.8) * 0.15,
        Math.cos(prog * 0.6) * 0.1 + 0.1,
        1.8 - prog * 0.2
      );
      cam.fov = THREE.MathUtils.lerp(cam.fov, 28, 0.04);
    }
    // Scene 2: Pull back to reveal both flowers
    else if (t < T.S2_END) {
      const prog = (t - T.S1_END) / (T.S2_END - T.S1_END);
      const eased = 1 - Math.pow(1 - prog, 3);
      cam.position.set(
        THREE.MathUtils.lerp(0.15, 0, eased),
        THREE.MathUtils.lerp(0.2, 0.3, eased),
        THREE.MathUtils.lerp(1.6, 5.5, eased)
      );
      cam.fov = THREE.MathUtils.lerp(cam.fov, 48, 0.05);
    }
    // Scene 3: Stable, slight drift
    else if (t < T.S3_END) {
      const prog = (t - T.S2_END) / (T.S3_END - T.S2_END);
      cam.position.set(
        Math.sin(prog * Math.PI) * 0.5,
        0.3 + Math.cos(prog * 1.2) * 0.2,
        5.5
      );
      cam.fov = THREE.MathUtils.lerp(cam.fov, 52, 0.03);
    }
    // Scene 4: Move through the particles
    else if (t < T.S4_END) {
      const prog = (t - T.S3_END) / (T.S4_END - T.S3_END);
      cam.position.set(
        Math.sin(prog * Math.PI * 1.5) * 1.2,
        Math.cos(prog * 1.8) * 0.6 + 0.2,
        5.0 + prog * 2.0
      );
      cam.fov = THREE.MathUtils.lerp(cam.fov, 58, 0.02);
    }
    // Scene 5: Pull back further, logo shape
    else if (t < T.S5_END) {
      const prog = (t - T.S4_END) / (T.S5_END - T.S4_END);
      const eased = 1 - Math.pow(1 - prog, 2);
      cam.position.set(
        THREE.MathUtils.lerp(cam.position.x, 0, 0.04),
        THREE.MathUtils.lerp(cam.position.y, 0, 0.04),
        THREE.MathUtils.lerp(cam.position.z, 8.0, 0.04)
      );
      cam.fov = THREE.MathUtils.lerp(cam.fov, 52, 0.03);
    }
    // Scenes 6-8: Settle steady
    else {
      cam.position.set(
        THREE.MathUtils.lerp(cam.position.x, 0, 0.03),
        THREE.MathUtils.lerp(cam.position.y, 0, 0.03),
        THREE.MathUtils.lerp(cam.position.z, 9.0, 0.02)
      );
      cam.fov = THREE.MathUtils.lerp(cam.fov, 50, 0.02);
    }

    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();
  });

  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT DUST PARTICLES
// ─────────────────────────────────────────────────────────────────────────────
const AmbientDust = ({ count = 80 }: { count?: number }) => {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const dust = useMemo(() =>
    Array.from({ length: count }, () => ({
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8
      ),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.3,
        (Math.random() - 0.5) * 0.15,
        0
      ),
      size: 0.02 + Math.random() * 0.04,
    })), [count]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    dust.forEach((d, i) => {
      d.pos.addScaledVector(d.vel, dt);
      if (d.pos.x > 9)  d.pos.x = -9;
      if (d.pos.x < -9) d.pos.x = 9;
      if (d.pos.y > 5)  d.pos.y = -5;
      if (d.pos.y < -5) d.pos.y = 5;
      dummy.position.copy(d.pos);
      dummy.scale.setScalar(d.size);
      dummy.updateMatrix();
      ref.current!.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#88bbcc" transparent opacity={0.25} />
    </instancedMesh>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// VOLUMETRIC LIGHT RAYS (billboard planes)
// ─────────────────────────────────────────────────────────────────────────────
const VolumetricRays = ({ visible }: { visible: boolean }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const m = meshRef.current.material as THREE.MeshBasicMaterial;
    m.opacity = visible
      ? 0.06 + Math.sin(clock.getElapsedTime() * 0.5) * 0.02
      : 0;
  });
  return (
    <mesh ref={meshRef} position={[0, 0, -4]} rotation={[0, 0, 0]}>
      <planeGeometry args={[24, 18]} />
      <meshBasicMaterial
        color="#1a6a7a"
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// FULL 3D SCENE
// ─────────────────────────────────────────────────────────────────────────────
const Scene = ({
  isMobile,
  onPhaseChange,
  onLogoGlowChange,
}: {
  isMobile: boolean;
  onPhaseChange: (p: number) => void;
  onLogoGlowChange: (g: number) => void;
}) => {
  const [phase, setPhase] = useState(1);

  const handlePhase = useCallback((p: number) => {
    setPhase(p);
    onPhaseChange(p);
  }, [onPhaseChange]);

  return (
    <>
      <CameraController isMobile={isMobile} />

      {/* Lighting */}
      <ambientLight intensity={0.35} color="#c0d8e8" />
      <pointLight position={[0, 5, 3]} intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, -2, 2]} intensity={0.6} color="#1a8a7a" />
      <pointLight position={[3, 2, -2]} intensity={0.4} color="#e9c46a" />
      <spotLight
        position={[0, 6, -5]}
        angle={0.6}
        penumbra={0.8}
        intensity={3.0}
        color="#e9c46a"
        castShadow={false}
      />

      <Environment preset="night" />

      {/* Scene 1: Single seed */}
      <SingleSeed visible={phase === 1} />

      {/* Scene 2-4: Single centered dandelion flower */}
      <DandelionFlower
        position={FLOWER_CENTER_POS}
        seedCount={isMobile ? 80 : 140}
        visible={phase >= 2}
        showSeeds={phase <= 2}
      />

      {/* Seed particle system (detaches and forms logo) */}
      <SeedParticleSystem
        onPhaseChange={handlePhase}
        onLogoGlowChange={onLogoGlowChange}
        isMobile={isMobile}
      />

      {/* Volumetric atmosphere */}
      <VolumetricRays visible={phase >= 2} />
      <AmbientDust count={isMobile ? 40 : 80} />
    </>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const DandelionSplash: React.FC<DandelionSplashProps> = ({
  onComplete,
  onSkip,
}) => {
  const [phase, setPhase] = useState(1);
  const [logoGlow, setLogoGlow] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const timer = setTimeout(onComplete, (T.S8_END + 0.5) * 1000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Background stays dark until scene 7 (seeds in flight look cinematic on dark)
  const bgOpacity   = phase >= 7 ? 0 : 1;
  // Logo and text only appear once seeds have assembled (scene 6)
  const showLogo    = false;
  const showTagline = false;

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ pointerEvents: "none" }}>

      {/* ── Cinematic dark background (fades out in Scene 7) ── */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{
          background: "#000000",
        }}
        animate={{ opacity: bgOpacity }}
        transition={{ duration: 2.0, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* ── 3D WebGL Canvas ── */}
      <div className="absolute inset-0 z-10">
        <Canvas
          gl={{
            alpha: true,
            antialias: !isMobile,
            powerPreference: "high-performance",
            stencil: false,
            depth: true,
          }}
          dpr={isMobile ? [1, 1.5] : [1, 2]}
          camera={{ position: [0, 0.1, 1.8], fov: 28, near: 0.01, far: 200 }}
        >
          <Scene
            isMobile={isMobile}
            onPhaseChange={setPhase}
            onLogoGlowChange={setLogoGlow}
          />

          <EffectComposer disableNormalPass multisampling={isMobile ? 0 : 4}>
            {!isMobile ? (
              <DepthOfField
                focusDistance={0.01}
                focalLength={0.025}
                bokehScale={phase <= 2 ? 4 : 1.5}
                height={480}
              />
            ) : <></>}
            <Bloom
              luminanceThreshold={0.55}
              luminanceSmoothing={0.85}
              height={isMobile ? 200 : 350}
              intensity={phase >= 6 ? 2.2 : 0.9}
            />
            <Vignette eskil={false} offset={0.25} darkness={0.7} />
          </EffectComposer>
        </Canvas>
      </div>

      {/* ── 2D UI Overlay ── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center" style={{ pointerEvents: "none" }}>

        {/* Official CPP logo image */}
        <AnimatePresence>
          {showLogo && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: logoGlow, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute flex flex-col items-center gap-6"
              style={{ top: "50%", transform: "translate(-50%, -62%)", left: "50%" }}
            >
              <img
                src="/assets/current_logo.png"
                alt="Centre for Peace Praxis"
                className="w-36 sm:w-52 md:w-64"
                style={{
                  filter: `drop-shadow(0 0 ${20 * logoGlow}px rgba(233,196,106,0.55)) drop-shadow(0 0 ${8 * logoGlow}px rgba(42,157,143,0.4))`,
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Brand name + tagline */}
        <AnimatePresence>
          {showTagline && (
            <motion.div
              key="tagline"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut", delay: 0.4 }}
              className="absolute text-center"
              style={{ top: "56%", left: "50%", transform: "translateX(-50%)" }}
            >
              <h1
                className="font-serif font-bold tracking-wide"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 3rem)",
                  color: phase >= 7 ? "#1e3a4a" : "#f0f8ff",
                  textShadow: phase >= 7 ? "none" : "0 2px 24px rgba(42,157,143,0.5)",
                  transition: "color 1.5s ease, text-shadow 1.5s ease",
                }}
              >
                Centre for{" "}
                <span style={{ color: "#1A5F7A" }}>Peace Praxis</span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="mt-2 tracking-[0.28em] uppercase font-semibold"
                style={{
                  fontSize: "clamp(0.55rem, 1.5vw, 0.8rem)",
                  color: phase >= 7 ? "#4a6a7a" : "rgba(255,255,255,0.72)",
                  transition: "color 1.5s ease",
                }}
              >
                Hope&nbsp;•&nbsp;Healing&nbsp;•&nbsp;Resilience
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Skip Intro Button ── */}
      <button
        onClick={onSkip}
        style={{ pointerEvents: "auto" }}
        className="absolute top-5 right-5 z-30 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/40 border border-white/15 rounded-full hover:text-white/80 hover:border-white/40 hover:bg-white/8 transition-all duration-300 backdrop-blur-sm"
      >
        Skip Intro
      </button>
    </div>
  );
};
