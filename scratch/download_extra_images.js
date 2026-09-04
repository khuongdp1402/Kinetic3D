const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const extraImages = {
  'thoi-khoa-bieu.jpg': 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1000&auto=format&fit=crop', // calendar/schedule desk organizer
  'gia-do-dien-thoai.jpg': 'https://images.unsplash.com/photo-1586105251261-72a756497a11?q=80&w=1000&auto=format&fit=crop', // phone stand dock
  'artisan-keycap.jpg': 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=1000&auto=format&fit=crop', // mechanical keyboard artisan keycap
  'flexi-dragon.jpg': 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop', // mythical creature/dragon 3d model
  'khay-but-hoc-tap.jpg': 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1000&auto=format&fit=crop' // pen holder desk organizer
};

const destDir = path.resolve('src/Kinetic3D.WebUI_V2/public/images/products');
for (const [file, url] of Object.entries(extraImages)) {
  const p = path.join(destDir, file);
  if (fs.existsSync(p) && fs.statSync(p).size > 1000) {
    console.log(`${file} already exists`);
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
console.log('Finished extra images download.');
