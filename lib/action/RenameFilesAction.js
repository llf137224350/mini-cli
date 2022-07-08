const path = require('path');
const fs = require('fs');
const log = require('../utils/Log');
const { confirm, _pathExists } = require('../utils/Utils');
/**
 * 批量重命名文件
*/

/**
 * 递归进行重命名
 * @param targetPath
 * @param {*} oldStr
 * @param {*} targetStr
 */
const rename = (targetPath, oldStr, targetStr) => {
    let fileNames = fs.readdirSync(targetPath);
    fileNames = fileNames.filter((fileName) => {
        return fileName !== '.' && fileName !== '..' && fileName !== '.DS_Store';
    });
    if (fileNames && fileNames.length) {
        fileNames.forEach((fileName) => {
            const oldPath = path.join(targetPath, fileName);
            const stat = fs.statSync(oldPath);
            if (stat.isFile()) {
                // 文件
                const newFileName = fileName.replace(oldStr, targetStr);
                const newPath = path.join(targetPath, newFileName);
                if (oldPath !== newPath) {
                    fs.renameSync(oldPath, newPath);
                    log.success('', `🎉  rename ${fileName} to ${newFileName} succeed`);
                }
            } else {
                rename(path.join(targetPath, fileName), oldStr, targetStr);
            }
        });
    }
};
/**
 * 对文件进行批量重命名
 * @param {*} dest
 * @param force
 * @param {*} parameter
 * @returns
 */
const renameFilesAction = async (dest, force = false, parameter = []) => {
    if (!parameter.length || parameter.length !== 2) {
        log.error('', '-p parameter error, format as -p test-1 test');
        return;
    }
    const rootPath = path.resolve(process.env.PWD, dest);
    if (!(await _pathExists(rootPath))) {
        return;
    }
    let result = true;
    if (!force) {
        // 询问是否继续
        result = await confirm('file rename is about to occur. are you sure to continue?');
    }
    if (!result) {
        // 终止操作
        return;
    }
    rename(rootPath, parameter[0], parameter[1]);
};
module.exports = renameFilesAction;
