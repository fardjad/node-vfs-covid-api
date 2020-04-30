import {promises as fs} from 'fs';
import * as path from 'path';
import VFSScriptFetcher from '../../src/vfs/vfs_script_fetcher';

export class MockVFSScriptFetcher implements VFSScriptFetcher {
  public async fetchScript() {
    return fs
      .readFile(path.join(__dirname, '../fixtures/vfs_script.min.notjs'), {
        encoding: 'utf-8',
      })
      .then(body => body as string);
  }
}
