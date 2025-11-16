import localtunnel from 'localtunnel';
import fs from 'fs';

const TIMEOUT = 20000; // 20 seconds timeout

console.log('Attempting to create tunnel (20s timeout)...');

const timeoutPromise = new Promise((_, reject) => {
  setTimeout(() => reject(new Error('Tunnel creation timed out after 20s')), TIMEOUT);
});

const tunnelPromise = (async () => {
  const tunnel = await localtunnel({ port: 5173, subdomain: 'football-sub-app' });
  return tunnel;
})();

Promise.race([tunnelPromise, timeoutPromise])
  .then(tunnel => {
    const url = tunnel.url;
    console.log('\n' + '='.repeat(60));
    console.log('SUCCESS! Public URL created:');
    console.log(url);
    console.log('='.repeat(60) + '\n');
    fs.writeFileSync('/tmp/tunnel-url.txt', url);
  })
  .catch(err => {
    console.error('\nFailed to create tunnel:', err.message);
    console.error('\nThis environment may have network restrictions.');
    console.error('Dev server is running locally at: http://localhost:5173\n');
    process.exit(1);
  });
