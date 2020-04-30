import type {Node} from 'estree';

export default interface ESTreeParser {
  parse(source: string): Promise<Node>;
}
