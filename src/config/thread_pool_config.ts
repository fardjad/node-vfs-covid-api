import {cpus} from 'os';

export const WORKER_THREADS_COUNT =
  cpus().length || (new Number(process.env.WORKER_THREADS_COUNT) as number);

const threadPoolConfig = {
  WORKER_THREADS_COUNT,
};

export type ThreadPoolConfig = typeof threadPoolConfig;
export default threadPoolConfig;
