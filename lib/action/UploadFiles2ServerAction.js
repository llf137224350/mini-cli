const fs = require('fs');
const path = require('path');
const request = require('request');
const clipboardy = require('clipboardy');
const inquirer = require('inquirer');
const parserProperty = require('parser-property');
const tinify = require('tinify');
const log = require('../utils/log');
const startSpinner = require('../utils/Spinner');
const {clear, checkPictureFilePaths} = require("../utils/Utils");
const {TINIFY_API_KEY, HOST, EXPRESSION, COMPRESSION_TIMES} = require("../common/EnvironmentVariable");
// 服务器路径
let uploadUrl = ''; // 文件服务器接口地址
let expression = ''; // 结果解析表达式
let tinifyApiKey = ''; //  压缩key
let compressionTimes = 1; //  压缩次数

/**
 * 压缩图片
 * @param fromUrl 本地路径
 * @param targetUrl 压缩后存放路径
 * @returns {Promise<unknown>}
 */
const handleCompress = (fromUrl, targetUrl = fromUrl) => {
    tinify.key = tinifyApiKey || process.env[TINIFY_API_KEY];
    return new Promise((resolve, reject) => {
        tinify.fromFile(fromUrl).toFile(targetUrl, (res) => {
            if (!res) {
                resolve(targetUrl);
            } else {
                reject(res);
            }
        });
    });
};

/**
 * 上传文件
 * @param localPath 本地图片地址
 * @returns {Promise<unknown>}
 */
const uploadPic = async (localPath) => {
    return new Promise((resolve, reject) => {
        const req = request.post(uploadUrl, (err, httpResponse, body) => {
            if (err) {
                reject('upload failed:');
            }
            resolve(body);
        });
        const form = req.form();
        form.append('file', fs.createReadStream(localPath));
    });
};

// 复制
const copy = (networkFilePath) => {
    clipboardy.writeSync(networkFilePath);
    log.success('', `${networkFilePath}                     √ copied`);
};

// 上传
const uploadFiles2ServerAction = async (localPicturePaths) => {
    uploadUrl = process.env[HOST];
    expression = process.env[EXPRESSION] || ''; // 获取值表达式
    tinifyApiKey = process.env[TINIFY_API_KEY] || ''; //  压缩key
    compressionTimes = parseInt(process.env[COMPRESSION_TIMES]) || 1; // 压缩次数
    if (!uploadUrl) {
        log.error('', 'please configure the file server address first, for example: cli config host http://www.uicoder.cn');
        return;
    }
    if (!await checkPictureFilePaths(localPicturePaths)) {
        return;
    }
    clear();
    const spinner = startSpinner('');
    try {
        const finalFilePaths = [];
        if (!expression) {
            clear();
            log.notice('', 'currently, there is no configuration expression, and the result returned by the server will be copied directly to the path variable');
        }
        // 循环上传
        for (const filePath of localPicturePaths) {
            const fileName = path.basename(filePath);
            let _filePath = filePath;
            if (tinifyApiKey) { // 配置了tingpng压缩key
                // 压缩图片
                spinner.setSpinnerTitle(`compressing: ${fileName} %s`);
                for (let i = 0; i < compressionTimes; i++) {
                    _filePath = await handleCompress(filePath);
                }
            }
            spinner.setSpinnerTitle(`uploading: ${fileName} %s`);
            const res = await uploadPic(_filePath);
            if (res) {
                let finalFilePath = res;
                if (expression) {
                    // 没有配置解析表达式，直接把结果当做路径
                    const resJson = JSON.parse(res);
                    finalFilePath = parserProperty(resJson, expression);
                }
                finalFilePaths.push({
                    localFilePath: filePath,
                    networkFilePath: finalFilePath
                });
            }
        }
        spinner.stop(true);
        if (finalFilePaths.length === 1) {
            // 只有一张图片，直接复制
            copy(finalFilePaths[0].networkFilePath);
            return;
        }
        if (finalFilePaths.length > 1) {
            // 存在上传失败的图片
            log.success('', '🚀  pictures upload complete');
            const split = ' => ';
            while (true) {
                // 列出图片地址选择复制
                const res = await inquirer.prompt({
                    name: 'item',
                    type: 'rawlist',
                    message: 'please select the network address of the picture you want to copy',
                    choices: finalFilePaths
                        .map(function (item) {
                            return item.localFilePath.substring(item.localFilePath.replace(/\\/g, '/').lastIndexOf('/') + 1) + split + item.networkFilePath;
                        })
                        .concat(['exit'])
                });
                clear();
                if (res.item.indexOf(split) !== -1) {
                    copy(res.item.split(split)[1]);
                } else {
                    break;
                }
            }
        }
    } catch (e) {
        spinner.stop(true);
        console.error(e);
    }
};

module.exports = {
    uploadFiles2ServerAction,
    handleCompress
};
