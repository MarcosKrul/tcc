import byteSize from "byte-size";
import { constants } from "node:buffer";

console.log(
  `Tamanho máximo do buffer: ${constants.MAX_LENGTH} bytes (${byteSize(
    constants.MAX_LENGTH
  )})`
);
