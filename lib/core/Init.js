const dotenv = require('dotenv');
const pathExists = require('path-exists');
const registerOptions = require('./RegisterOptions');
const registerCommands = require('./RegisterCommands');
const {getEvnPath} = require('../utils/Utils');
const log = require('../utils/Log');
const program = require("commander");
/**
 * 加载环境和版本信息
 * @returns {Promise<void>}
 */
const loadEnvAndVersion = async () => {
    //  从package.json中读取版本信息
    program.version(require('../../package.json').version);

    // 主目录下.mini_core_cli_env申明的会被挂载到 process.env上
    const envPath = getEvnPath();
    if (await pathExists(envPath)) {
        const result = dotenv.config({path: envPath});
        if (result.error) {
            log.error('', 'failed to load user settings');
        }
    }
}
/**
 * 初始化
 * @returns {Promise<void>}
 */
const init = async () => {
    // 检查是否为root权限使用
    require('root-check')();
    // 加载环境和版本信息
    await loadEnvAndVersion();
    // 设置可选项
    registerOptions();
    // 创建其他指令
    registerCommands();
    // 解析参数
    program.parse(process.argv);
};
module.exports = init;
