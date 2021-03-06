const path = require('path');
const chokidar = require('chokidar');
const { getFilePaths, getAbsolutePath, isWindows } = require('../utils/Utils');
const { commandSpawn } = require('../utils/Terminal');
const log = require('../utils/Log');
/**
 * ηΌθ―lessζδ»Ά
 * @param filePath
 * @param extensions
 * @returns {Promise<void>}
 */
const compileLess = async (filePath, extensions) => {
    const command = process.platform === 'win32' ? `lessc.cmd` : 'lessc';
    for (const ext of extensions) {
        const name = path.basename(filePath).replace(path.extname(filePath), ext);
        await commandSpawn(command, [filePath, path.join(path.dirname(filePath), name)]);
        log.success('', `${isWindows() ? '' : 'π '}compile ${filePath} successfully`);
    }
};
/**
 * less
 * @param dest
 * @param watch
 * @param extensions
 * @returns {Promise<void>}
 */
const lesscAction = async (dest = './', watch = false, extensions = ['css']) => {
    extensions = extensions.map((item) => {
        if (!item.startsWith('.')) {
            return '.' + item;
        }
        return item;
    });
    const rootPath = getAbsolutePath(dest);
    if (watch) {
        // ηε¬εε
        const files = rootPath + '/**/*.less';
        log.notice('', `${isWindows() ? '' : ' π¦ '}watching less file change`);
        chokidar.watch(files).on('change', async (filePath) => {
            await compileLess(filePath, extensions);
        });
    } else {
        // ιε½θ·εζζζδ»ΆθΏθ‘ηΌθ―
        log.notice('', ` ${isWindows() ? '' : ' π '}getting less file path`);
        const filePaths = [];
        const beginTime = Date.now();
        getFilePaths(rootPath, filePaths, '.less');
        for (const filePath of filePaths) {
            await compileLess(filePath, extensions);
        }
        const endTime = Date.now();
        log.success('', `${isWindows() ? '' : 'π '}compile less complete,  duration: ${endTime - beginTime}ms`);
    }
};
module.exports = lesscAction;
