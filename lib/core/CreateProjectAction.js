const cliCursor = require('cli-cursor');
const path = require('path');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const downloadSync = require('../utils/download');
const log = require('../utils/log');
const startSpinner = require('../utils/spinner');
const commandSpawn = require('../utils/terminal');
const pathExists = require('path-exists');

// 判断路径是否已经存在，如果存在是否删除目录并继续
const handleConfirmPath = async (targetPath, project) => {
    if (!(await pathExists(targetPath))) {
        // 目录不存在
        return true;
    }
    const { type } = await inquirer.prompt({
        type: 'list',
        name: 'type',
        message: `"${project}" directory already exists. if you continue, it will be delete "${project}" directory`,
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
    if (type === 1) {
        fse.emptyDirSync(targetPath);
        fse.rmdirSync(targetPath);
        return true;
    }
    return false;
};
/**
 * 创建项目
 * @param project 项目名
 */
const createProjectAction = async (project, dest = './') => {
    const targetPath = path.resolve(process.env.PWD, dest, project);
    const isOk = await handleConfirmPath(targetPath, project);
    if (!isOk) {
        return;
    }
    let spinner;
    try {
        // 隐藏光标
        cliCursor.hide();
        spinner = startSpinner();
        // clone 项目
        await downloadSync('direct:https://github.com/llf137224350/hello_json.git', targetPath, {
            clone: true,
            checkout: 'main' // 分支名称 - 后端配置
        });
        spinner.stop(true);
        log.success('', 'clone complete');
        // 安装依赖
        log.notice('', 'start install dependencies');
        const commmand = process.platform === 'win32' ? 'yarn.cmd' : 'yarn';
        await commandSpawn(commmand, ['install'], { cwd: targetPath });
        // 启动项目
    } catch (e) {
        // 清除动画输出
        spinner.stop(true);
        log.error('', e.message);
    } finally {
        // 显示光标
        cliCursor.show();
    }
};
module.exports = createProjectAction;
