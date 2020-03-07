import sirv from "sirv";
const http = require('http');
import polka from "polka";
import compression from "compression";
import * as sapper from "@sapper/server";

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === "development";
const server = http.createServer()
const app = polka({server})
 // You can also use Express
app.use(
    compression({ threshold: 0 }),
    sirv("static", { dev }),
    sapper.middleware()
  )
  .listen(PORT, err => {
    if (err) console.log("error", err);
  });

// var http = require("http").createServer(app);
var io = require("socket.io")(server);


// Chatroom
let numUsers = 0;
io.on('connection', socket => {
	let added = false;
  console.log('a user connected, socket.id ', socket.id);
  // console.log('a user connected, client', socket.client);
  console.log('a user connected, client.id ', socket.client.id);
	// when the client emits 'new message', this listens and executes
	socket.on('new message', data => {
		// we tell the client to execute 'new message'
		socket.broadcast.emit('new message', {
			username: socket.username,
			message: data
		});
	});

	// when the client emits 'add user', this listens and executes
	socket.on('add user', username => {
		if (added) return;

		// we store the username in the socket session for this client
		socket.username = username;
		++numUsers;
		added = true;
		socket.emit('login', { numUsers });
		// echo globally (all clients) that a person has connected
		socket.broadcast.emit('user joined', { username, numUsers });
  });
  
  socket.on('clearscores', msg => {
    console.log(`clearscores message: ${msg}`)
  })

	// when the client emits 'typing', we broadcast it to others
	socket.on('typing', _ => socket.broadcast.emit('typing', { username:socket.username }));

	// when the client emits 'stop typing', we broadcast it to others
	socket.on('stop typing', _ => socket.broadcast.emit('stop typing', { username:socket.username }));

	// when the user disconnects.. perform this
	socket.on('disconnect', _ => {
    console.log('a user DISconnected', socket.id);
		if (added) {
			--numUsers;
      // echo globally that this client has left

			socket.broadcast.emit('user left', { numUsers, username:socket.username });
		}
	});
});

// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });