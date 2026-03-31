const fs = require('fs');
const path = require('path');

function revert(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      revert(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('€')) {
        content = content.replace(/€/g, "'");
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
}

revert('projects/cm-ecommerce-tech/web/src');
console.log('Reverted Euro to Single Quote in src');
