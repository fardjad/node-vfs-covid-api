import {Script} from 'vm';

import {
  Node,
  Property,
  ArrayExpression,
  ExpressionStatement,
  Identifier,
} from 'estree';
import {ESTreeParser} from '../estree/estree_parser';
import {ESTreeWalker} from '../estree/estree_walker';
import {ESTreeCodeGenerator} from '../estree/estree_code_generator';

import VFSDataExtractionException from './exception/vfs_data_extraction_exception';
import VFSScriptFetcher from './vfs_script_fetcher';
import SourceCountry from './data/source_country';

export default class VfsCovidDataExtractor {
  private vfsScriptFetcher: VFSScriptFetcher;

  private esTreeParser: ESTreeParser;

  private esTreeWalker: ESTreeWalker;

  private esTreeCodeGenerator: ESTreeCodeGenerator;

  constructor(
    vfsScriptFetcher: VFSScriptFetcher,
    esTreeParser: ESTreeParser,
    esTreeWalker: ESTreeWalker,
    esTreeCodeGenerator: ESTreeCodeGenerator
  ) {
    this.vfsScriptFetcher = vfsScriptFetcher;
    this.esTreeParser = esTreeParser;
    this.esTreeWalker = esTreeWalker;
    this.esTreeCodeGenerator = esTreeCodeGenerator;
  }

  public async extractVfsCovidData(): Promise<SourceCountry[]> {
    const vfsScript = await this.vfsScriptFetcher.fetchScript();
    const parsedVfsScript = await this.esTreeParser.parse(vfsScript);
    const covidDataArrayExpression = await this.findCovidDataArrayExpression(
      parsedVfsScript
    );
    return this.arrayExpressionToJsArray(covidDataArrayExpression);
  }

  private async findCovidDataArrayExpression(
    parsedVfsScript: Node
  ): Promise<ArrayExpression> {
    let covidDataNode: Node | null = null;

    await this.esTreeWalker.asyncWalk(parsedVfsScript, {
      enter(node, parent) {
        if (
          node.type === 'Identifier' &&
          (node as Identifier).name === 'covid_page_data'
        ) {
          covidDataNode = (parent as Property).value;
        }
        return new Promise(resolve => setImmediate(resolve));
      },
    });

    if (covidDataNode == null) {
      throw new VFSDataExtractionException();
    }

    return covidDataNode;
  }

  private async arrayExpressionToJsArray<T>(
    arrayExpresson: ArrayExpression
  ): Promise<T[]> {
    const ast: ExpressionStatement = {
      type: 'ExpressionStatement',
      expression: {
        type: 'AssignmentExpression',
        operator: '=',
        left: {
          type: 'Identifier',
          name: 'arr',
        },
        right: arrayExpresson,
      },
    };

    const code = await this.esTreeCodeGenerator.generate(ast);
    const script = new Script(code);
    const context = {
      arr: [],
    };
    script.runInNewContext(context);
    return context.arr;
  }
}
