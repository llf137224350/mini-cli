const path = require('path');
const chokidar = require('chokidar');
const {getFilePaths} = require("../utils/Utils");
const commandSpawn = require("../utils/Terminal");
const log = require("../utils/Log");
/**
 * 编译less文件
 * @param filePath
 * @param extensions
 * @returns {Promise<void>}
 */
const compileLess = async (filePath, extensions) => {
    const command = process.platform === 'win32' ? `lessc.cmd` : 'lessc';
    for (const ext of extensions) {
        const name = path.basename(filePath).replace(path.extname(filePath), ext);
        await commandSpawn(command, [filePath, path.join(path.dirname(filePath), name)]);
        log.success('', `🎉 compile ${filePath} successfully`);
    }
}
/**
 * less
 * @param dest
 * @param watch
 * @param extensions
 * @returns {Promise<void>}
 */
const lesscAction = async (dest = './', watch = false, extensions = ['css']) => {
    extensions = extensions.map(item => {
        if (!item.startsWith('.')) {
            return '.' + item;
        }
        return item;
    })
    const rootPath = path.resolve(process.env.PWD, dest);
    if (watch) { // 监听变化
        const files = rootPath + '/**/*.less';
        log.notice('', ' 🦉 watching less file change');
        chokidar.watch(files).on('change', async (filePath) => {
            await compileLess(filePath, extensions);
        });
    } else { // 递归获取所有文件进行编译
        log.notice('', ` 🔍 getting less file path`)
        const filePaths = [];
        const beginTime = Date.now();
        getFilePaths(rootPath, filePaths, '.less');
        for (const filePath of filePaths) {
            await compileLess(filePath, extensions);
        }
        const endTime = Date.now();
        log.success('', `🎉 compile less complete,  duration: ${endTime - beginTime}ms`);
    }

}
module.exports = lesscAction;
