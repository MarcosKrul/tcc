const PORT_SYNC = 3000;
const PORT_ASYNC = 3001;
const PORT_ASYNC_CLUSTER = 3002;

const filename = "./database/part_10/metadata-1.csv";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
};

const splitFactor = 10;

export {
  PORT_ASYNC,
  PORT_SYNC,
  PORT_ASYNC_CLUSTER,
  filename,
  headers,
  splitFactor,
};
