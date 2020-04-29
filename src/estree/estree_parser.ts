import type {Node} from 'estree';

export interface ESTreeParser {
  parse(source: string): Promise<Node>;
}
