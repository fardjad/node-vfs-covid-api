import {injectable} from 'tsyringe';
import {DynamicPool} from 'node-worker-threads-pool';
import ESTreeCodeGenerator from './estree_code_generator';
import type {Node} from 'estree';

@injectable()
export default class AstringESTreeCodeGenerator implements ESTreeCodeGenerator {
  public constructor(private dynamicPool: DynamicPool) {}

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
