export default interface VFSScriptFetcher {
  fetchScript(): Promise<string>;
}
