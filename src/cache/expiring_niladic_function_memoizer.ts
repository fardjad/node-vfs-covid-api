/* eslint-disable @typescript-eslint/no-explicit-any */

import type {DependencyContainer} from 'tsyringe';
import type {VFSConfig} from '../config/vfs_config';

type AnyFn = (...args: any[]) => any;

export class ExpiringNiladicFunctionMemoizer {
  public constructor(
    private lifeTimeInSeconds: number,
    private getTicks: () => bigint = process.hrtime.bigint
  ) {}

  public memoize<Fn extends AnyFn>(fn: Fn) {
    type R = ReturnType<Fn> extends Promise<any>
      ? ReturnType<Fn>
      : Promise<ReturnType<Fn>>;

    const lifeTimeInNanoSeconds =
      BigInt(this.lifeTimeInSeconds) * BigInt(10) ** BigInt(9);

    let value: R;
    let lastValueTicks = this.getTicks();
    return () => {
      const currentTicks = this.getTicks();
      const isExpired = currentTicks - lastValueTicks > lifeTimeInNanoSeconds;

      if (value == null || isExpired) {
        value = Promise.resolve(fn()) as R;
        lastValueTicks = currentTicks;
      }

      return value;
    };
  }
}

export const makeExpiringNiladicFunctionMemoizer = (
  container: DependencyContainer
) => {
  const {VFS_DATA_CACHE_DURATION_SECONDS} = container.resolve<VFSConfig>(
    'VFSConfig'
  );

  return new ExpiringNiladicFunctionMemoizer(VFS_DATA_CACHE_DURATION_SECONDS);
};
