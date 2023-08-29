const PORT_SYNC = 3001;
const PORT_ASYNC = 3000;

const filename = "./database/metadata.csv";

const abortController = new AbortController();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
};

export { PORT_ASYNC, PORT_SYNC, filename, headers, abortController };
