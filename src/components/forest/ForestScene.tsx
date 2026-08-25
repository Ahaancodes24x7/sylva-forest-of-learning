import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { courses, type Concept } from "@/data/sylva";
import { forest3d, type Forest3dPalette } from "./palette3d";

type Props = {
  activeCourseId: string | "all";
  selectedConceptId: string | null;
  onSelectConcept: (id: string) => void;
  isDark: boolean;
  reducedMotion: boolean;
  sproutedConceptIds: string[];
};

function canopyColor(concept: Concept, p: Forest3dPalette) {
  switch (concept.state) {
    case "mastered-fresh":
      return p.canopyDeep;
    case "in-progress":
      return p.canopyMoss;
    case "mastered-decaying":
      return p.canopyDry;
    case "at-risk":
      return p.canopyMoss;
    default:
      return p.seed;
  }
}

function FallingLeaves({ color, reduced }: { color: string; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const seeds = useMemo(
    () => Array.from({ length: 5 }, (_, i) => ({ x: Math.sin(i * 2.1) * 0.5, z: Math.cos(i * 1.7) * 0.5, o: i * 0.7 })),
    [],
  );

  useFrame(({ clock }) => {
    if (!group.current || reduced) return;
    const t = clock.getElapsedTime();
    group.current.children.forEach((child, i) => {
      const phase = (t * 0.35 + seeds[i]!.o) % 1;
      child.position.y = 1.5 - phase * 1.5;
      child.position.x = seeds[i]!.x + Math.sin(phase * 6 + i) * 0.14;
      child.rotation.z = phase * 5;
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
      mat.opacity = 0.85 * (1 - phase);
    });
  });

  return (
    <group ref={group}>
      {seeds.map((s, i) => (
        <mesh key={i} position={[s.x, 1.2, s.z]}>
          <planeGeometry args={[0.13, 0.08]} />
          <meshStandardMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function GoldGlow({ color, reduced }: { color: string; reduced: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const t = clock.getElapsedTime();
    const s = reduced ? 1 : 1 + Math.sin(t * 1.6) * 0.16;
    mesh.current.scale.setScalar(s);
    const mat = mesh.current.material as THREE.MeshBasicMaterial;
    mat.opacity = reduced ? 0.4 : 0.28 + (Math.sin(t * 1.6) + 1) * 0.18;
  });
  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
      <circleGeometry args={[0.85, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

function Tree({
  concept,
  palette,
  reduced,
  selected,
  sprouted,
  onSelect,
}: {
  concept: Concept;
  palette: Forest3dPalette;
  reduced: boolean;
  selected: boolean;
  sprouted: boolean;
  onSelect: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const seed = useMemo(() => Math.random() * 10, []);

  const dormant = concept.state === "not-covered";
  const inProgress = concept.state === "in-progress";
  const decaying = concept.state === "mastered-decaying";
  const atRisk = concept.state === "at-risk";

  const height = dormant ? 0.25 : inProgress || atRisk ? 0.95 : 1.5;
  const canopyScale = (dormant ? 0.25 : inProgress ? 0.55 : decaying ? 0.78 : 1) * (sprouted ? 1.12 : 1);
  const opacity = decaying ? 0.62 : dormant ? 0.5 : 0.96;
  const color = canopyColor(concept, palette);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();
    group.current.rotation.z = reduced ? 0 : Math.sin(t * 0.6 + seed) * (decaying ? 0.015 : 0.032);
    const target = hovered || selected ? 1.08 : 1;
    group.current.scale.lerp(new THREE.Vector3(target, target, target), 0.08);
  });

  return (
    <group position={[concept.pos[0], 0, concept.pos[1]]}>
      {atRisk && <GoldGlow color={palette.gold} reduced={reduced} />}
      <group
        ref={group}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        {dormant ? (
          <>
            <mesh position={[0, 0.1, 0]}>
              <sphereGeometry args={[0.13, 12, 10]} />
              <meshStandardMaterial color={palette.seed} roughness={0.9} />
            </mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
              <ringGeometry args={[0.26, 0.32, 24]} />
              <meshBasicMaterial color={palette.seed} transparent opacity={0.4} />
            </mesh>
          </>
        ) : (
          <>
            <mesh position={[0, height / 2, 0]}>
              <cylinderGeometry args={[0.055, 0.1, height, 7]} />
              <meshStandardMaterial color={palette.trunk} roughness={0.9} />
            </mesh>
            <mesh position={[0, height + 0.35 * canopyScale, 0]} scale={canopyScale}>
              <icosahedronGeometry args={[0.62, 0]} />
              <meshStandardMaterial color={color} roughness={0.75} flatShading transparent opacity={opacity} />
            </mesh>
            <mesh position={[0.26 * canopyScale, height + 0.08, -0.16]} scale={canopyScale * 0.66}>
              <icosahedronGeometry args={[0.5, 0]} />
              <meshStandardMaterial color={color} roughness={0.8} flatShading transparent opacity={opacity * 0.92} />
            </mesh>
            <mesh position={[-0.28 * canopyScale, height + 0.02, 0.18]} scale={canopyScale * 0.58}>
              <icosahedronGeometry args={[0.5, 0]} />
              <meshStandardMaterial color={color} roughness={0.8} flatShading transparent opacity={opacity * 0.88} />
            </mesh>
            {decaying && <FallingLeaves color={palette.canopyDry} reduced={reduced} />}
          </>
        )}
      </group>
    </group>
  );
}

function Pollen({ color, reduced }: { color: string; reduced: boolean }) {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const count = 260;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 1] = Math.random() * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame(({ clock }) => {
    if (!points.current || reduced) return;
    const t = clock.getElapsedTime();
    points.current.rotation.y = t * 0.014;
    points.current.position.y = Math.sin(t * 0.2) * 0.35;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial color={color} size={0.075} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function CameraRig({
  target,
  reduced,
}: {
  target: { x: number; z: number; distance: number };
  reduced: boolean;
}) {
  const controls = useRef<any>(null);
  const desired = useRef(new THREE.Vector3());

  useFrame(({ camera }, delta) => {
    const c = controls.current;
    if (!c) return;
    c.target.lerp(new THREE.Vector3(target.x, 0.8, target.z), 0.05);
    desired.current.set(
      target.x + target.distance * 0.55,
      target.distance * 0.5,
      target.z + target.distance,
    );
    if (!c.__userMoved) {
      camera.position.lerp(desired.current, 0.045);
    }
    if (!reduced) c.autoRotateSpeed = 0.22;
    c.update(delta);
  });

  return (
    <OrbitControls
      ref={controls}
      enableDamping
      dampingFactor={0.08}
      autoRotate={!reduced}
      autoRotateSpeed={0.22}
      minDistance={4}
      maxDistance={34}
      maxPolarAngle={Math.PI / 2.12}
      enablePan={false}
      makeDefault
    />
  );
}

export default function ForestScene({
  activeCourseId,
  selectedConceptId,
  onSelectConcept,
  isDark,
  reducedMotion,
  sproutedConceptIds,
}: Props) {
  const palette = isDark ? forest3d.dark : forest3d.light;
  const visibleCourses = activeCourseId === "all" ? courses : courses.filter((c) => c.id === activeCourseId);

  const cameraTarget = useMemo(() => {
    if (selectedConceptId) {
      for (const course of visibleCourses) {
        const concept = course.concepts.find((c) => c.id === selectedConceptId);
        if (concept) {
          return {
            x: course.grovePosition[0] + concept.pos[0],
            z: course.grovePosition[1] + concept.pos[1],
            distance: 5.5,
          };
        }
      }
    }
    if (visibleCourses.length === 1) {
      return { x: visibleCourses[0]!.grovePosition[0], z: visibleCourses[0]!.grovePosition[1], distance: 12 };
    }
    return { x: 0, z: 0, distance: 18 };
  }, [selectedConceptId, visibleCourses]);

  return (
    <Canvas
      camera={{ position: [14, 11, 20], fov: 42 }}
      dpr={[1, 1.7]}
      gl={{ antialias: true }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={[palette.fog, 30, 74]} />
      <hemisphereLight args={[palette.pollen, palette.groundDark, isDark ? 0.55 : 0.95]} />
      <directionalLight position={[9, 14, 6]} intensity={isDark ? 0.9 : 1.5} color={palette.pollen} />
      <ambientLight intensity={isDark ? 0.35 : 0.5} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <circleGeometry args={[44, 64]} />
        <meshStandardMaterial color={palette.ground} roughness={1} />
      </mesh>

      {visibleCourses.map((course) => (
        <group key={course.id} position={[course.grovePosition[0], 0, course.grovePosition[1]]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
            <circleGeometry args={[4.6, 48]} />
            <meshStandardMaterial color={palette.groundDark} roughness={1} transparent opacity={0.7} />
          </mesh>
          {course.concepts.map((concept) => (
            <Tree
              key={concept.id}
              concept={concept}
              palette={palette}
              reduced={reducedMotion}
              selected={selectedConceptId === concept.id}
              sprouted={sproutedConceptIds.includes(concept.id)}
              onSelect={() => onSelectConcept(concept.id)}
            />
          ))}
        </group>
      ))}

      <Pollen color={palette.pollen} reduced={reducedMotion} />
      <CameraRig target={cameraTarget} reduced={reducedMotion} />
    </Canvas>
  );
}
