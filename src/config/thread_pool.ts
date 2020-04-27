import {cpus} from 'os';
import {DynamicPool} from 'node-worker-threads-pool';

const WORKER_THREADS_COUNT =
  cpus().length || (new Number(process.env.WORKER_THREADS_COUNT) as number);

export const dynamicPool = new DynamicPool(WORKER_THREADS_COUNT);
