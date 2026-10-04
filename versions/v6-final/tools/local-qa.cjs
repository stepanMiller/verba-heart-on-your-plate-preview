// Serve and test within one process tree, including isolated execution environments.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../../..');
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.mp4':'video/mp4'};
const server = http.createServer((req,res) => {
  let name = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if (name.endsWith('/')) name += 'index.html';
  const file = path.resolve(root,'.'+name);
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  const stat = fs.statSync(file), range = req.headers.range;
  const headers = {'Content-Type':types[path.extname(file)] || 'application/octet-stream','Accept-Ranges':'bytes'};
  if(range) {
    const [startString,endString] = range.replace('bytes=','').split('-');
    const start = Number(startString), end = endString ? Number(endString) : stat.size-1;
    res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${stat.size}`,'Content-Length':end-start+1});
    fs.createReadStream(file,{start,end}).pipe(res);
  } else { res.writeHead(200,{...headers,'Content-Length':stat.size}); fs.createReadStream(file).pipe(res); }
});
server.listen(0,'127.0.0.1',() => {
  process.env.VERBA_URL = `http://127.0.0.1:${server.address().port}/versions/v6-final/`;
  // Do not keep the process alive after browser QA ends.
  server.unref(); require('./qa.cjs');
});
