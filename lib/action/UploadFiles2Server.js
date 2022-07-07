const fs = require('fs');
const path = require('path');
const request = require('request');
const clipboardy = require('clipboardy');
const inquirer = require('inquirer');
const parserProperty = require('parser-property');
const tinify = require('tinify');
const log = require('../utils/log');
const { _pathExists } = require('../utils/utils');
const startSpinner = require('../utils/Spinner');
// 服务器路径
let uploadUrl = ''; // 文件服务器接口地址
let expression = ''; // 结果解析表达式
let tinifyApiKey = ''; //  压缩key
let compressionTimes = 1; //  压缩次数

/**
 * 上传文件
 * @returns {Promise<unknown>}
 */
const uploadForCompress = (fromUrl, targetUrl = fromUrl) => {
    tinify.key = tinifyApiKey;
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

// 上传文件
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

// 清空控制台
const clear = () => {
    process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
};

// 上传
const uploadFiles2Server = async (filePaths) => {
    uploadUrl = process.env.HOST;
    expression = process.env.EXPRESSION || ''; // 获取值表达式
    tinifyApiKey = process.env.TINIFY_API_KEY || ''; //  压缩key
    compressionTimes = parseInt(process.env.COMPRESSION_TIMES) || 1; // 压缩次数
    if (!uploadUrl) {
        log.error('', 'please configure the file server address first, for example: cli config host http://www.uicoder.cn');
        return;
    }
    // 检查参数
    if (!filePaths.length) {
        log.error('', 'please enter the absolute path to upload the picture. multiple paths are separated by split');
        return;
    }

    for (const filePath of filePaths) {
        if (!_pathExists(filePath)) {
            // 路径不存在
            return;
        }
        // 判断是不是图片
        const extname = path.extname(filePath);
        if (!/\.(jpe?g|png|gif)/g.test(extname)) {
            log.error('', 'only JPG, JPEG, PNG and GIF pictures can be upload');
            return;
        }
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
        for (const filePath of filePaths) {
            let _filePath = filePath;
            if (tinifyApiKey) { // 配置了tingpng压缩key
                // 压缩图片
                spinner.setSpinnerTitle('compressing pictures... %s');
                for (let i = 0; i < compressionTimes; i++) {
                    _filePath = await uploadForCompress(filePath);
                }
            }
            spinner.setSpinnerTitle('uploading pictures... %s');
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
            log.success('', 'pictures upload complete');
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

module.exports = uploadFiles2Server;
