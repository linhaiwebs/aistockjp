#!/usr/bin/env node

/**
 * Build script for loading mode
 * Generates index-loading.html for PHP cloaking mode
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist-loading');
const OUTPUT_FILE = path.join(__dirname, '../../index-loading.html');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

console.log('🚀 Building loading mode HTML...');

// Check if dist-loading exists
if (!fs.existsSync(DIST_DIR)) {
  console.error('❌ dist-loading directory not found. Run build:loading first.');
  process.exit(1);
}

// Read the built index.html
if (!fs.existsSync(INDEX_HTML)) {
  console.error('❌ index.html not found in dist-loading directory.');
  process.exit(1);
}

let html = fs.readFileSync(INDEX_HTML, 'utf-8');

// Replace all relative paths with absolute paths
// This ensures resources load correctly when served from root path
html = html.replace(/href="\//g, 'href="/');
html = html.replace(/src="\//g, 'src="/');

// Add base tag for resource loading
if (!html.includes('<base')) {
  html = html.replace('<head>', '<head>\n  <base href="/">');
}

// Add special meta tag to indicate loading mode
html = html.replace('<head>', '<head>\n  <meta name="cloaking-mode" content="loading">');

// Write to root directory
fs.writeFileSync(OUTPUT_FILE, html, 'utf-8');

console.log('✅ Generated: index-loading.html');
console.log(`📦 File size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
console.log('');
console.log('📋 Next steps:');
console.log('1. Configure Cloaking.House:');
console.log('   - Offer Page URL: index-loading.html');
console.log('   - Offer Page Mode: loading');
console.log('   - White Page URL: home/index.html');
console.log('   - White Page Mode: loading');
console.log('');
console.log('2. Deploy the updated files to your server');
console.log('3. Test by accessing the root URL');
