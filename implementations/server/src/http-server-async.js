import byteSize from "byte-size";
import csvtojson from "csvtojson";
import { format } from "date-fns";
import { randomUUID } from "node:crypto";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { performance } from "node:perf_hooks";
import { Readable, Transform, Writable } from "node:stream";
import { TransformStream } from "node:stream/web";

import { PORT_ASYNC, filename, headers } from "./constants.js";
import { getRuntimeFormatted } from "./runtimeControl.js";

let itemsProcessed = 0;
let maxMemoryUsage = process.memoryUsage().rss;

const measureMemoryUsage = () => {
  const memoryUsage = process.memoryUsage();
  maxMemoryUsage = Math.max(maxMemoryUsage, memoryUsage.rss);
};

createServer(async (request, response) => {
  let startTime = -1;
  const requestId = randomUUID();

  if (request.method === "OPTIONS") {
    response.writeHead(204, headers);
    response.end();
    return;
  }

  request.once("close", () => {
    console.log(
      `${format(
        new Date(),
        "dd/MM/yyyy HH:mm:ss"
      )} Connection ${requestId} was closed with ${getRuntimeFormatted(
        startTime,
        performance.now()
      )}s`
    );
    console.log(
      `${itemsProcessed} items processed with Max memory usage: ${byteSize(
        maxMemoryUsage
      )}`
    );
  });

  response.writeHead(200, headers);

  try {
    startTime = performance.now();
    const { size } = await stat(filename);
    console.log(
      `${format(new Date(), "dd/MM/yyyy HH:mm:ss")} ${requestId} Processing: `,
      `${byteSize(size)}`
    );

    startTime = performance.now();

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
      .pipeTo(Writable.toWeb(response));
  } catch (error) {
    console.error(`Error at server: ${error.message}`);
    response.statusCode = 500;
    response.end("Internal Server Error");
  }
})
  .listen(PORT_ASYNC)
  .on("listening", () => console.log(`server is running at ${PORT_ASYNC}`));
