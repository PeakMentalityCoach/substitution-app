import localtunnel from 'localtunnel';
import fs from 'fs';

console.log('Starting localtunnel...');

(async () => {
  try {
    const tunnel = await localtunnel({ port: 5173 });

    const url = tunnel.url;
    const output = `
============================================================
PUBLIC DEV SERVER URL:
${url}
============================================================

Press Ctrl+C to stop the tunnel
`;

    console.log(output);
    fs.writeFileSync('/tmp/tunnel-url.txt', url);

    tunnel.on('close', () => {
      console.log('Tunnel closed');
      process.exit();
    });

    tunnel.on('error', (err) => {
      console.error('Tunnel error:', err);
      fs.writeFileSync('/tmp/tunnel-error.txt', err.toString());
      process.exit(1);
    });

    process.on('SIGINT', () => {
      tunnel.close();
    });
  } catch (err) {
    console.error('Failed to create tunnel:', err);
    fs.writeFileSync('/tmp/tunnel-error.txt', err.toString());
    process.exit(1);
  }
})();
