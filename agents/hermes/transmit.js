/**
 * HERMES TRANSMITTER
 * Use this script to send generated content to the live Sonic Velocity API.
 */
import fs from 'fs';

const API_ENDPOINT = 'https://transmissions.sonicvelocitymusic.com/api/internal/ai/transmissions';
let API_KEY = process.env.HERMES_API_KEY;

// Fallback to local file if env var is missing
const ENV_FILE = './agents/hermes/ENV.hermes';
if (!API_KEY && fs.existsSync(ENV_FILE)) {
  API_KEY = fs.readFileSync(ENV_FILE, 'utf8').trim();
}

async function transmit() {
  const filePath = process.argv[2];

  if (!API_KEY) {
    console.error('❌ ERROR: HERMES_API_KEY is not set (check environment or agents/hermes/ENV.hermes).');
    process.exit(1);
  }

  if (!filePath) {
    console.error('❌ ERROR: No input file provided.');
    console.log('Usage: node transmit.js <path_to_json_file>');
    process.exit(1);
  }

  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const payload = JSON.parse(rawData);

    console.log(`📡 TRANSMITTING: "${payload.title}" to ${API_ENDPOINT}...`);

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ TRANSMISSION SUCCESSFUL');
      console.log(`🔗 PREVIEW URL: ${result.preview_url}`);
    } else {
      console.error('❌ TRANSMISSION FAILED');
      console.error(`Status: ${response.status}`);
      console.error('Response:', JSON.stringify(result, null, 2));
    }
  } catch (err) {
    console.error('❌ FATAL ERROR:', err.message);
  }
}

transmit();
