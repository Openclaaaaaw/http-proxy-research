/**
 * Script to install the proxy certificate to the system
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CERT_DIR = path.join(__dirname, 'certs');
const CERT_FILE = path.join(CERT_DIR, 'cert.pem');
const NSS_DB = path.join(process.env.HOME, '.pki', 'nssdb');

console.log('Installing proxy certificate...\n');

// Ensure NSS database exists
if (!fs.existsSync(NSS_DB)) {
  console.log('Creating NSS database...');
  fs.mkdirSync(path.dirname(NSS_DB), { recursive: true });
  try {
    execSync(`certutil -N -d sql:${NSS_DB}`, { stdio: 'inherit' });
  } catch (e) {
    console.error('Failed to create NSS database. certutil may not be installed.');
    console.error('On Ubuntu/Debian, run: sudo apt-get install libnss3-tools');
    process.exit(1);
  }
}

// Add certificate to NSS database
try {
  console.log(`Adding certificate to NSS database: ${NSS_DB}`);
  execSync(`certutil -A -n "Proxy MITM CA" -t "C,C,C" -d sql:${NSS_DB} -i ${CERT_FILE}`, { stdio: 'inherit' });
  console.log('\n✅ Certificate installed successfully!');
  console.log('\nNow restart Chrome and try the proxy again.');
} catch (e) {
  console.error('Failed to add certificate:', e.message);
  console.error('\nAlternative: On Ubuntu/Debian, run:');
  console.error(`  sudo cp ${CERT_FILE} /usr/local/share/ca-certificates/proxy.crt`);
  console.error('  sudo update-ca-certificates');
  process.exit(1);
}
