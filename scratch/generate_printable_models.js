const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const THREE = require('three');
const { GLTFExporter } = require('three/examples/jsm/exporters/GLTFExporter.js');

const destDir = path.resolve('src/Kinetic3D.WebUI_V2/public/models');
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

function exportGLB(scene, filename) {
  return new Promise((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (gltf) => {
        const filePath = path.join(destDir, filename);
        fs.writeFileSync(filePath, Buffer.from(gltf));
        console.log(`Exported ${filename}: ${fs.statSync(filePath).size} bytes`);
        resolve();
      },
      (error) => {
        console.error(`Error exporting ${filename}:`, error);
        reject(error);
      },
      { binary: true }
    );
  });
}

// 1. Phone Stand & Cable Dock
function createPhoneStandScene() {
  const scene = new THREE.Scene();
  const matBase = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.2 });
  const matAccent = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.3, metalness: 0.4 });
  const matRubber = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });

  // Base Plate
  const baseGeom = new THREE.BoxGeometry(2.0, 0.25, 2.4);
  const base = new THREE.Mesh(baseGeom, matBase);
  base.position.set(0, 0.125, 0);
  scene.add(base);

  // Angled Back Rest (Phone Backplate, 65 deg tilt)
  const backGeom = new THREE.BoxGeometry(1.8, 2.8, 0.18);
  const back = new THREE.Mesh(backGeom, matBase);
  back.rotation.x = -0.35;
  back.position.set(0, 1.4, -0.3);
  scene.add(back);

  // Cable Pass-Through Channel cutout slot
  const cableSlotGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.5, 16);
  const cableSlot = new THREE.Mesh(cableSlotGeom, matAccent);
  cableSlot.rotation.x = Math.PI / 2;
  cableSlot.position.set(0, 0.5, -0.15);
  scene.add(cableSlot);

  // Front Supporting Lip / Cradle
  const lipGeom = new THREE.BoxGeometry(1.8, 0.45, 0.25);
  const lip = new THREE.Mesh(lipGeom, matAccent);
  lip.position.set(0, 0.4, 0.65);
  scene.add(lip);

  // Anti-slip pads
  const pad1 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.8), matRubber);
  pad1.position.set(-0.65, 0.26, 0.5);
  scene.add(pad1);

  const pad2 = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.05, 0.8), matRubber);
  pad2.position.set(0.65, 0.26, 0.5);
  scene.add(pad2);

  // Back Cable Winder Clips
  const clip1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12), matAccent);
  clip1.rotation.z = Math.PI / 2;
  clip1.position.set(0.6, 1.0, -0.9);
  scene.add(clip1);

  const clip2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.6, 12), matAccent);
  clip2.rotation.z = Math.PI / 2;
  clip2.position.set(-0.6, 1.0, -0.9);
  scene.add(clip2);

  return scene;
}

