import {ESTreeCodeGenerator} from './estree_code_generator';
import {dynamicPool} from '../config/thread_pool';
import {Node} from 'estree';

export default class AstringESTreeCodeGenerator implements ESTreeCodeGenerator {
  generate(node: Node) {
    return dynamicPool.exec({
      task() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const astring = require('astring');
        return astring.generate(this.workerData.node);
      },
      workerData: {node},
    });
  }
}
