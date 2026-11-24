import { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls, TorusKnot } from '@react-three/drei';
import { useReducedMotion } from 'motion/react';

function SpinningShape({ kind = 'cube', color = '#5278ed', speed = 0.7 }) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current && speed > 0) ref.current.rotation.y += delta * speed;
  });

  return <Float speed={speed > 0 ? 1.4 : 0} rotationIntensity={0.25} floatIntensity={speed > 0 ? 0.35 : 0}>
    {kind === 'knot' ? <TorusKnot ref={ref} args={[0.85, 0.25, 128, 16]}><meshStandardMaterial color={color} metalness={0.45} roughness={0.2} /></TorusKnot>
      : kind === 'crystal' ? <mesh ref={ref}><icosahedronGeometry args={[1.15, 1]} /><MeshDistortMaterial color={color} roughness={0.16} metalness={0.55} distort={speed > 0 ? 0.18 : 0} speed={speed > 0 ? 2 : 0} /></mesh>
      : <mesh ref={ref}><boxGeometry args={[1.55, 1.55, 1.55]} /><meshStandardMaterial color={color} roughness={0.24} metalness={0.35} /></mesh>}
  </Float>;
}

export default function ThreeBlock({ kind = 'cube', color = '#5278ed', speed = 0.7, height = 300 }) {
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = containerRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: '100px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const effectiveSpeed = reducedMotion ? 0 : speed;
  return <div ref={containerRef} style={{ width: '100%', height, overflow: 'hidden', borderRadius: 18, background: 'radial-gradient(circle, #1b2c5c, #090e20)' }}>
    <Canvas frameloop={visible && !reducedMotion ? 'always' : 'demand'} camera={{ position: [0, 0, 4.5], fov: 45 }} dpr={[1, 1.5]}>
      <ambientLight intensity={1.4} /><directionalLight position={[3, 4, 5]} intensity={2.4} />
      <SpinningShape kind={kind} color={color} speed={effectiveSpeed} />
      <OrbitControls enablePan={false} />
    </Canvas>
    <span className="w3f-sr-only" role="img" aria-label={`Interactive 3D ${kind} shape`} />
  </div>;
}
