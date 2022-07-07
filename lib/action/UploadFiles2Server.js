const fs = require('fs');
const path = require('path');
const request = require('request');
const clipboardy = require('clipboardy');
const inquirer = require('inquirer');
const parserProperty = require('parser-property');
const log = require('../utils/log');
const { _pathExists } = require('../utils/utils');
const startSpinner = require('../utils/Spinner');
// 服务器路径
let uploadUrl = process.env.HOST;
let expression = process.env.EXPRESSION || '';
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
    console.log(process.env);
    uploadUrl = process.env.HOST;
    expression = process.env.EXPRESSION || '';
    if (!uploadUrl) {
        log.error('', 'please configure the file server address first, for example: mini config host http://www.uicoder.cn');
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
    const spinner = startSpinner('uploading...');
    try {
        const finalFilePaths = [];
        if (!expression) {
            clear();
            log.notice('', 'currently, there is no configuration expression, and the result returned by the server will be copied directly to the path variable');
        }
        // 循环上传
        for (const filePath of filePaths) {
            const res = await uploadPic(filePath);
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
            log.success('', 'upload complete');
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
