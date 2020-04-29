import type {Node} from 'estree';
import type {DynamicPool} from 'node-worker-threads-pool';
import type {ESTreeCodeGenerator} from './estree_code_generator';

export default class AstringESTreeCodeGenerator implements ESTreeCodeGenerator {
  private dynamicPool: DynamicPool;

  public constructor(dynamicPool: DynamicPool) {
    this.dynamicPool = dynamicPool;
  }

  public generate(node: Node) {
    return this.dynamicPool.exec({
      task() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const astring = require('astring');
        return astring.generate(this.workerData.node);
      },
      workerData: {node},
    });
  }
}
