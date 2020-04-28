import VFSScriptFetcher from './vfs_script_fetcher';

import got from 'got';

export default class VFSScriptFetcherImpl implements VFSScriptFetcher {
  private vfsScriptUrl: string;

  public constructor({VFS_SCRIPT_URL}: {VFS_SCRIPT_URL: string}) {
    this.vfsScriptUrl = VFS_SCRIPT_URL;
  }

  public fetchScript() {
    return got.get(this.vfsScriptUrl).text();
  }
}
