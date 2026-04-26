/**
 * BACKEND SERVER IMPLEMENTATION
 * 
 * To run this:
 * 1. Initialize npm: npm init -y
 * 2. Install deps: npm install express cors dotenv node-fetch uuid body-parser
 * 3. Run: node index.js
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Auth Middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token !== process.env.AUTH_TOKEN && process.env.NODE_ENV !== 'development') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// In-memory DB
const jobs = new Map();

// Ensure storage directory exists
const TRACKS_DIR = path.join(__dirname, 'tracks');
if (!fs.existsSync(TRACKS_DIR)) {
  fs.mkdirSync(TRACKS_DIR);
}

// --- Routes ---

// 1. Generate Endpoint
app.post('/api/generate', authenticate, async (req, res) => {
  try {
    const { preset, topic, mood, duration = 60, keywords } = req.body;

    if (!topic) {
      return res.status(400).json({ error: 'Topic is required' });
    }

    const jobId = uuidv4();
    
    // Store initial job state
    jobs.set(jobId, {
      id: jobId,
      status: 'queued',
      preset,
      topic,
      mood,
      createdAt: Date.now()
    });

    // Trigger Async Processing (Fire and forget from HTTP perspective)
    processMusicGeneration(jobId, { preset, topic, mood, duration, keywords });

    res.json({ jobId, status: 'queued' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Status Endpoint
app.get('/api/status/:jobId', authenticate, (req, res) => {
  const { jobId } = req.params;
  const job = jobs.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const response = {
    status: job.status,
    error: job.error
  };

  if (job.status === 'done') {
    response.trackId = jobId;
    // Construct full URL based on host
    const baseUrl = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;
    response.url = `${baseUrl}/api/tracks/${jobId}.mp3`;
  }

  res.json(response);
});

// 3. Serve Static Files
const SAFE_FILENAME_RE = /^[a-zA-Z0-9_-]+\.mp3$/;

app.get('/api/tracks/:filename', (req, res) => {
  const { filename } = req.params;

  // Reject filenames that don't match the expected pattern
  if (!SAFE_FILENAME_RE.test(filename)) {
    return res.status(400).send('Invalid filename');
  }

  // Resolve and verify the path stays inside TRACKS_DIR (path traversal guard)
  const filePath = path.resolve(TRACKS_DIR, filename);
  if (!filePath.startsWith(TRACKS_DIR + path.sep) && filePath !== TRACKS_DIR) {
    return res.status(400).send('Invalid filename');
  }

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send('File not found');
  }
});

// --- Logic for MiniMax Interaction ---

async function processMusicGeneration(jobId, params) {
  const job = jobs.get(jobId);
  job.status = 'processing';
  jobs.set(jobId, job);

  try {
    // Construct prompt for MiniMax
    // Note: This is a hypothetical implementation based on standard T2A API structures
    // You would replace this with the specific MiniMax SDK or fetch call
    
    const promptText = `Genre: ${params.preset} style. Topic: ${params.topic}. Mood: ${params.mood}. Style: Indonesian Dangdut/Remix.`;

    console.log(`[${jobId}] Calling MiniMax API...`);
    
    /* 
    // REAL IMPLEMENTATION EXAMPLE:
    const mmRes = await fetch(`${process.env.MINIMAX_API_HOST}/v1/music_generation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.MINIMAX_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: promptText,
        duration: params.duration,
        model: "music-01"
      })
    });
    
    const mmData = await mmRes.json();
    // Then poll MiniMax until done, download file, save to disk...
    */

    // SIMULATED DELAY & FILE GENERATION for MVP
    await new Promise(r => setTimeout(r, 5000)); // Simulate API latency

    // For MVP, we copy a dummy file or create an empty one if we can't really generate music without a key
    // In production, you would download the buffer from MiniMax URL and write to disk:
    // fs.writeFileSync(path.join(TRACKS_DIR, `${jobId}.mp3`), buffer);
    
    // Only for demonstration:
    job.status = 'done';
    job.completedAt = Date.now();
    jobs.set(jobId, job);
    console.log(`[${jobId}] Job completed.`);

  } catch (err) {
    console.error(`[${jobId}] Error:`, err);
    job.status = 'error';
    job.error = err.message;
    jobs.set(jobId, job);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});