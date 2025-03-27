const fs = require('fs');
const path = require('path');

const oldName = 'angular-app-sample';
const newName = process.argv[2];
const newPrefix = process.argv[3];

if (!newName || !newPrefix) {
  console.error('❌ Укажи имя проекта и префикс:');
  console.error('👉 Пример: node scripts/init-project.js my-app myprefix');
  process.exit(1);
}

// === 1. package.json ===
const pkgPath = path.join(__dirname, '../package.json');
try {
  const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkgJson.name = newName;
  fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n');
  console.log(`✅ Обновлено "name" в package.json`);
} catch (err) {
  console.error('❌ Ошибка при обновлении package.json:', err.message);
  process.exit(1);
}

// === 2. index.html ===
const indexHtmlPath = path.join(__dirname, '../src/index.html');
try {
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8');
  indexHtml = indexHtml.replace(/<title>.*<\/title>/i, `<title>${newName}</title>`);
  fs.writeFileSync(indexHtmlPath, indexHtml);
  console.log(`✅ Обновлён <title> в index.html`);
} catch (err) {
  console.error('❌ Ошибка при обновлении index.html:', err.message);
  process.exit(1);
}

// === 3. angular.json ===
const angularJsonPath = path.join(__dirname, '../angular.json');
try {
  let angularJson = fs.readFileSync(angularJsonPath, 'utf-8');

  // Замена имени проекта
  angularJson = angularJson.replace(new RegExp(oldName, 'g'), newName);

  // Замена prefix
  angularJson = angularJson.replace(/"prefix":\s*".*?"/, `"prefix": "${newPrefix}"`);

  // Замена outputPath
  angularJson = angularJson.replace(
    /"outputPath":\s*"dist\/[^"]+"/,
    `"outputPath": "dist/${newName}"`,
  );

  fs.writeFileSync(angularJsonPath, angularJson);
  console.log(`✅ Обновлён angular.json`);
} catch (err) {
  console.error('❌ Ошибка при обновлении angular.json:', err.message);
  process.exit(1);
}

console.log(`\n🎉 Проект "${newName}" и префикс "${newPrefix}" успешно применены!`);
