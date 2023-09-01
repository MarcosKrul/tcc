const autocannon = require("autocannon");

autocannon({
  url: "http://localhost:3000",
  connections: 1000,
  timeout: 999999,
});
