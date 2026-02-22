import express from "express";
import { Worker } from "worker_threads";

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/non-blocking", (req, res) => {
  res.status(200).send("This page is non-blocking");
});

app.get("/blocking", (req, res) => {
  const worker = new Worker("./worker.js");
  worker.on("message", (data) => {
    res.status(200).send(`This page is blocking: ${data}`);
  });
  worker.on("error", (err) => {
    res.status(500).send(err);
  })
});

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
