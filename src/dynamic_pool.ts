import {DynamicPool} from 'node-worker-threads-pool';
import type {DependencyContainer} from 'tsyringe';
import type {ThreadPoolConfig} from './config/thread_pool_config';

export const makeDynamicPool = (container: DependencyContainer) => {
  const {WORKER_THREADS_COUNT} = container.resolve<ThreadPoolConfig>(
    'ThreadPoolConfig'
  );

  return new DynamicPool(WORKER_THREADS_COUNT);
};
