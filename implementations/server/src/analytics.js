import byteSize from "byte-size";
import { format } from "date-fns";
import fs from "node:fs";
import path from "node:path";

const getRuntimeFormatted = (start, end) =>
  `${Number((end - start) / 1000).toFixed(3)}s`;

const saveRequestMetrics = ({
  server,
  startTime,
  endTime,
  requestId,
  itemsProcessed,
  maxMemoryUsage,
}) => {
  const filePath = path.join(process.env.PWD, "tmp", `${server}.json`);

  const data = (() => {
    if (!fs.existsSync(filePath)) return { requests: [], count: 0 };
    const raw = fs.readFileSync(filePath);
    return JSON.parse(raw);
  })();

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

  const newData = {
    count: (data.count ?? 0) + 1,
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
};

export { getRuntimeFormatted, saveRequestMetrics };
