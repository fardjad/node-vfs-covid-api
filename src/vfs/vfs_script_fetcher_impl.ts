import got from 'got';
import type {VFSConfig} from '../config/vfs_config';
import type VFSScriptFetcher from './vfs_script_fetcher';

export default class VFSScriptFetcherImpl implements VFSScriptFetcher {
  private vfsScriptUrl: string;

  public constructor({VFS_SCRIPT_URL}: VFSConfig) {
    this.vfsScriptUrl = VFS_SCRIPT_URL;
  }

  public fetchScript() {
    return got.get(this.vfsScriptUrl).text();
  }
}
