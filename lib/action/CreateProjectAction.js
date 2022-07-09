const cliCursor = require('cli-cursor');
const path = require('path');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const pathExists = require('path-exists');
const downloadSync = require('../utils/Download');
const log = require('../utils/Log');
const startSpinner = require('../utils/Spinner');
const commandSpawn = require('../utils/Terminal');
const {getTemplates} = require('../utils/Http');
/**
 * 创建项目
 */

// 判断路径是否已经存在，如果存在是否删除目录并继续
const handleConfirmPath = async (targetPath, project) => {
    if (!(await pathExists(targetPath))) {
        // 目录不存在
        return true;
    }
    const {type} = await inquirer.prompt({
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
        const spinner = startSpinner('clearing directory');
        fse.emptyDirSync(targetPath);
        fse.rmdirSync(targetPath);
        spinner.stop(true);
        return true;
    }
    return false;
};
/**
 * 获取模板
 * @param {string[]} templates
 */
const getTemplate = async (templates) => {
    if (templates.length === 1) {
        return templates[0];
    }
    templates.sort((item1, item2) => {
        return item2.sort - item1.sort;
    });
    const choices = templates.map((item, index) => {
        return {
            name: item.name,
            value: index
        };
    });
    const {type} = await inquirer.prompt({
        type: 'list',
        name: 'type',
        message: `please select a project template`,
        default: 0,
        choices
    });
    return templates[type];
};
/**
 * 创建项目
 * @param project 项目名
 * @param dest
 */
const createProjectAction = async (project, dest = './') => {
    let spinner;
    try {
        cliCursor.hide();
        const targetPath = path.resolve(process.env.PWD, dest, project);
        const isOk = await handleConfirmPath(targetPath, project);
        if (!isOk) {
            return;
        }
        spinner = startSpinner('');
        spinner.setSpinnerTitle('getting template... %s');
        const templates = await getTemplates();
        if (!templates || templates.length === 0) {
            log.error('', 'failed to get template information or the template does not exist');
            return;
        }
        spinner.stop(true);
        const templateInfo = await getTemplate(templates);
        spinner.start();
        // 隐藏光标
        spinner.setSpinnerTitle('download project template... %s');
        // clone 项目
        await downloadSync(`direct:${templateInfo.gitUrl}`, targetPath, {
            clone: true,
            checkout: templateInfo.branchName // 分支名称 - 后端配置
        });
        spinner.stop(true);
        log.success('', '🎉 clone complete');
        if (templateInfo.command) {
            const commands = templateInfo.command.split(',');
            process.env.HOST = '';
            for (const command of commands) {
                log.notice('', `start execute custom commands: ${command}`);
                const cmd = command.split(/\s+/g);
                if (cmd.length >= 1) {
                    const command = process.platform === 'win32' ? `${cmd[0]}.cmd` : cmd[0];
                    cmd.splice(0, 1);
                    await commandSpawn(command, cmd, {cwd: targetPath});
                }
            }
        }
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
