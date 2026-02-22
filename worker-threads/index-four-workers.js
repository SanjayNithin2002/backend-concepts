import express from "express";
import morgan from "morgan";
import { Worker } from "worker_threads";

const PORT = process.env.PORT || 3000;
const THREAD_COUNT = 4;

function createWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./four-workers.js", {
      workerData: {
        thread_count: THREAD_COUNT,
      },
    });
    worker.on("message", (data) => {
      resolve(data);
    });
    worker.on("error", (err) => {
      reject(err);
    });
  });
}

const app = express();

app.use(morgan(':url :total-time ms'));

app.get("/non-blocking", (req, res) => {
  res.status(200).send("This page is non-blocking");
});

app.get("/four-worker-thread", async (req, res) => {
  const workerPromises = [];
  for (let i = 0; i < THREAD_COUNT; i++) {
    workerPromises.push(createWorker());
  }
  const thread_result = await Promise.all(workerPromises);
  const total = thread_result.reduce((acc, cur) => acc + cur, 0);
  res.status(200).send(`result is ${total}`);
});

app.get("/single-worker-thread", async (req, res) => {
  const worker = new Worker("./worker.js");
  worker.on("message", (data) => {
    res.status(200).send(`This page is blocking: ${data}`);
  });
  worker.on("error", (err) => {
    res.status(500).send(err);
  });
});

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
