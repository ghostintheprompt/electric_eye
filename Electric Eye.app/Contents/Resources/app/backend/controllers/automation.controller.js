const { Bonjour } = require('bonjour-service');
const fs = require('fs-extra');
const path = require('path');
const nodeCron = require('node-cron');
const { sendCommand } = require('../services/camera.service');
const recordingController = require('./recording.controller');
const incidentController = require('./incident.controller');

const CAMERAS_FILE = path.join(__dirname, '..', 'data', 'cameras.json');
const RECORDINGS_DIR = path.join(__dirname, '..', 'recordings');

/**
 * mDNS Auto-Discovery
 */
exports.discoverCameras = (req, res) => {
  const bonjour = new Bonjour();
  const discovered = [];

  console.log('Scanning for orbital satellites...');
  
  const browser = bonjour.find({ type: 'http' });

  browser.on('up', (service) => {
    if (service.name.toLowerCase().includes('tapo') || service.host.toLowerCase().includes('tapo')) {
      discovered.push({
        name: service.name,
        ip: service.addresses[0],
        port: service.port,
        host: service.host
      });
    }
  });

  // Scan for 5 seconds
  setTimeout(() => {
    bonjour.destroy();
    res.json(discovered);
  }, 5000);
};

/**
 * Smart Purge - Automated Storage Retention
 */
exports.initSmartPurge = () => {
  // Run every hour
  nodeCron.schedule('0 * * * *', async () => {
    console.log('Running Smart Purge retention policy...');
    try {
      const files = await fs.readdir(RECORDINGS_DIR);
      const mp4Files = files
        .filter(f => f.endsWith('.mp4'))
        .map(f => ({
          name: f,
          path: path.join(RECORDINGS_DIR, f),
          time: fs.statSync(path.join(RECORDINGS_DIR, f)).mtime.getTime()
        }))
        .sort((a, b) => b.time - a.time); // Newest first

      // Keep only last 24 hours OR max 10 files (whichever is more restrictive for local demo)
      const MAX_FILES = 20;
      if (mp4Files.length > MAX_FILES) {
        const toDelete = mp4Files.slice(MAX_FILES);
        for (const file of toDelete) {
          await fs.remove(file.path);
          console.log(`Purged old footage: ${file.name}`);
        }
      }
    } catch (error) {
      console.error('Smart Purge failed:', error.message);
    }
  });
};

/**
 * The Sentinel - Motion Detection Polling (Simulated/Placeholder for local logic)
 */
exports.initSentinel = () => {
  // In a real environment, this would poll the camera's event stream.
  // For the workstation, we'll implement the logic bridge.
  setInterval(async () => {
    try {
      const cameras = await fs.readJson(CAMERAS_FILE);
      for (const camera of cameras) {
        // Here we would call sendCommand(camera, { method: 'get_events' })
        // If motion detected:
        // 1. Log Incident
        // 2. Start Recording
      }
    } catch (err) {}
  }, 10000);
};

/**
 * Orbital Scan - Automated Patrol
 */
const activePatrols = new Map();

exports.togglePatrol = async (req, res) => {
  const { id } = req.params;
  const { enabled } = req.body;

  if (!enabled) {
    if (activePatrols.has(id)) {
      clearInterval(activePatrols.get(id));
      activePatrols.delete(id);
    }
    return res.json({ status: 'Patrol deactivated' });
  }

  try {
    const cameras = await fs.readJson(CAMERAS_FILE);
    const camera = cameras.find(c => c.id === id);
    if (!camera) return res.status(404).json({ message: 'Camera not found' });

    const directions = ['left', 'right', 'up', 'down'];
    let step = 0;

    const interval = setInterval(async () => {
      const direction = directions[step % directions.length];
      console.log(`Patrol moving ${camera.name}: ${direction}`);
      await sendCommand(camera, {
        method: 'do',
        motor: { move: { direction } }
      });
      step++;
    }, 15000); // Move every 15s

    activePatrols.set(id, interval);
    res.json({ status: 'Patrol activated' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to initiate patrol' });
  }
};
