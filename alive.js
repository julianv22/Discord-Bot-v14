const htpp = require("http");
const hostname = "0.0.0.0";
const port = 8080;

const server = htpp.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello Julian-V! Have a good day 🥰");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});