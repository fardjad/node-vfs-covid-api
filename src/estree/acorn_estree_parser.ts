import {ESTreeParser} from './estree_parser';
import {dynamicPool} from '../config/thread_pool';
import {Node} from 'estree';

export default class AcornESTreeParser implements ESTreeParser {
  parse(code: string) {
    return dynamicPool.exec({
      task() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const acorn = require('acorn');
        return acorn.parse(this.workerData.code);
      },
      workerData: {code},
    }) as Promise<Node>;
  }
}
