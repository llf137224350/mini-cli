const download = require('download-git-repo');
/**
 * download promise 同步版本
 * @param respUrl 仓库地址
 * @param destDir 目标目录
 * @param opts 配置项
 * @returns {Promise<unknown>}
 */
const downloadSync = (respUrl, destDir, opts = {}) => {
  return new Promise((resolve, reject) => {
    download(respUrl, destDir, opts, (err) => {
      err ? reject(err) : resolve();
    });
  });
};
 
module.exports = downloadSync;
