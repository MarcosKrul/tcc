import { createReadStream, writeFile } from "node:fs";
import readline from "readline";

import { splitFactor } from "./constants.js";

const splitFile = async () => {
  const vetorAiFora = [];
  let linesRead = 0;
  let fileCreated = 1;

  const readStream = createReadStream("../database/metadata.csv");
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity, // Para tratar diferentes formatos de quebra de linha
  });

  rl.on("line", (line) => {
    linesRead += 1;
    vetorAiFora.push(line);

    if (linesRead * splitFactor >= 1000000) {
      linesRead = 0;
      writeFile(
        `../database/${fileCreated}-metadata-part.csv`,
        vetorAiFora.join("\n"),
        "utf-8",
        (err) => {
          console.log("ERR", err);
        }
      );
      fileCreated += 1;
      vetorAiFora.length = 0;
    }
  });

  rl.on("close", () => {
    console.log("Leitura do arquivo CSV concluída.");
  });
};

splitFile();
