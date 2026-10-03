import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const portArg = process.argv.indexOf('--port');
const port = Number(portArg >= 0 ? process.argv[portArg + 1] : process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4' };
const allowed = new Set(['index.html', 'styles.css', 'app.js', 'favicon.svg', 'verba-wordmark.png', 'robots.txt', 'qa/preview.html']);

http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const name = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const file = path.resolve(root, name);
    if (!file.startsWith(root + path.sep) || (!allowed.has(name) && !name.startsWith('assets/'))) {
      response.writeHead(404); response.end('Not found'); return;
    }
    const data = await readFile(file);
    const info = await stat(file);
    const range = request.headers.range;
    const headers = { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'Accept-Ranges': 'bytes' };
    if (range) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      const start = match ? Number(match[1]) : -1;
      const end = match && match[2] ? Math.min(Number(match[2]), info.size - 1) : info.size - 1;
      if (start < 0 || start > end || start >= info.size) { response.writeHead(416, { 'Content-Range': 'bytes */' + info.size }); response.end(); return; }
      response.writeHead(206, { ...headers, 'Content-Range': 'bytes ' + start + '-' + end + '/' + info.size, 'Content-Length': end - start + 1 });
      response.end(request.method === 'HEAD' ? undefined : data.subarray(start, end + 1));
    } else {
      response.writeHead(200, { ...headers, 'Content-Length': info.size });
      response.end(request.method === 'HEAD' ? undefined : data);
    }
  } catch { response.writeHead(404); response.end('Not found'); }
}).listen(port, '0.0.0.0', () => console.log('VERBA preview on port ' + port));