// 2. Desk Schedule & Calendar Wheel (Thời khóa biểu & Lịch xoay cơ học)
function createScheduleWheelScene() {
  const scene = new THREE.Scene();
  const matWood = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7, metalness: 0.1 });
  const matBrass = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35, metalness: 0.7 });
  const matRing1 = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4 });
  const matRing2 = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
  const matRing3 = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 });

  // Main Stand Base
  const baseGeom = new THREE.CylinderGeometry(1.6, 1.8, 0.35, 32);
  const base = new THREE.Mesh(baseGeom, matWood);
  base.position.set(0, 0.175, 0);
  scene.add(base);

  // Central Vertical Pillar
  const pillarGeom = new THREE.CylinderGeometry(0.2, 0.2, 2.2, 24);
  const pillar = new THREE.Mesh(pillarGeom, matBrass);
  pillar.position.set(0, 1.2, 0);
  scene.add(pillar);

  // Dial Ring 1: Day of week (Thứ 2 - CN)
  const ring1Geom = new THREE.CylinderGeometry(1.3, 1.3, 0.4, 7);
  const ring1 = new THREE.Mesh(ring1Geom, matRing1);
  ring1.position.set(0, 0.6, 0);
  scene.add(ring1);

  // Dial Ring 2: Period / Subject (Tiết học / Ca làm)
  const ring2Geom = new THREE.CylinderGeometry(1.05, 1.05, 0.45, 10);
  const ring2 = new THREE.Mesh(ring2Geom, matRing2);
  ring2.position.set(0, 1.15, 0);
  scene.add(ring2);

  // Dial Ring 3: Month / Date (Ngày trong tháng)
  const ring3Geom = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 12);
  const ring3 = new THREE.Mesh(ring3Geom, matRing3);
  ring3.position.set(0, 1.7, 0);
  scene.add(ring3);

  // Top Finial Knob
  const knobGeom = new THREE.SphereGeometry(0.32, 24, 24);
  const knob = new THREE.Mesh(knobGeom, matBrass);
  knob.position.set(0, 2.2, 0);
  scene.add(knob);

  // Pointer Needle
  const needleGeom = new THREE.ConeGeometry(0.12, 1.5, 4);
  const needle = new THREE.Mesh(needleGeom, matBrass);
  needle.rotation.x = Math.PI / 2;
  needle.position.set(0, 1.15, 1.35);
  scene.add(needle);

  return scene;
}

// 3. Cyberpunk Artisan Keycap 1U
function createKeycapScene() {
  const scene = new THREE.Scene();
  const matBody = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.35, metalness: 0.3 });
  const matVisor = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.8, emissive: 0x0284c7, emissiveIntensity: 0.6 });
  const matAccent = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.4, metalness: 0.5 });

  // 1U Keycap Body
  const keyGeom = new THREE.CylinderGeometry(0.65, 0.88, 0.7, 4);
  keyGeom.rotateY(Math.PI / 4);
  const keyBase = new THREE.Mesh(keyGeom, matBody);
  keyBase.position.set(0, 0.35, 0);
  scene.add(keyBase);

  // Cyber Head Visor
  const visorGeom = new THREE.BoxGeometry(0.8, 0.22, 0.35);
  const visor = new THREE.Mesh(visorGeom, matVisor);
  visor.position.set(0, 0.55, 0.3);
  scene.add(visor);

  // Top Mecha Ear Fins
  const ear1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.5), matAccent);
  ear1.position.set(-0.45, 0.6, 0);
  scene.add(ear1);

  const ear2 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.5), matAccent);
  ear2.position.set(0.45, 0.6, 0);
  scene.add(ear2);

  // Top Exhaust Vents
  for (let i = -2; i <= 2; i++) {
    const vent = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.04, 0.08), matAccent);
    vent.position.set(0, 0.72, i * 0.12);
    scene.add(vent);
  }

  // Bottom Cross Mount (Cherry MX Stem)
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.2, 16), matBody);
  stem.position.set(0, -0.05, 0);
  scene.add(stem);

  return scene;
}

// Download external models
function downloadFile(url, filename) {
  const filePath = path.join(destDir, filename);
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
    console.log(`${filename} already exists (${fs.statSync(filePath).size} bytes)`);
    return;
  }
  console.log(`Downloading ${filename} from ${url}...`);
  try {
    execSync(`curl.exe -L -s -o "${filePath}" "${url}"`);
    console.log(`Saved ${filename}: ${fs.statSync(filePath).size} bytes`);
  } catch(e) {
    console.error(`Failed to download ${filename}:`, e.message);
  }
}

async function run() {
  console.log("Generating 3D models...");
  await exportGLB(createPhoneStandScene(), "phone-stand-cable-dock.glb");
  await exportGLB(createScheduleWheelScene(), "desk-schedule-wheel.glb");
  await exportGLB(createKeycapScene(), "artisan-cyber-keycap.glb");

  console.log("Downloading additional models...");
  downloadFile("https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/DragonAttenuation.glb", "DragonAttenuation.glb");
  downloadFile("https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/gears.glb", "gears.glb");

  console.log("All 3D models ready!");
}

run().catch(console.error);
