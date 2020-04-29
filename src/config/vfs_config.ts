const VFS_SCRIPT_URL =
  'https://www.vfsglobal.com/en/assets/js/script.min.js' ||
  process.env.VFS_SCRIPT_URL;

const VFS_DATA_CACHE_DURATION_SECONDS = /\d+/.test(
  String(process.env.VFS_DATA_CACHE_DURATION_SECONDS)
)
  ? Number(process.env.VFS_DATA_CACHE_DURATION_SECONDS)
  : 300;

const vfsConfig = {
  VFS_SCRIPT_URL,
  VFS_DATA_CACHE_DURATION_SECONDS,
};

export type VFSConfig = typeof vfsConfig;
export default vfsConfig;
