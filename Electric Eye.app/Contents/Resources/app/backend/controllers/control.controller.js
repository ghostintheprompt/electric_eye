const fs = require('fs-extra');
const path = require('path');
const { sendCommand } = require('../services/camera.service');

const CAMERAS_FILE = path.join(__dirname, '..', 'data', 'cameras.json');

exports.controlCamera = async (req, res) => {
  const { id } = req.params;
  const { action, value } = req.body; 

  try {
    const cameras = await fs.readJson(CAMERAS_FILE);
    const camera = cameras.find(c => c.id === id);

    if (!camera) return res.status(404).json({ message: 'Camera not found' });

    console.log(`Commanding ${camera.name} (${camera.ip}): ${action} ${value || ''}`);

    let payload = {};
    if (action === 'move') {
      payload = {
        method: 'do',
        motor: { move: { direction: value } }
      };
    } else if (action === 'privacy') {
      payload = {
        method: 'set',
        lens_mask: {
          lens_mask_info: { enabled: value ? 'on' : 'off' }
        }
      };
    }

    const result = await sendCommand(camera, payload);
    
    if (result && result.error_code === 0) {
      res.json({ status: 'Command executed', action, value });
    } else {
      res.status(500).json({ message: 'Camera rejected command', error: result });
    }

  } catch (error) {
    console.error(`Control error for ${id}:`, error.message);
    res.status(500).json({ message: 'Could not reach satellite' });
  }
};
