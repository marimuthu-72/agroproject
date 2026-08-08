const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const configPath = path.join(__dirname, '../config/admin.json');

/**
 * Reads admin configuration from backend/config/admin.json.
 * Initializes default hashed admin credentials if config file does not exist.
 */
function getAdminConfig() {
  try {
    if (fs.existsSync(configPath)) {
      const data = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(data);
      if (config && config.admin && config.admin.username && config.admin.password) {
        // If password in config is plaintext (not starting with $2a$), hash it immediately
        if (!config.admin.password.startsWith('$2a$') && !config.admin.password.startsWith('$2b$')) {
          config.admin.password = bcrypt.hashSync(config.admin.password, 10);
          fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
        }
        return config;
      }
    }
  } catch (e) {
    console.error('[AdminConfig] Error reading admin.json:', e.message);
  }

  // Default initial configuration with strong password: Admin@12345
  const defaultPasswordHash = bcrypt.hashSync('Admin@12345', 10);
  const defaultConfig = {
    admin: {
      username: 'admin',
      password: defaultPasswordHash
    }
  };

  try {
    const dir = path.dirname(configPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
    console.log('[AdminConfig] Initialized config/admin.json with secure defaults.');
  } catch (e) {
    console.error('[AdminConfig] Error writing default admin.json:', e.message);
  }

  return defaultConfig;
}

/**
 * Updates admin username and hashed password in config/admin.json.
 */
function updateAdminConfig(newUsername, newHashedPassword) {
  const config = {
    admin: {
      username: newUsername,
      password: newHashedPassword
    }
  };

  const dir = path.dirname(configPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
  console.log(`[AdminConfig] Successfully updated credentials for admin '${newUsername}'.`);
  return config;
}

module.exports = {
  getAdminConfig,
  updateAdminConfig
};
