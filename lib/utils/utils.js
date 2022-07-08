const inquirer = require('inquirer');
const pathExists = require('path-exists');
const userhome = require('userhome');
const log = require('./Log');
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
 * 目录检查
 * @param {string} rootPath
 * @returns
 */
const _pathExists = async (path) => {
    if (!(await pathExists(path))) {
        log.error('', `"${path}" directory does not exist, please check!`);
        return false;
    }
    return true;
};

const getEvnPath = () => {
    return `${userhome()}/.mini_core_cli_env`;
};

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
module.exports = {
    confirm,
    _pathExists,
    getEvnPath,
    dateFormat
};
