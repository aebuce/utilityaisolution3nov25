#!/usr/bin/env node

/**
 * Production Build Testing Script
 * 
 * This script helps test the production build locally before deployment.
 * It builds the application and serves it with the same configuration
 * that will be used on GitHub Pages.
 */

import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const DIST_DIR = 'dist';
const BASE_PATH = '/utilityaisolution3nov25/';
const PORT = 4173;

console.log('🏗️  Production Build Testing Script');
console.log('=====================================\n');

// Check if dist directory exists
if (!existsSync(DIST_DIR)) {
  console.log('❌ No build found. Building application first...\n');
  
  const buildProcess = spawn('bun', ['run', 'build:prod'], {
    stdio: 'inherit',
    shell: true
  });
  
  buildProcess.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Build completed successfully!');
      startPreviewServer();
    } else {
      console.error('\n❌ Build failed with code:', code);
      process.exit(1);
    }
  });
} else {
  console.log('📦 Found existing build. Starting preview server...\n');
  startPreviewServer();
}

function startPreviewServer() {
  console.log('🚀 Starting preview server...');
  console.log(`📍 Base path: ${BASE_PATH}`);
  console.log(`🌐 Local URL: http://localhost:${PORT}${BASE_PATH}`);
  console.log(`🔗 Network URL: Use --host flag to expose to network\n`);
  
  console.log('📋 Testing Checklist:');
  console.log('  ✓ Application loads without errors');
  console.log('  ✓ All assets (CSS, JS, images) load correctly');
  console.log('  ✓ Navigation works properly');
  console.log('  ✓ Interactive features function as expected');
  console.log('  ✓ Error boundaries display correctly (if triggered)');
  console.log('  ✓ Performance is acceptable');
  console.log('  ✓ No console errors or warnings\n');
  
  const previewProcess = spawn('bun', ['run', 'preview:dist'], {
    stdio: 'inherit',
    shell: true
  });
  
  previewProcess.on('close', (code) => {
    console.log(`\n🛑 Preview server stopped with code: ${code}`);
  });
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down preview server...');
    previewProcess.kill('SIGINT');
    process.exit(0);
  });
}