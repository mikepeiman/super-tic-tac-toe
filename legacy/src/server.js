import sirv from "sirv";
const http = require("http");
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";
const server = http.createServer();
const app = polka({ server });
let port = 3049
// You can also use Express
app
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(port, err => {
    if (err) { console.log("error", err);}
    else {console.log(`Server running on http://localhost:${port}`)}
  });

// var http = require("http").createServer(app);
var io = require("socket.io")(server);

let sequenceNumberByClient = new Map();
let clientInstance = 1
// event fired every time a new client connects:
io.on("connection", socket => {
  console.info(`From server.js: Client connected [id=${socket.id}]`);
  // initialize this client's sequence number
  sequenceNumberByClient.set(socket, clientInstance);
  clientInstance++
  // when socket disconnects, remove it from the list:
  socket.on("disconnect", () => {
    sequenceNumberByClient.delete(socket);
    console.info(`Client gone [id=${socket.id}]`);
  });
  // setInterval(() => {
    for (const [client, clientInstance] of sequenceNumberByClient.entries()) {
      client.emit("seq-num", `${clientInstance}___${socket.id}`, client.nsp.name);
      sequenceNumberByClient.set(client, clientInstance);
      console.info(`From server.js: ${clientInstance}___${socket.id}: `, client.nsp.name);
    }

  // }, 1000);
});

// sends each client its current sequence number
