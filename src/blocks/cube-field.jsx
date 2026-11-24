import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import {
  advanceCubeBodies,
  bounceCubeFromPointer,
  createCubeBodies,
} from "./cube-physics.js";

function CubeSimulation({ count, color, secondaryColor }) {
  const viewport = useThree((state) => state.viewport);
  const bodies = useMemo(
    () => createCubeBodies(count, viewport.width, viewport.height),
    [count, viewport.width, viewport.height],
  );
  const reducedMotion = useReducedMotion();

  useFrame((_, elapsed) => {
    if (!reducedMotion) {
      advanceCubeBodies(bodies, elapsed, viewport.width, viewport.height);
    }
  });

  return bodies.map((body, index) => (
    <mesh
      key={index}
      ref={(mesh) => {
        body.mesh = mesh;
      }}
      position={body.position}
      rotation={body.rotation}
      onPointerOver={(event) => {
        event.stopPropagation();
        body.hovered = true;
        body.pointer = [event.point.x, event.point.y, event.point.z];
        bounceCubeFromPointer(body, body.pointer);
      }}
      onPointerMove={(event) => {
        body.pointer = [event.point.x, event.point.y, event.point.z];
      }}
      onPointerOut={() => {
        body.hovered = false;
        body.pointer = null;
      }}
    >
      <boxGeometry args={[0.46, 0.46, 0.46]} />
      <meshStandardMaterial
        color={body.colorVariant === 0 ? color : secondaryColor}
        roughness={0.28}
        metalness={0.22}
      />
    </mesh>
  ));
}

export default function CubeFieldBlock({
  color = "#6d8cff",
  secondaryColor = "#f4a261",
  background = "#10182d",
  count = 144,
  height = 340,
}) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "100px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height,
        overflow: "hidden",
        borderRadius: 18,
        backgroundColor: background,
      }}
    >
      <Canvas
        frameloop={visible && !reducedMotion ? "always" : "demand"}
        camera={{ position: [0, 0, 9], fov: 42 }}
        dpr={[1, 1.5]}
      >
        <ambientLight intensity={1.3} />
        <directionalLight position={[3, 5, 6]} intensity={2.2} />
        <CubeSimulation
          count={count}
          color={color}
          secondaryColor={secondaryColor}
        />
      </Canvas>
      <span
        className="w3f-sr-only"
        role="img"
        aria-label="Interactive 3D cube field. Hover over the many cubes to push them into each other."
      />
    </div>
  );
}
