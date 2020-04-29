import {script} from '@hapi/lab';
import {expect} from '@hapi/code';
import * as esTreeWalker from 'estree-walker';
import type {VariableDeclaration, BaseNode} from 'estree';

export const lab = script();
const {test} = lab;

const ast: VariableDeclaration = {
  type: 'VariableDeclaration',
  declarations: [
    {
      type: 'VariableDeclarator',
      id: {
        type: 'Identifier',
        name: 'a',
      },
      init: {
        type: 'ArrayExpression',
        elements: [],
      },
    },
  ],
  kind: 'const',
};

test('Async Lookup', async () => {
  let foundNode: BaseNode;

  await esTreeWalker.asyncWalk(ast, {
    enter(node) {
      if (node.type === 'Identifier') {
        foundNode = node;
      }

      return new Promise(resolve => process.nextTick(resolve));
    },
  });

  expect(foundNode!.type).to.be.equal('Identifier');
});
