import VFSScriptFetcher from '../../src/vfs/vfs_script_fetcher';

export class ErrorVFSScriptFetcher implements VFSScriptFetcher {
  public async fetchScript(): Promise<string> {
    throw new Error();
  }
}
