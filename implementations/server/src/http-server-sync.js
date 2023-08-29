import byteSize from "byte-size";
import fs from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";

import { PORT_SYNC, filename, headers } from "./constants.js";

createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    response.writeHead(204, headers);
    response.end();
    return;
  }

  try {
    const { size } = await stat(filename);
    console.log("processing:", byteSize(size));

    response.writeHead(200, headers);

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
