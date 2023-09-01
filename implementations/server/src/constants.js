import tx2 from "tx2";

const PORT_SYNC = 3001;
const PORT_ASYNC = 3000;
const PORT_ASYNC_CLUSTER = 3002;

const filename = "./database/part_10/metadata-1.csv";

const abortController = new AbortController();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
};

const throughputMetric = tx2.meter({
  name: "Throughput Metric",
  samples: 1000,
  timeframe: 1,
});

const splitFactor = 10;

export {
  PORT_ASYNC,
  PORT_SYNC,
  PORT_ASYNC_CLUSTER,
  filename,
  throughputMetric,
  headers,
  abortController,
  splitFactor,
};
