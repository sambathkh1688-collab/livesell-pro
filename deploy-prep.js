const fs = require('fs');
const path = require('path');

console.log('🚀 Preparing LiveSell Pro for Hostinger deployment on adsbox.biz...\n');

// Create deployment folder structure
const deploymentDir = path.join(__dirname, 'deployment');
const backendDeployDir = path.join(deploymentDir, 'backend');
const frontendDeployDir = path.join(deploymentDir, 'frontend');

// Create directories
[deploymentDir, backendDeployDir, frontendDeployDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✅ Created directory: ${dir}`);
  }
});

// Copy backend files
console.log('\n📦 Copying backend files...');
const backendFiles = [
  'server/dist',
  'server/package.json',
  'server/package-lock.json'
];

backendFiles.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const targetPath = path.join(backendDeployDir, path.basename(file));
  
  if (fs.existsSync(sourcePath)) {
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
    console.log(`✅ Copied: ${file}`);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

// Copy frontend files
console.log('\n📦 Copying frontend files...');
const frontendFiles = [
  'client/.next',
  'client/public',
  'client/package.json'
];

frontendFiles.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const targetPath = path.join(frontendDeployDir, path.basename(file));
  
  if (fs.existsSync(sourcePath)) {
    if (fs.statSync(sourcePath).isDirectory()) {
      copyDir(sourcePath, targetPath);
    } else {
      fs.copyFileSync(sourcePath, targetPath);
    }
    console.log(`✅ Copied: ${file}`);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

// Copy environment files
console.log('\n🔧 Copying environment files...');
const envFiles = [
  '.env.production',
  'client/.env.production'
];

envFiles.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const targetPath = path.join(deploymentDir, file);
  
  if (fs.existsSync(sourcePath)) {
    // Create target directory if it doesn't exist
    const targetDir = path.dirname(targetPath);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`✅ Copied: ${file}`);
  }
});

// Create deployment instructions
const instructions = `
# Hostinger Deployment Instructions for adsbox.biz

## 1. Upload Backend Files
- Upload contents of 'backend/' folder to your hosting path: /api/
- Make sure Node.js is enabled in Hostinger control panel
- Run 'npm install --production' in the /api/ directory

## 2. Upload Frontend Files
- Upload contents of 'frontend/.next/' to your main domain root
- Upload contents of 'frontend/public/' to your main domain root
- Configure Next.js static export if needed

## 3. Database Setup
- Create MySQL database: livesell_production
- Import database schema from server/database/schema.sql
- Update DATABASE_URL in .env.production

## 4. Environment Variables
- Upload .env.production to /api/ directory
- Upload client/.env.production to main domain root
- Update database credentials and Facebook app secrets

## 5. Domain Configuration
- Main site: https://adsbox.biz
- API endpoint: https://api.adsbox.biz
- Enable SSL for both domains

## 6. Facebook App Update
- Update OAuth redirect URIs to use adsbox.biz
- Update webhook URLs to use api.adsbox.biz
- Test Facebook integration

🚀 Your LiveSell Pro platform is ready for adsbox.biz!
`;

fs.writeFileSync(path.join(deploymentDir, 'DEPLOYMENT_INSTRUCTIONS.md'), instructions);
console.log('✅ Created deployment instructions');

console.log('\n🎉 Deployment preparation complete!');
console.log('📁 Check the "deployment" folder for all files ready to upload to Hostinger');
console.log('🌍 Domain: https://adsbox.biz');
console.log('🔌 API: https://api.adsbox.biz');

// Helper function to copy directories
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}