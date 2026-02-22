import { parentPort } from "node:worker_threads";

parentPort.on("message", async ({ id, fnString, args }) => {
  try {
    const fn = eval(`(${fnString})`);
    const result = await fn(...args);
    parentPort.postMessage({ id, result });
  } catch (err) {
    parentPort.postMessage({ id, error: err.message });
  }
});
