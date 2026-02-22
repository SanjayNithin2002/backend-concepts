import { Worker } from "node:worker_threads";
import os from "os";
import path from "path";
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class WorkerOrchestrator {
  constructor(size = os.cpus().length) {
    this.size = size;
    this.queue = [];
    this.callbacks = new Map();
    this.idle = [];
    this.workers = [];
    this.taskId = 0;

    for (let i = 0; i < size; i++) {
      const worker = new Worker(path.resolve(__dirname, "worker.js"));
      worker.on("message", (message) => this._handleResult(worker, message));
      worker.on("error", (error) => console.log(error));
      this.idle.push(worker);
      this.workers.push(worker);
    }

    console.log(`${this.size} workers initiated`)
  }

  run(fn, args = []) {
    return new Promise((resolve, reject) => {
      const id = this.taskId++;
      this.callbacks.set(id, { resolve, reject });
      this.queue.push({
        id, 
        fnString: fn.toString(), 
        args
      })
      this._dispatch();
    });
  }

  _dispatch() {
    if (this.idle.length === 0) return;
    if (this.queue.length === 0) return;

    const worker = this.idle.pop();
    const task = this.queue.shift();
    worker.postMessage(task);
  }

  _handleResult(worker, {id, result, error}) {
    const { resolve, reject } = this.callbacks.get(id);
    this.callbacks.delete(id);

    if(error) reject(error);
    else resolve(result);

    this.idle.push(worker);
    this._dispatch();
  }
}

export default new WorkerOrchestrator()
