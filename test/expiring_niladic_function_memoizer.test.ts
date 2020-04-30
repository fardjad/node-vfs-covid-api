import 'reflect-metadata';
import {script} from '@hapi/lab';
import {expect} from '@hapi/code';
import {container} from 'tsyringe';
import {ExpiringNiladicFunctionMemoizer} from '../src/cache/expiring_niladic_function_memoizer';

export const lab = script();
const {describe, it, beforeEach} = lab;

const CACHE_EXPIRATION_SECONDS = 1;

describe('A Niladic Function Memoizer', () => {
  let currentTicks = BigInt(0);
  let callCounts = 0;
  let memoizedIncrementAndGetCallCounts: () => Promise<number>;

  beforeEach(() => {
    initContainer();
    memoizedIncrementAndGetCallCounts = makeMemoizedIncrementAndGetCallCounts();
  });

  const initContainer = () => {
    container.reset();
    container.register<ExpiringNiladicFunctionMemoizer>(
      ExpiringNiladicFunctionMemoizer,
      {
        useFactory: () => {
          const getTicks = () => currentTicks;
          return new ExpiringNiladicFunctionMemoizer(
            CACHE_EXPIRATION_SECONDS,
            getTicks
          );
        },
      }
    );
  };

  const makeMemoizedIncrementAndGetCallCounts = () => {
    const expiringNiladicFunctionMemoizer = container.resolve(
      ExpiringNiladicFunctionMemoizer
    );

    callCounts = 0;
    const incrementAndGetCallCounts = async () => {
      callCounts += 1;
      await new Promise(resolve => setImmediate(resolve));
      return callCounts;
    };

    return expiringNiladicFunctionMemoizer.memoize(incrementAndGetCallCounts);
  };

  it('Should cache the function return value until it expires', async () => {
    await memoizedIncrementAndGetCallCounts();
    await memoizedIncrementAndGetCallCounts();
    expect(callCounts).to.be.equal(1);
  });

  it('Should invalidate the cache after the cache expiry time', async () => {
    await memoizedIncrementAndGetCallCounts();
    nSecondsLater(CACHE_EXPIRATION_SECONDS + 1);
    await memoizedIncrementAndGetCallCounts();
    expect(callCounts).to.be.equal(2);
  });

  it('Should prevent the underlying function from being called more than once concurrently', async () => {
    const result = await Promise.all([
      memoizedIncrementAndGetCallCounts(),
      memoizedIncrementAndGetCallCounts(),
    ]);
    expect(result).to.be.equal([1, 1]);
  });

  const nSecondsLater = (n: number) => {
    currentTicks += BigInt(n) * BigInt(10) ** BigInt(9);
  };
});
