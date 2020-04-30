import type {Node} from 'estree';

export default interface ESTreeCodeGenerator {
  generate(node: Node): Promise<string>;
}
