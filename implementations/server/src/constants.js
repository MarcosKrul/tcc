const PORT = 3000;

const filename = "./database/metadata.csv";

const abortController = new AbortController();

const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "*",
};

export { PORT, filename, headers, abortController };
