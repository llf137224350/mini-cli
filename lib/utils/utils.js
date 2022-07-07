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
    return `${userhome()}/.env`;
};
module.exports = {
    confirm,
    _pathExists,
    getEvnPath
};
