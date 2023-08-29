import byteSize from "byte-size";
import csvtojson from "csvtojson";
import cluster from "node:cluster";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import os from "node:os";
import { Readable, Transform, Writable } from "node:stream";
import { TransformStream } from "node:stream/web";

import { abortController, PORT_ASYNC, filename, headers } from "./constants.js";

let itemsProcessed = 0;
let maxMemoryUsage = process.memoryUsage().rss;

const measureMemoryUsage = () => {
  const memoryUsage = process.memoryUsage();
  maxMemoryUsage = Math.max(maxMemoryUsage, memoryUsage.rss);
};

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;

  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }

  console.log(`Number of workers: ${Object.keys(cluster.workers).length}`);

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  createServer(async (request, response) => {
    if (request.method === "OPTIONS") {
      response.writeHead(204, headers);
      response.end();
      return;
    }

    request.once("close", () => {
      console.log(
        `Connection was closed with ${itemsProcessed} items processed`
      );
      console.log(`Max memory usage: ${byteSize(maxMemoryUsage)}`);
      abortController.abort();
    });

    response.writeHead(200, headers);

    try {
      const { size } = await stat(filename);
      console.log("Processing: ", `${byteSize(size)}`);

      await Readable.toWeb(createReadStream(filename))
        .pipeThrough(
          Transform.toWeb(
            csvtojson({ headers: ["cord_uid", "sha", "publish_time"] })
          )
        )
        .pipeThrough(
          new TransformStream({
            async transform(chunk, controller) {
              itemsProcessed += 1;
              measureMemoryUsage();

              const {
                cord_uid: cordUid,
                sha,
                publish_time: publishTime,
              } = JSON.parse(Buffer.from(chunk));

              const mappedData = {
                cordUid,
                sha,
                publishTime,
              };

              controller.enqueue(JSON.stringify(mappedData).concat("\n"));
            },
          })
        )
        .pipeTo(Writable.toWeb(response), { signal: abortController.signal });
    } catch (error) {
      console.error(`Error at server: ${error.message}`);
      response.statusCode = 500;
      response.end("Internal Server Error");
    }
  })
    .listen(PORT_ASYNC)
    .on("listening", () => console.log(`server is running at ${PORT_ASYNC}`));

  console.log(`Worker ${process.pid} is running`);
}
