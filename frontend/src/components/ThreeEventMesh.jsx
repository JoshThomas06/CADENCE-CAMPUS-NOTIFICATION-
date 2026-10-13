import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeEventMesh() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 520;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 18);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xd95c3a, 3.2, 50);
    keyLight.position.set(10, 8, 10);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x2da8c8, 2.6, 50);
    fillLight.position.set(-10, -6, 8);
    scene.add(fillLight);

    const centerGroup = new THREE.Group();
    scene.add(centerGroup);

    // Outer Geometric Event Ring (Wireframe Icosahedron)
    const sphereGeo = new THREE.IcosahedronGeometry(3.5, 2);
    const sphereMat = new THREE.MeshPhongMaterial({
      color: 0x1b4d5c,
      emissive: 0x0c252d,
      wireframe: true,
      transparent: true,
      opacity: 0.75
    });
    const wireMesh = new THREE.Mesh(sphereGeo, sphereMat);
    centerGroup.add(wireMesh);

    // Concentric Core Rings
    const ring1Geo = new THREE.TorusGeometry(5.2, 0.04, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0xdfa64f, transparent: true, opacity: 0.8 });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = 1.1;
    centerGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(6.6, 0.035, 16, 120);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xd95c3a, transparent: true, opacity: 0.7 });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -0.7;
    ring2.rotation.y = 0.5;
    centerGroup.add(ring2);

    // Inner Pulsing Core
    const innerGeo = new THREE.SphereGeometry(1.6, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xd95c3a,
      roughness: 0.25,
      metalness: 0.35,
      emissive: 0x5a1808,
      emissiveIntensity: 0.4
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    centerGroup.add(innerCore);

    // Orbiting Message Packets
    const packetCount = 28;
    const packets = [];
    const packetGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const palette = [0xd95c3a, 0xdfa64f, 0x38bdf8, 0x4ade80, 0xf4eee2];

    for (let i = 0; i < packetCount; i++) {
      const col = palette[i % palette.length];
      const pMat = new THREE.MeshPhongMaterial({ color: col, emissive: col, emissiveIntensity: 0.3 });
      const pMesh = new THREE.Mesh(packetGeo, pMat);
      const radius = 4.2 + (i % 4) * 1.2;
      const speed = (0.01 + (i % 5) * 0.004) * (i % 2 === 0 ? 1 : -1);
      const incl = (Math.random() - 0.5) * 1.8;
      packets.push({ mesh: pMesh, radius, speed, angle: Math.random() * Math.PI * 2, incl });
      centerGroup.add(pMesh);
    }

    // Background Starfield of Campus Nodes
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 45;
      starPositions[i + 1] = (Math.random() - 0.5) * 30;
      starPositions[i + 2] = (Math.random() - 0.5) * 25 - 5;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xdfa64f, size: 0.12, transparent: true, opacity: 0.5 });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // Mouse Interaction
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    const onMouseMove = (e) => {
      mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
      mouseY = (e.clientY - window.innerHeight / 2) * 0.001;
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

    let clock = new THREE.Clock();
    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      centerGroup.rotation.y = time * 0.15 + targetX * 1.2;
      centerGroup.rotation.x = Math.sin(time * 0.1) * 0.1 + targetY * 1.2;

      wireMesh.rotation.y -= 0.003;
      wireMesh.rotation.z += 0.002;
      ring1.rotation.z += 0.008;
      ring2.rotation.z -= 0.006;

      const scale = 1.0 + Math.sin(time * 2.8) * 0.07;
      innerCore.scale.set(scale, scale, scale);

      packets.forEach(p => {
        p.angle += p.speed;
        p.mesh.position.x = Math.cos(p.angle) * p.radius;
        p.mesh.position.z = Math.sin(p.angle) * p.radius;
        p.mesh.position.y = Math.sin(p.angle * 2 + p.incl) * (p.radius * 0.4);
      });

      starField.rotation.y = time * 0.015;

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full h-[520px] rounded-2xl border border-[#1b4d5c]/40 shadow-2xl relative overflow-hidden bg-[#0c242e]" ref={containerRef}>
      <div className="absolute top-4 left-4 z-10 bg-[#0a1d23]/80 border border-[#dfa64f]/30 text-[#f4eee2] text-[11px] font-mono py-1 px-3 rounded-md backdrop-blur">
        <span className="text-[#dfa64f]">TOPOLOGY:</span> Quad-Core Event Ring • 28 Active Shards
      </div>
      <div className="absolute bottom-4 right-4 z-10 bg-[#0a1d23]/80 border border-[#1b4d5c]/60 text-[#f4eee2] text-[11px] font-mono py-1 px-3 rounded-md backdrop-blur flex items-center space-x-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>LISTENER: socket.on('cadence:fanout')</span>
      </div>
    </div>
  );
}
