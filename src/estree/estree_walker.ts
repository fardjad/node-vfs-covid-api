import {BaseNode} from 'estree';

export interface ESTreeWalker {
  asyncWalk(
    ast: BaseNode,
    walker: {
      enter(node: BaseNode, parent: BaseNode): Promise<void>;
    }
  ): Promise<BaseNode>;
}
