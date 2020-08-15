import {injectable} from 'tsyringe';
import {DynamicPool} from 'node-worker-threads-pool';
import ESTreeParser from './estree_parser';
import type {Node} from 'estree';

@injectable()
export default class AcornESTreeParser implements ESTreeParser {
  public constructor(private dynamicPool: DynamicPool) {}

  public parse(code: string) {
    return this.dynamicPool.exec({
      task() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const acorn = require('acorn');
        return acorn.parse(this.workerData.code, {
          ecmaVersion: 2020,
        });
      },
      workerData: {code},
    }) as Promise<Node>;
  }
}
