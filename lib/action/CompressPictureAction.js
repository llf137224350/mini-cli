const fse = require('fs-extra');
const {checkPictureFilePaths, makeSureDirectoryExists, getAbsolutePath} = require("../utils/Utils");
const path = require("path");
const {handleCompress} = require("./UploadFiles2ServerAction");
const startSpinner = require("../utils/Spinner");
const log = require("../utils/Log");
const {TINIFY_API_KEY} = require("../common/EnvironmentVariable");
/**
 * 压缩图片
 * @param localPicturePaths
 * @param dest
 * @returns {Promise<void>}
 */
const compressPictureAction = async (localPicturePaths, dest) => {
    if (!process.env[TINIFY_API_KEY]) {
        log.error('', 'compression failed, please set "tinify_api_key", for example:  cli config set tinify_api_key xxx');
        return;
    }
    if (!await checkPictureFilePaths(localPicturePaths)) {
        return;
    }
    let rootPath;
    if (dest) { // 指定了目录，确定目录是否存在
        rootPath = getAbsolutePath(dest);
        await makeSureDirectoryExists(rootPath);
    }
    const spinner = startSpinner('');
    const compressedSize = [];
    for (const localPicturePath of localPicturePaths) {
        let otherPath;
        const fileName = path.basename(localPicturePath);
        if (rootPath) {
            otherPath = path.resolve(rootPath, fileName);
        }
        spinner.setSpinnerTitle(`compressing: ${fileName} %s`);
        const compressBeforeSize = fse.statSync(localPicturePath).size;
        await handleCompress(localPicturePath, otherPath);
        const compressAfterSize = fse.statSync(otherPath || localPicturePath).size;
        compressedSize.push({
            fileName,
            size: ((compressAfterSize - compressBeforeSize) / 1024).toFixed(2)
        })
    }
    spinner.stop(true);
    log.success('', '🚀  compression complete');
    compressedSize.forEach(item => {
        log.notice('', ` 🗑 ${item.fileName} storage size reduced: ${item.size}KB`)
    });
}

module.exports = compressPictureAction;
