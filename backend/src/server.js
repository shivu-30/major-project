const http = require('http');
const handler = require('./app');

const port = Number(process.env.PORT || 3000);
http.createServer(handler).listen(port, () => {
  console.log(`Smart Service Finder API listening on http://localhost:${port}`);
});
