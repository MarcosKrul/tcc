import byteSize from "byte-size";
import csvtojson from "csvtojson";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { Readable, Transform, Writable } from "node:stream";
import { TransformStream } from "node:stream/web";

import { abortController, PORT, filename, headers } from "./constants.js";

createServer(async (request, response) => {
  let items = 0;
  let maxMemoryUsage = process.memoryUsage().rss;

  if (request.method === "OPTIONS") {
    response.writeHead(204, headers);
    response.end();
    return;
  }

  request.once("close", () => {
    console.log(`connection was closed with ${items} items processed`);
    console.log(`max memory usage: ${byteSize(maxMemoryUsage)}`);
    abortController.abort();
  });

  response.writeHead(200, headers);

  try {
    const { size } = await stat(filename);
    console.log("processing: ", `${byteSize(size)}`);

    await Readable.toWeb(createReadStream(filename))
      .pipeThrough(
        Transform.toWeb(
          csvtojson({ headers: ["cord_uid", "sha", "publish_time"] })
        )
      )
      .pipeThrough(
        new TransformStream({
          async transform(chunk, controller) {
            items += 1;
            maxMemoryUsage = Math.max(
              maxMemoryUsage,
              process.memoryUsage().rss
            );

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
    console.log(`Error at server: ${error.message}`);
  }
})
  .listen(PORT)
  .on("listening", () => console.log(`server is running at ${PORT}`));
