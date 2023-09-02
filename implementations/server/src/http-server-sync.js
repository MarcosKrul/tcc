import byteSize from "byte-size";
import { format } from "date-fns";
import { randomUUID } from "node:crypto";
import fs from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { performance } from "node:perf_hooks";

import { saveRequestMetrics } from "./analytics.js";
import { PORT_SYNC, filename, headers } from "./constants.js";

createServer(async (request, response) => {
  let startTime = -1;
  const requestId = randomUUID();

  if (request.method === "OPTIONS") {
    response.writeHead(204, headers);
    response.end();
    return;
  }

  request.once("close", () => {
    saveRequestMetrics({
      requestId,
      server: "sync",
      startTime,
      endTime: performance.now(),
    });
  });

  response.writeHead(200, headers);

  try {
    startTime = performance.now();
    const { size } = await stat(filename);
    console.log(
      `${format(new Date(), "dd/MM/yyyy HH:mm:ss")} ${requestId} Processing: `,
      `${byteSize(size)}`
    );

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
