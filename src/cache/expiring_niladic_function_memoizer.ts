/* eslint-disable @typescript-eslint/no-explicit-any */

type AnyFn = (...args: any[]) => any;

export default class ExpiringNiladicFunctionMemoizer {
  public constructor(
    private lifeTimeInSeconds: number,
    private getTicks: () => bigint = process.hrtime.bigint
  ) {}

  memoize<Fn extends AnyFn>(fn: Fn) {
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
