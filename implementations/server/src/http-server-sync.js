import byteSize from "byte-size";
import fs from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";

import {
  PORT_SYNC,
  abortController,
  filename,
  headers,
  throughputMetric,
} from "./constants.js";

createServer(async (request, response) => {
  throughputMetric.mark();

  if (request.method === "OPTIONS") {
    response.writeHead(204, headers);
    response.end();
    return;
  }

  request.once("close", () => {
    console.log(`Connection was closed`);
    abortController.abort();
  });

  response.writeHead(200, headers);

  try {
    const { size } = await stat(filename);
    console.log("processing:", byteSize(size));

    const data = fs.readFileSync(filename);
    response.end(data);
  } catch (error) {
    console.error(`Error at server: ${error.message}`);
    response.statusCode = 500;
    response.end("Internal Server Error");
  }
})
  .listen(PORT_SYNC)
  .on("listening", () => console.log(`server is running at ${PORT_SYNC}`));
