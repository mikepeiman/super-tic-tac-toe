import * as sapper from "@sapper/app";

sapper.start({
  target: document.querySelector("#sapper")
});

const ioClient = io.connect(window);
console.info(`window `, window)
ioClient.on("seq-num", (msg, seq) => console.info(`From client.js: `,msg, seq));
