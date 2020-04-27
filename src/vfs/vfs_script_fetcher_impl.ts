import VFSScriptFetcher from './vfs_script_fetcher';
import {VFS_SCRIPT_URL} from '../config/vfs_config';

import got from 'got';

export default class VFSScriptFetcherImpl implements VFSScriptFetcher {
  fetchScript() {
    return got.get(VFS_SCRIPT_URL).text();
  }
}
