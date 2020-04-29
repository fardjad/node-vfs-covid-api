import {script} from '@hapi/lab';
import {expect} from '@hapi/code';
import memoize from '../src/cache/expiring_niladic_function_memoizer';

export const lab = script();
const {describe, it, beforeEach} = lab;

describe('A Niladic Function Memoizer', () => {
  let value = 0;
  let memoizedFunction: () => Promise<number>;
  let currentTick = BigInt(0);
  const getTick = () => currentTick;

  const increment = async () => {
    value += 1;
    await new Promise(resolve => setImmediate(resolve));
    return value;
  };

  const nSecondsLater = (n: number) => {
    currentTick += BigInt(n) * BigInt(10) ** BigInt(9);
  };

  beforeEach(() => {
    value = 0;
    memoizedFunction = memoize(getTick)(1)(increment);
  });

  it('Should cache the function return value until it expires', async () => {
    await memoizedFunction();
    expect(await memoizedFunction()).to.be.equal(1);
  });

  it('Should invalidate the cache after the cache expiry time', async () => {
    await memoizedFunction();
    nSecondsLater(2);
    expect(await memoizedFunction()).to.be.equal(2);
  });

  it('Should prevent the underlying function from being called more than once concurrently', async () => {
    const result = await Promise.all([memoizedFunction(), memoizedFunction()]);
    expect(result).to.be.equal([1, 1]);
  });
});
