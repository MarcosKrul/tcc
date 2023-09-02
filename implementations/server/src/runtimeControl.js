const getRuntimeFormatted = (start, end) =>
  `${Number((end - start) / 1000).toFixed(3)}s`;

export { getRuntimeFormatted };
