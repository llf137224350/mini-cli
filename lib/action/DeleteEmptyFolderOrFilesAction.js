const path = require('path');
const fs = require('fs');
const log = require('../utils/Log');
const { confirm, _pathExists } = require('../utils/Utils');
/** 
 * 批量删除空文件夹和指定扩展名文件
*/

let deleteFolderCount = 0; // 删除文件夹数量

const confirmAction = async (rootPath, extensions) => {
    let message = `are you sure to delete the empty folder under the "${rootPath}" directory?`;
    if (extensions.length) {
        extensions = extensions.map((item) => '*' + item);
        message = `are you sure to delete the empty folder under the "${rootPath}" directory and files end with "${extensions}"?`;
    }
    return await confirm(message);
};
/**
 * 删除空文件夹或者指定扩展名文件
 * @param {string} dest  目标目录
 * @param {*} extensions
 * @param {*} force 是否强制执行
 */
const deleteEmptyFolderOrFilesAction = async (dest = './', extensions = [], force = false) => {
    const rootPath = path.resolve(process.env.PWD, dest);
    if (!(await _pathExists(rootPath))) {
        return;
    }
    let result = true;
    if (!force) {
        // 询问是否继续
        log.warn('', 'the deletion operation is about to be performed. The data is priceless. Please operate with caution!');
        result = await confirmAction(rootPath, extensions);
    }
    if (!result) {
        // 终止操作
        return;
    }
    execDeleteEmptyFolderOrFiles(rootPath, extensions);
};
/**
 * 获取wxss和js
 * @param {*} currentPath 当前目录
 * @param {*} filePaths wxss、js文件路径目录
 * @param {*} dirPaths 空目录
 * @param {*} extNames 扩展名
 * @param {*} systemHiddenFiles 隐藏目录
 * @returns
 */
function getEmptyAndFiles(currentPath, filePaths, dirPaths, extNames = [], systemHiddenFiles = ['.DS_Store']) {
    const files = fs.readdirSync(currentPath, { withFileTypes: true });
    if (!files.length) {
        // 空目录
        dirPaths.push(currentPath);
        return;
    }
    const tempFiles = files.filter((file) => extNames.includes(path.extname(file.name)) || systemHiddenFiles.includes(file.name));
    if (files.length === tempFiles.length) {
        // 只包括待删除文件的目录，也当做空目录
        dirPaths.push(currentPath);
    }
    for (const file of files) {
        // mac下系统隐藏文件，添加到待删除文件列表，这个文件的存在将无法删除目录
        if (systemHiddenFiles.includes(file.name)) {
            filePaths.push(path.resolve(currentPath, './', file.name));
            continue;
        }
        if (file.isFile()) {
            // 是wxss或js文件
            if (extNames.includes(path.extname(file.name))) {
                filePaths.push(path.resolve(currentPath, './', file.name));
            }
        } else if (file.isDirectory()) {
            // 递归 - 尾调用
            getEmptyAndFiles(path.resolve(currentPath, './', file.name), filePaths, dirPaths, extNames, systemHiddenFiles);
        }
    }
}

/**
 *  删除空目录
 * @param {} currentDirPath 目标目录
 * @returns
 */
function deleteCurrentPath(rootPath, currentDirPath) {
    // 重点！！！
    if (rootPath === currentDirPath) {
        return;
    }
    const files = fs.readdirSync(currentDirPath);
    if (!files.length) {
        // 空文件夹
        log.success('', `deleting: ${currentDirPath}`);
        fs.rmdirSync(currentDirPath);
        deleteFolderCount++;
        deleteCurrentPath(rootPath, currentDirPath.substring(0, currentDirPath.lastIndexOf('/')));
    }
}

/**
 * 执行删除操作
 * @param {*} rootPath
 * @param {*} extensions
 */
const execDeleteEmptyFolderOrFiles = (rootPath, extensions) => {
    const filePaths = []; // wxss、js
    const dirPaths = []; // 空目录
    getEmptyAndFiles(rootPath, filePaths, dirPaths, extensions);
    // 删除文件
    if (filePaths.length) {
        log.notice('', 'start deleting files');
        for (const currentPath of filePaths) {
            log.success('', `deleting: ${currentPath}`);
            fs.unlinkSync(currentPath);
        }
    }
    // 删除空目录
    if (filePaths.length || dirPaths.length) {
        if (dirPaths.length !== 1 || (dirPaths.length === 1 && dirPaths[0] !== rootPath)) {
            log.notice('', 'start deleting empty directory');
            for (const currentDirPath of dirPaths) {
                deleteCurrentPath(rootPath, currentDirPath);
            }
        }
    }

    log.success('', `🎉 delete ${extensions.map((item) => '*' + item)} and empty directory completed, include ${filePaths.length} files and ${deleteFolderCount} empty directories.    `);
};
module.exports = deleteEmptyFolderOrFilesAction;
