const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const models = {
  'DragonAttenuation.glb': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/DragonAttenuation.glb',
  'gears.glb': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/gears.glb',
  'coffeeMug.glb': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/coffeeMug.glb',
  'BoomBox.glb': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/BoomBox.glb',
  'steampunk_camera.glb': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/steampunk_camera.glb',
  'duck.glb': 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/models/gltf/duck.glb'
};

const destDir = path.resolve('src/Kinetic3D.WebUI_V2/public/models');
for (const [file, url] of Object.entries(models)) {
  const p = path.join(destDir, file);
  if (fs.existsSync(p) && fs.statSync(p).size > 1000) {
    console.log(`${file} already exists (${fs.statSync(p).size} bytes)`);
    continue;
  }
  console.log(`Downloading ${file}...`);
  try {
    execSync(`curl.exe -L -s -o "${p}" "${url}"`);
    console.log(`Saved ${file}: ${fs.statSync(p).size} bytes`);
  } catch(e) {
    console.error(`Failed ${file}`, e.message);
  }
}
console.log('Finished downloading extra models.');
