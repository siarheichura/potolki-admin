const fs = require('fs');
const path = require('path');

const oldName = 'angular-app-sample';
const newName = process.argv[2];
const newPrefix = process.argv[3];

if (!newName || !newPrefix) {
  console.error('❌ Pass project name and prefix:');
  console.error('👉 Example: npm run init scripts/init-project.js my-app myprefix');
  process.exit(1);
}

/***  1. package.json  ***/

const pkgPath = path.join(__dirname, '../package.json');

try {
  const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkgJson.name = newName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
  console.log(`✅ package.json updated`);
} catch (err) {
  console.error('❌ Failed to update package.json:', err.message);
  process.exit(1);
}

/***  2. index.html  ***/

const indexHtmlPath = path.join(__dirname, '../src/index.html');

try {
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  indexHtml = indexHtml.replace(/<title>.*<\/title>/i, `<title>${newName}</title>`);
  fs.writeFileSync(indexHtmlPath, indexHtml);
  console.log(`✅ index.html updated`);
} catch (err) {
  console.error('❌ Failed to update index.html:', err.message);
  process.exit(1);
}

/***  3. angular.json  ***/

const angularJsonPath = path.join(__dirname, '../angular.json');

try {
  let angularJson = fs.readFileSync(angularJsonPath, 'utf-8');
  angularJson = angularJson.replace(new RegExp(oldName, 'g'), newName);
  angularJson = angularJson.replace(/"prefix":\s*".*?"/, `"prefix": "${newPrefix}"`);
  angularJson = angularJson.replace(
    /"outputPath":\s*"dist\/[^"]+"/,
    `"outputPath": "dist/${newName}"`,
  );
  fs.writeFileSync(angularJsonPath, angularJson);
  console.log(`✅ angular.json updated`);
} catch (err) {
  console.error('❌ Failed to update angular.json:', err.message);
  process.exit(1);
}

console.log(`🎉 Done 🎉`);
