import 'reflect-metadata';
import {script} from '@hapi/lab';
import {expect} from '@hapi/code';
import * as esTreeWalker from 'estree-walker';
import {DynamicPool} from 'node-worker-threads-pool';
import {container} from 'tsyringe';
import VFSCovidDataExtractor from '../src/vfs/vfs_covid_data_extractor';
import AcornESTreeParser from '../src/estree/acorn_estree_parser';
import AstringESTreeCodeGenerator from '../src/estree/astring_estree_code_generator';
import {makeDynamicPool} from '../src/dynamic_pool';
import {MockVFSScriptFetcher} from './support/mock_vfs_script_fetcher';

export const lab = script();
const {describe, it, before} = lab;

describe('A VFS Data Extractor', () => {
  let vfsCovidDataExtractor: VFSCovidDataExtractor;

  before(() => {
    initContainer();
    vfsCovidDataExtractor = container.resolve(VFSCovidDataExtractor);
  });

  const initContainer = () => {
    container.reset();
    container.register('ThreadPoolConfig', {
      useValue: {WORKER_THREADS_COUNT: 1},
    });
    container.register(DynamicPool, {useFactory: makeDynamicPool});
    container.register('ESTreeParser', {useClass: AcornESTreeParser});
    container.register('ESTreeWalker', {useValue: esTreeWalker});
    container.register('ESTreeCodeGenerator', {
      useClass: AstringESTreeCodeGenerator,
    });
    container.register('VFSScriptFetcher', {useClass: MockVFSScriptFetcher});
  };

  it('Should return VFS covid data', async () => {
    const covidData = await vfsCovidDataExtractor.extractVfsCovidData();
    expect(covidData).to.be.an.array();
  });
});
