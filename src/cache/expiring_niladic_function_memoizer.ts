/* eslint-disable @typescript-eslint/no-explicit-any */

type AnyFn = (...args: any[]) => any;

const memoize = (getTicks = process.hrtime.bigint) => (
  lifeTimeInSeconds: number
) => <Fn extends AnyFn>(fn: Fn) => {
  type R = ReturnType<Fn> extends Promise<any>
    ? ReturnType<Fn>
    : Promise<ReturnType<Fn>>;

  const lifeTimeInNanoSeconds =
    BigInt(lifeTimeInSeconds) * BigInt(10) ** BigInt(9);

  let value: R;
  let lastValueTicks = getTicks();
  return () => {
    const currentTicks = getTicks();
    const isExpired = currentTicks - lastValueTicks > lifeTimeInNanoSeconds;

    if (value == null || isExpired) {
      value = Promise.resolve(fn()) as R;
      lastValueTicks = currentTicks;
    }

    return value;
  };
};

export type MemoizeFn = typeof memoize;
export default memoize;
