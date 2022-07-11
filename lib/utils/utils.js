const path = require('path');
const inquirer = require('inquirer');
const pathExists = require('path-exists');
const userHome = require('userhome');
const log = require('./Log');
const fs = require('fs');
const fse = require('fs-extra');

/**
 * 询问确认
 * @param {string} message
 * @returns
 */
const confirm = async (message) => {
    const { type } = await inquirer.prompt({
        type: 'list',
        name: 'type',
        message: message,
        default: 0,
        choices: [
            {
                name: 'yes',
                value: 1
            },
            {
                name: 'no',
                value: 0
            }
        ]
    });
    return type === 1;
};
/**
 * 列表选择提示
 * @param title 提现标题
 * @param options 选项
 * @returns {Promise<*>}
 */
const prompt = async (title, options) => {
    const { type } = await inquirer.prompt({
        type: 'list',
        name: 'type',
        message: title,
        default: 0,
        choices: options.map((name, value) => {
            return {
                name,
                value
            };
        })
    });
    return type;
};

/**
 * 目录检查
 * @returns
 * @param path
 */
const _pathExists = async (path) => {
    if (!(await pathExists(path))) {
        log.error('', `"${path}" file or directory does not exist, please check`);
        return false;
    }
    return true;
};
/**
 * 获取配置文件位置
 * @returns {`${string}/.mini_core_cli_env`}
 */
const getEvnPath = () => {
    return `${userHome()}/.mini_core_cli_env`;
};
/**
 * 日期格式化
 * @param date
 * @param fmt
 * @returns {string}
 */
const dateFormat = (date, fmt = 'yyyy-MM-dd hh:mm:ss') => {
    const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substring(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substring(('' + o[k]).length));
        }
    }
    return fmt;
};
/**
 * 清空控制台
 */
const clear = () => {
    process.stdout.write(isWindows() ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
};
/**
 * 检查是否为允许的图片类型
 * @param filePath 文件路径
 * @returns {boolean}
 */
const checkImage = (filePath) => {
    const extname = path.extname(filePath);
    if (!/\.(jpe?g|png|gif)/g.test(extname)) {
        log.error('', `${isWindows() ? '' : '🚀  '}only jpg, jpeg, png and gif pictures can be upload`);
        return false;
    }
    return true;
};
/**
 * 检查图片文件路径及是否为图片格式
 * @param filePaths
 */
const checkPictureFilePaths = async (filePaths) => {
    // 检查参数
    if (!filePaths.length) {
        log.error('', 'please enter the absolute path of the picture, multiple picture paths are separated by spaces');
        return false;
    }

    for (const filePath of filePaths) {
        // 判断是不是图片
        if (!checkImage(filePath)) {
            return false;
        }
        if (!(await _pathExists(filePath))) {
            // 路径不存在
            return false;
        }
    }
    return true;
};
/**
 * 递归获取指定后缀的文件列表
 * @param currentPath
 * @param filePaths
 * @param extName
 */
const getFilePaths = (currentPath, filePaths, extName) => {
    const files = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const file of files) {
        if (file.isFile()) {
            if (path.extname(file.name) === extName) {
                filePaths.push(path.resolve(currentPath, './', file.name));
            }
        } else if (file.isDirectory()) {
            // 递归 - 尾调用
            getFilePaths(path.resolve(currentPath, './', file.name), filePaths, extName);
        }
    }
};

const sleep = async (duration = 1000) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
};
/**
 * 确保目录存在，如果不存在则创建
 * @param path
 * @returns {Promise<void>}
 */
const makeSureDirectoryExists = async (path) => {
    if (!(await pathExists(path))) {
        fse.mkdirpSync(path);
    }
};
/**
 * 是否为windows系统
 * @returns {boolean}
 */
const isWindows = () => {
    return process.platform === 'win32';
};
/**
 * 获取执行
 * @returns {string}
 */
const getCurrentPath = () => {
    // power shell 、命令提示符 、mac
    return isWindows() ? process.env.INIT_CWD || process.mainModule.path : process.env.PWD;
};
/**
 * 获取绝对路径
 * @param inputPath
 * @returns {string}
 */
const getAbsolutePath = (inputPath) => {
    return path.resolve(getCurrentPath(), inputPath);
};
module.exports = {
    confirm,
    _pathExists,
    getEvnPath,
    dateFormat,
    clear,
    checkImage,
    prompt,
    checkPictureFilePaths,
    getFilePaths,
    sleep,
    makeSureDirectoryExists,
    getAbsolutePath,
    isWindows,
    getCurrentPath
};
