import byteSize from "byte-size";
import fs from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";

import { abortController, PORT, filename, headers } from "./constants.js";

createServer(async (request, response) => {
  const items = 0;
  const maxMemoryUsage = process.memoryUsage().rss;

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

    fs.readFile(filename, "utf8", (err, data) => {
      if (err) {
        response.statusCode = 500;
        throw err;
      }

      response.end(data);
    });
  } catch (error) {
    console.log(`Error at server: ${error.message}`);
  }
})
  .listen(PORT)
  .on("listening", () => console.log(`server is running at ${PORT}`));
