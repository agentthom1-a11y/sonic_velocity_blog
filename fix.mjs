import fs from 'fs';
import path from 'path';

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix `/${locale}/path` -> `/path`
      let newContent = content.replace(/`\/\$\{locale\}\//g, '`/');
      
      // Fix `/${locale}` -> `/`
      newContent = newContent.replace(/`\/\$\{locale\}`/g, '`/`');
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log('Fixed ' + fullPath);
      }
    }
  }
}

processDir('./app');
processDir('./components');
