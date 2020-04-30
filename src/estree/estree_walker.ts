import type {BaseNode} from 'estree';

export default interface ESTreeWalker {
  asyncWalk(
    ast: BaseNode,
    walker: {
      enter(node: BaseNode, parent: BaseNode): Promise<void>;
    }
  ): Promise<BaseNode>;
}
