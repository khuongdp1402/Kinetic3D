"use client";

import { Canvas } from "@react-three/fiber";
import { Stage, PresentationControls, useGLTF, Grid, GizmoHelper, GizmoViewport } from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";

interface ModelViewerProps {
  glbUrl: string;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  
  // Calculate fake vertices/faces for the metadata display since traversing can be heavy
  const stats = useMemo(() => {
    let vertices = 0;
    let faces = 0;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) {
          vertices += mesh.geometry.attributes.position.count;
          faces += mesh.geometry.index ? mesh.geometry.index.count / 3 : vertices / 3;
        }
      }
    });
    return { vertices: Math.round(vertices), faces: Math.round(faces) };
  }, [scene]);

  // Dispatch a custom event to send stats up to the parent if needed, 
  // or we can just render the model here.
  return <primitive object={scene} />;
}

export default function ModelViewer({ glbUrl }: ModelViewerProps) {
  return (
    <div className="w-full h-full bg-[#1c1917] relative cursor-grab active:cursor-grabbing rounded-l-2xl overflow-hidden">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 45 }}>
        <color attach="background" args={['#101010']} />
        
        {/* Studio Grid Background */}
        <Grid 
          infiniteGrid 
          fadeDistance={20} 
          sectionColor="#f97316" 
          cellColor="#333333" 
          position={[0, -1, 0]} 
        />
        
        <ambientLight intensity={0.5} />
        
        <Suspense fallback={null}>
          <PresentationControls
            speed={1.5}
            global
            zoom={0.7}
            polar={[-Math.PI / 4, Math.PI / 4]}
          >
            <Stage environment="city" intensity={0.6} adjustCamera={false}>
              <Model url={glbUrl} />
            </Stage>
          </PresentationControls>
        </Suspense>

        {/* Top Right XYZ Gizmo */}
        <GizmoHelper alignment="top-right" margin={[40, 40]}>
          <GizmoViewport axisColors={['#fb923c', '#f97316', '#f97316']} labelColor="white" />
        </GizmoHelper>
      </Canvas>
    </div>
  );
}
