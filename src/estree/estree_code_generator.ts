import type {Node} from 'estree';

export interface ESTreeCodeGenerator {
  generate(node: Node): Promise<string>;
}
