#!/usr/bin/env node

/**
 * Check AI Provider Status
 * Verifies which providers are configured and available
 */

const fs = require('fs');
const path = require('path');

// Manually load .env file
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length) {
        const value = valueParts.join('=').replace(/^["']|["']$/g, '');
        process.env[key.trim()] = value;
      }
    }
  });
}

const providers = [
  {
    name: 'OpenAI',
    envKey: 'OPENAI_API_KEY',
    website: 'https://platform.openai.com/api-keys',
  },
  {
    name: 'Grok (xAI)',
    envKey: 'GROK_API_KEY',
    website: 'https://x.ai/api',
  },
  {
    name: 'Google Gemini',
    envKey: 'GEMINI_API_KEY',
    website: 'https://makersuite.google.com/app/apikey',
  },
  {
    name: 'Anthropic Claude',
    envKey: 'ANTHROPIC_API_KEY',
    website: 'https://console.anthropic.com/',
  },
];

console.log('\n🤖 AI Provider Status Check\n');
console.log('─'.repeat(70));

let configuredCount = 0;
let availableCount = 0;

providers.forEach((provider) => {
  const apiKey = process.env[provider.envKey];
  const configured = !!apiKey;
  
  if (configured) {
    configuredCount++;
    
    // Basic validation
    let valid = false;
    let reason = '';
    
    if (provider.name === 'OpenAI') {
      valid = apiKey.startsWith('sk-proj-') || apiKey.startsWith('sk-');
      reason = valid ? '' : 'Invalid format (should start with sk-)';
    } else if (provider.name === 'Grok (xAI)') {
      valid = apiKey.startsWith('xai-');
      reason = valid ? '' : 'Invalid format (should start with xai-)';
    } else if (provider.name === 'Anthropic Claude') {
      valid = apiKey.startsWith('sk-ant-');
      reason = valid ? '' : 'Invalid format (should start with sk-ant-)';
    } else {
      valid = apiKey.length > 10;
      reason = valid ? '' : 'Too short';
    }
    
    if (valid) availableCount++;
    
    console.log(
      `${valid ? '✅' : '⚠️'}  ${provider.name.padEnd(20)} ` +
      `${configured ? 'Configured' : 'Not configured'.padEnd(13)} ` +
      `${valid ? 'Valid' : reason}`
    );
  } else {
    console.log(
      `❌  ${provider.name.padEnd(20)} Not configured`
    );
    console.log(`    Get key: ${provider.website}`);
  }
});

console.log('─'.repeat(70));
console.log(`\n📊 Summary:`);
console.log(`   Configured: ${configuredCount}/${providers.length}`);
console.log(`   Available:  ${availableCount}/${providers.length}`);

if (availableCount === 0) {
  console.log('\n❌ No AI providers configured!');
  console.log('\n💡 Quick start:');
  console.log('   1. Get an OpenAI API key: https://platform.openai.com/api-keys');
  console.log('   2. Add to .env file: OPENAI_API_KEY="sk-proj-..."');
  console.log('   3. Restart dev server: npm run dev');
} else if (availableCount === 1) {
  console.log('\n⚠️  Only 1 provider available - consider adding more for reliability');
  console.log('\n💡 Recommended: Add Google Gemini (has free tier!)');
  console.log('   Get key: https://makersuite.google.com/app/apikey');
} else {
  console.log('\n✅ Great! Multiple providers configured for reliability');
}

console.log('\n📚 For detailed setup instructions, see: PROVIDERS.md\n');

process.exit(availableCount > 0 ? 0 : 1);
