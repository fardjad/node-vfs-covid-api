import {Node} from 'estree';
import {DynamicPool} from 'node-worker-threads-pool';
import {ESTreeParser} from './estree_parser';

export default class AcornESTreeParser implements ESTreeParser {
  private dynamicPool: DynamicPool;

  public constructor(dynamicPool: DynamicPool) {
    this.dynamicPool = dynamicPool;
  }

  public parse(code: string) {
    return this.dynamicPool.exec({
      task() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const acorn = require('acorn');
        return acorn.parse(this.workerData.code);
      },
      workerData: {code},
    }) as Promise<Node>;
  }
}
