import byteSize from "byte-size";
import fs from "node:fs";
import { performance } from "node:perf_hooks";

import { filename } from "./constants.js";

const readFileSyncMethod = (filePath) => {
  const start = performance.now();
  const _ = fs.readFileSync(filePath);
  const end = performance.now();

  return {
    executionTime: end - start,
    memoryUsage: process.memoryUsage().rss,
  };
};

const readStreamMethod = (filePath) => {
  const start = performance.now();
  const readStream = fs.createReadStream(filePath);
  let memoryUsage = process.memoryUsage().rss;

  readStream.on("data", (_) => {
    memoryUsage = Math.max(memoryUsage, process.memoryUsage().rss);
  });

  return new Promise((resolve, reject) => {
    readStream.on("end", () => {
      const end = performance.now();
      resolve({ executionTime: end - start, memoryUsage });
    });

    readStream.on("error", reject);
  });
};

const printResults = (title, { executionTime, memoryUsage }) => {
  console.log(title);
  console.log(`Tempo de execução: ${executionTime}ms`);
  console.log(
    `Consumo de memória: ${memoryUsage} bytes (${byteSize(memoryUsage)})`
  );
};

const runComparison = async () => {
  const streamMethodResult = await readStreamMethod(filename);
  printResults("Leitura usando streams: ", streamMethodResult);

  const syncMethodResult = readFileSyncMethod(filename);
  printResults("Leitura simples usando métodos síncronos: ", syncMethodResult);
};

runComparison();
