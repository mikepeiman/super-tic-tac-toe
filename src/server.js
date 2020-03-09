import sirv from "sirv";
const http = require("http");
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";
const server = http.createServer();
const app = polka({ server });
// You can also use Express
app
  .use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT, err => {
    if (err) console.log("error", err);
  });

// var http = require("http").createServer(app);
const io = require("socket.io")(server);

let sequenceNumberByClient = new Map();
let clientInstance = 1
// event fired every time a new client connects:
io.on("connection", socket => {


      socket.on('add user',  function addUser(username) { // user chooses a username
        socket.emit('get user id', socket.id) // return socket id to client
        // socket.join('lobby'); // join the main chat channel
        // socket.emit('refresh lobby rooms', roomServer.getLobbyRooms()); // get the state of the lobby, not refreshing for everyone though
        // socket.emit('refresh lobby messages', roomServer.getLobbyMessages());
        socket.username = username; // set the socket instance (per user) to their chosen username
    });
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
