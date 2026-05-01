const axios = require('axios');

const sessions = new Map(); // cameraIp -> { stok, expires }

/**
 * Get a session token (stok) from the Tapo camera
 */
const getStok = async (camera) => {
  const now = Date.now();
  if (sessions.has(camera.ip) && sessions.get(camera.ip).expires > now) {
    return sessions.get(camera.ip).stok;
  }

  try {
    const response = await axios.post(`http://${camera.ip}/`, {
      method: 'login',
      params: {
        username: camera.username || 'admin',
        password: camera.password
      }
    }, { timeout: 3000 });

    if (response.data && response.data.result && response.data.result.stok) {
      const stok = response.data.result.stok;
      sessions.set(camera.ip, { stok, expires: now + 30 * 60 * 1000 });
      return stok;
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Send a command to the camera
 */
const sendCommand = async (camera, payload) => {
  const stok = await getStok(camera);
  const baseUrl = stok ? `http://${camera.ip}/stok=${stok}/ds` : `http://${camera.ip}/ds`;
  try {
    const response = await axios.post(baseUrl, payload, { timeout: 5000 });
    return response.data;
  } catch (error) {
    return { error: error.message };
  }
};

module.exports = {
  getStok,
  sendCommand
};
