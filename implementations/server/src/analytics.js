import byteSize from "byte-size";
import { format } from "date-fns";
import fs from "node:fs";
import path from "node:path";

import { NUM_REQUESTS } from "./constants.js";

const getRuntimeFormatted = (start, end) =>
  `${Number((end - start) / 1000).toFixed(3)}s`;

const getFilePath = (server) =>
  path.join(process.env.PWD, "tmp", server, "requests.json");

const getData = (filePath) => {
  if (!fs.existsSync(filePath))
    return { requests: [], count: 0, start: 0, end: 0 };
  const raw = fs.readFileSync(filePath);
  return JSON.parse(raw);
};

const getFormattedMetric = ({ value, unity }) => ({
  value,
  readable: `${Number(value).toFixed(3)} ${unity}`,
});

const calcMetrics = ({ server }) => {
  const filePath = getFilePath(server);

  const data = getData(filePath);

  if (!data || !data.requests || data.requests.length === 0) return;

  const [firstRequest] = data.requests;

  const timeProcessing = data.requests.reduce(
    (acc, current) => acc + (current.endTime - current.startTime),
    firstRequest.endTime - firstRequest.startTime
  );

  const timeProcessingInMinutes = timeProcessing / 1000 / 60;

  const analytics = {
    throughput: getFormattedMetric({
      value: NUM_REQUESTS / timeProcessingInMinutes,
      unity: "req/min",
    }),
    avg: getFormattedMetric({
      value: timeProcessingInMinutes / NUM_REQUESTS,
      unity: "m",
    }),
  };

  fs.writeFileSync(
    path.join(process.env.PWD, "tmp", server, "analytics.json"),
    JSON.stringify(analytics)
  );
};

const saveRequestMetrics = ({
  server,
  startTime,
  endTime,
  requestId,
  itemsProcessed,
  maxMemoryUsage,
}) => {
  const filePath = getFilePath(server);

  const data = getData(filePath);

  console.log(
    `${format(
      new Date(),
      "dd/MM/yyyy HH:mm:ss"
    )} Connection ${requestId} was closed with ${getRuntimeFormatted(
      startTime,
      endTime
    )}s`,
    itemsProcessed ? `${itemsProcessed} items processed` : "",
    maxMemoryUsage ? `Max memory usage: ${byteSize(maxMemoryUsage)}` : ""
  );

  const start =
    data.requests.length > 0
      ? data.requests.reduce(
          (acc, current) => (current.startTime < acc ? current.startTime : acc),
          data.requests[0].startTime
        )
      : startTime;

  const end =
    data.requests.length > 0
      ? data.requests.reduce(
          (acc, current) => (current.endTime > acc ? current.endTime : acc),
          data.requests[0].endTime
        )
      : endTime;

  const newData = {
    count: (data.count ?? 0) + 1,
    end,
    start,
    requests: [
      ...data.requests,
      {
        id: requestId,
        startTime,
        endTime,
        itemsProcessed: itemsProcessed ?? undefined,
        maxMemoryUsage: maxMemoryUsage
          ? {
              bytes: maxMemoryUsage,
              readable: byteSize(maxMemoryUsage).toString(),
            }
          : undefined,
        readable: getRuntimeFormatted(startTime, endTime),
      },
    ],
  };

  fs.writeFileSync(filePath, JSON.stringify(newData));

  calcMetrics({ server });
};

export { getRuntimeFormatted, saveRequestMetrics };
