import * as sapper from "@sapper/app";

sapper.start({
  target: document.querySelector("#sapper")
});

const ioClient = io.connect(window.origin);
console.info(`window `, window.origin)
ioClient.on("seq-num", msg => console.info(`From client.js: `,msg));
ioClient.on("test1", msg => console.info(`From client.js: `,msg));
