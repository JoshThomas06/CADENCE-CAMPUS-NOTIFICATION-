import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeHeroCanvasProps {
  height?: string | number;
  className?: string;
}

export const ThreeHeroCanvas: React.FC<ThreeHeroCanvasProps> = ({
  height = '100%',
  className = 'w-full h-full'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || window.innerWidth;
    const canvasHeight = typeof height === 'number' ? height : (container.clientHeight || 520);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / canvasHeight, 0.1, 1000);
    camera.position.set(0, 2, 16);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const colorTeal = 0x1b4d5c;
    const colorRust = 0xd95c3a;
    const colorGold = 0xdfa64f;
    const colorCream = 0xf4eee2;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(colorRust, 2.8, 40);
    pointLight1.position.set(8, 6, 8);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x2da8c8, 2.5, 40);
    pointLight2.position.set(-8, -4, 6);
    scene.add(pointLight2);

    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // Central Hub Wireframe Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(2.2, 2);
    const coreMat = new THREE.MeshPhongMaterial({
      color: colorTeal,
      emissive: 0x0a2630,
      specular: colorGold,
      shininess: 90,
      wireframe: true,
      transparent: true,
      opacity: 0.82
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    networkGroup.add(coreMesh);

    // Inner Pulsing Event Nucleus
    const nucleusGeo = new THREE.SphereGeometry(1.2, 32, 32);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: colorRust,
      roughness: 0.2,
      metalness: 0.4
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    networkGroup.add(nucleus);

    // Orbiting Rings
    const rings: { mesh: THREE.Mesh; speed: number }[] = [];
    const ringParams = [
      { rad: 3.8, tube: 0.035, col: colorGold, tiltX: 0.6, tiltY: 0.2, speed: 0.008 },
      { rad: 5.0, tube: 0.03, col: 0x38bdf8, tiltX: -0.8, tiltY: 0.5, speed: -0.006 },
      { rad: 6.2, tube: 0.025, col: colorRust, tiltX: 0.4, tiltY: -0.7, speed: 0.01 }
    ];

    ringParams.forEach(p => {
      const torusGeo = new THREE.TorusGeometry(p.rad, p.tube, 16, 100);
      const torusMat = new THREE.MeshBasicMaterial({ color: p.col, transparent: true, opacity: 0.65 });
      const ringMesh = new THREE.Mesh(torusGeo, torusMat);
      ringMesh.rotation.x = p.tiltX;
      ringMesh.rotation.y = p.tiltY;
      networkGroup.add(ringMesh);
      rings.push({ mesh: ringMesh, speed: p.speed });
    });

    // Floating Node Clusters
    const nodesCount = 18;
    const nodeSpheres: { mesh: THREE.Mesh; basePos: THREE.Vector3; speed: number; phase: number }[] = [];
    const nodeGeo = new THREE.SphereGeometry(0.32, 16, 16);
    const colorsList = [colorRust, colorGold, 0x38bdf8, 0x4ade80, colorCream];

    for (let i = 0; i < nodesCount; i++) {
      const c = colorsList[i % colorsList.length];
      const mat = new THREE.MeshPhongMaterial({
        color: c,
        emissive: c,
        emissiveIntensity: 0.2,
        shininess: 100
      });
      const sphere = new THREE.Mesh(nodeGeo, mat);
      const angle = (i / nodesCount) * Math.PI * 2;
      const dist = 4.2 + (i % 3) * 1.5;
      const yOffset = Math.sin(i * 1.5) * 2.2;
      sphere.position.set(Math.cos(angle) * dist, yOffset, Math.sin(angle) * dist);
      networkGroup.add(sphere);
      nodeSpheres.push({
        mesh: sphere,
        basePos: sphere.position.clone(),
        speed: 0.8 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Particle Field
    const particlesCount = 280;
    const particlePositions = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 36;
      particlePositions[i + 1] = (Math.random() - 0.5) * 24;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20 - 4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: colorGold,
      size: 0.12,
      transparent: true,
      opacity: 0.55
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.0012;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.0012;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      networkGroup.rotation.y = time * 0.12 + targetX * 1.5;
      networkGroup.rotation.x = Math.sin(time * 0.08) * 0.1 + targetY * 1.5;

      coreMesh.rotation.y -= 0.004;
      coreMesh.rotation.x += 0.003;
      const pulse = 1.0 + Math.sin(time * 3.0) * 0.08;
      nucleus.scale.set(pulse, pulse, pulse);

      rings.forEach(r => {
        r.mesh.rotation.z += r.speed;
      });

      nodeSpheres.forEach(node => {
        node.mesh.position.y = node.basePos.y + Math.sin(time * node.speed + node.phase) * 0.45;
      });

      particles.rotation.y = time * 0.02;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [height]);

  return <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }} />;
};
