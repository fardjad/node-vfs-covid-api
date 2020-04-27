import * as path from 'path';
import {promises as fs} from 'fs';
import * as esTreeWalker from 'estree-walker';
import {script} from '@hapi/lab';
import {expect} from '@hapi/code';

import VFSCovidDataExtractor from '../src/vfs/vfs_covid_data_extractor';
import VFSScriptFetcher from '../src/vfs/vfs_script_fetcher';
import AcornESTreeParser from '../src/estree/acorn_estree_parser';
import AstringESTreeCodeGenerator from '../src/estree/astring_estree_code_generator';

export const lab = script();
const {describe, it, before} = lab;

class MockVFSScriptFetcher implements VFSScriptFetcher {
  public async fetchScript() {
    return fs
      .readFile(path.join(__dirname, './fixtures/vfs_script.min.notjs'), {
        encoding: 'utf-8',
      })
      .then(body => body as string);
  }
}

describe('A VFS Data Extractor', () => {
  let vfsCovidDataExtractor: VFSCovidDataExtractor;

  before(() => {
    const mockVFSScriptFetcher = new MockVFSScriptFetcher();
    const esTreeParser = new AcornESTreeParser();
    const esTreeCodeGenerator = new AstringESTreeCodeGenerator();
    vfsCovidDataExtractor = new VFSCovidDataExtractor(
      mockVFSScriptFetcher,
      esTreeParser,
      esTreeWalker,
      esTreeCodeGenerator
    );
  });

  it('Should return VFS covid data', async () => {
    const covidData = await vfsCovidDataExtractor.extractVfsCovidData();
    expect(covidData).to.be.an.array();
  });
});
