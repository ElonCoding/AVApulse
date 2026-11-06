import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Interactive 3D Spatial Wireframe Globe & Avalanche Subnet Mesh Visualizer.
 * Displays real-time rotating node topology and spatial encrypted transaction flows.
 */
export default function SpatialScene({ height = '340px' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 18;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    currentMount.appendChild(renderer.domElement);

    // 1. Central Spatial Core (Encrypted Compute Orb)
    const coreGeo = new THREE.IcosahedronGeometry(4, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xE84142,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // 2. Inner Glowing Kernel
    const innerGeo = new THREE.SphereGeometry(2.2, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // 3. Floating Avalanche Validator Nodes (Point Cloud / Satellite Cluster)
    const nodeCount = 38;
    const nodeGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(nodeCount * 3);
    const colors = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount; i++) {
      const radius = 6.5 + (Math.random() - 0.5) * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Red to White Avalanche color spectrum
      colors[i * 3] = 0.9 + Math.random() * 0.1;
      colors[i * 3 + 1] = 0.25 + Math.random() * 0.3;
      colors[i * 3 + 2] = 0.25 + Math.random() * 0.3;
    }

    nodeGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const nodeMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });
    const nodePoints = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodePoints);

    // 4. Orbital Trajectory Rings
    const ringGeo = new THREE.RingGeometry(7.8, 7.85, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xE84142,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.2,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.8;
    scene.add(ringMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotations
      coreMesh.rotation.y += 0.003;
      coreMesh.rotation.x += 0.0015;

      innerMesh.rotation.y -= 0.005;

      nodePoints.rotation.y += 0.002;
      nodePoints.rotation.z += 0.001;

      ringMesh.rotation.z += 0.002;

      // Gentle camera parallax
      camera.position.x += (mouseX * 2.5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 2.5 - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height,
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        background: 'radial-gradient(circle at center, rgba(232, 65, 66, 0.08) 0%, rgba(15, 23, 42, 0) 70%)',
      }}
    />
  );
}
