const autocannon = require("autocannon");

const AMOUNT = 10;

const PORT = process.argv[2];
if (!PORT) process.exit(0);

const instance = autocannon({
  url: `http://localhost:${PORT}`,
  amount: AMOUNT,
  connections: 10,
  connectionRate: 2,
  timeout: 999999,
  method: "GET",
  headers: { connection: "keep-alive" },
});

instance.on("tickComplete", () => {
  if (instance.requestsCompleted >= AMOUNT) {
    autocannon.stop(instance);
  }
});

autocannon.track(instance, {
  renderProgressBar: true,
  renderResultsTable: true,
  renderLatencyTable: true,
});
