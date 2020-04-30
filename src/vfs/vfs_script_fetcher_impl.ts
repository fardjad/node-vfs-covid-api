import got from 'got';
import {inject, injectable} from 'tsyringe';
import {VFSConfig} from '../config/vfs_config';
import VFSScriptFetcher from './vfs_script_fetcher';

@injectable()
export default class VFSScriptFetcherImpl implements VFSScriptFetcher {
  public constructor(@inject('VFSConfig') private vfsConfig: VFSConfig) {}

  public fetchScript() {
    return got.get(this.vfsConfig.VFS_SCRIPT_URL).text();
  }
}
