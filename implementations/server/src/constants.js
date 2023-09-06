const PORT_SYNC = 3000;
const PORT_ASYNC = 3001;
const PORT_ASYNC_CLUSTER = 3002;

const filename = "./database/part_10/metadata-1.csv";

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
};

const SPLIT_FACTOR = 10;

const NUM_REQUESTS = 10;

export {
  PORT_ASYNC,
  NUM_REQUESTS,
  PORT_SYNC,
  PORT_ASYNC_CLUSTER,
  filename,
  headers,
  SPLIT_FACTOR,
};
