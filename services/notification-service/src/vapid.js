const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

const VAPID_FILE = path.join(__dirname, '..', 'data', 'vapid_keys.json');
const dataDir = path.dirname(VAPID_FILE);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let vapidKeys = null;

function getVapidKeys() {
  if (vapidKeys) return vapidKeys;

  if (fs.existsSync(VAPID_FILE)) {
    try {
      vapidKeys = JSON.parse(fs.readFileSync(VAPID_FILE, 'utf8'));
      webpush.setVapidDetails('mailto:admin@campus.edu', vapidKeys.publicKey, vapidKeys.privateKey);
      return vapidKeys;
    } catch (e) {}
  }

  // Generate new standard VAPID key pair
  vapidKeys = webpush.generateVAPIDKeys();
  fs.writeFileSync(VAPID_FILE, JSON.stringify(vapidKeys, null, 2), 'utf8');
  webpush.setVapidDetails('mailto:admin@campus.edu', vapidKeys.publicKey, vapidKeys.privateKey);
  console.log('[Notification Service] Generated new VAPID Key pair for native Web Push');
  return vapidKeys;
}

module.exports = { getVapidKeys };
