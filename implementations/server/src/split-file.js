import { createReadStream, existsSync, mkdirSync, writeFile } from "node:fs";
import readline from "readline";

import { splitFactor } from "./constants.js";

const createDir = (filePath) => {
  if (existsSync(filePath)) return;
  mkdirSync(filePath);
};

const splitFile = async () => {
  const data = [];
  let linesRead = 0;
  let fileCreated = 1;

  createDir(`database/part_${splitFactor}`);

  const readStream = createReadStream("database/metadata.csv");
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  rl.on("line", (line) => {
    linesRead += 1;
    data.push(line);

    if (linesRead * splitFactor >= 1000000) {
      linesRead = 0;
      writeFile(
        `database/part_${splitFactor}/metadata-${fileCreated}.csv`,
        data.join("\n"),
        "utf-8",
        (err) => {
          if (err) console.log("ERR", err);
        }
      );
      fileCreated += 1;
      data.length = 0;
    }
  });

  rl.on("close", () => {
    console.log("Leitura do arquivo CSV concluída.");
  });
};

splitFile();
