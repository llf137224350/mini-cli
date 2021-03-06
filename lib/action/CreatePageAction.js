const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
const pathExists = require('path-exists');
const { dateFormat, makeSureDirectoryExists, getAbsolutePath, getCurrentPath, isWindows } = require('../utils/Utils');
const { renderFile, nameFormat } = require('../utils/Ejs');
const log = require('../utils/log');
const { AUTHOR, CUSTOM_PAGE_TEMPLATE_DIR } = require('../common/EnvironmentVariable');
const chooseTemplate = async () => {
    const choices = [
        {
            name: '[wechat miniprogram] mini-core page template',
            value: '../template/miniprogram/mini-core/page'
        },
        {
            name: '[wechat miniprogram] original page template',
            value: '../template/miniprogram/original/page'
        }
    ];
    if (process.env[CUSTOM_PAGE_TEMPLATE_DIR]) {
        const customPagePath = getAbsolutePath(process.env[CUSTOM_PAGE_TEMPLATE_DIR]);
        // 确保目录存在企且
        if (await pathExists(customPagePath)) {
            choices.push({
                name: '[myself] page template',
                value: customPagePath
            });
        }
    }
    const { type } = await inquirer.prompt({
        type: 'list',
        name: 'type',
        message: 'please select a page template',
        default: '../template/miniprogram/mini-core/page',
        choices
    });
    return type;
};
/**
 * 创建页面模板
 * @param {*} dest
 * @param {*} pageName
 * @param description
 * @returns
 */
const createPageAction = async (dest, pageName, description = '') => {
    if (!/^[a-z0-9_]*$/g.test(pageName)) {
        log.error('', `pageName only supports lowercase letters, numbers, and underline`);
        return;
    }
    const names = nameFormat(pageName);
    // 样式名称
    const className = names.length > 1 ? names.join('-').toLowerCase() : names[0].toLowerCase();
    // controller 类名
    const controllerName = names.length > 1 ? names.join('') : names[0];
    // 文件名
    const fileName = names.length > 1 ? names.join('_').toLowerCase() : names[0].toLowerCase();
    const rootPath = path.resolve(getCurrentPath(), dest, fileName);
    const templateDir = await chooseTemplate();
    await makeSureDirectoryExists(rootPath);
    const data = {
        className,
        author: process.env[AUTHOR] || '',
        controllerName,
        fileName,
        createDate: dateFormat(new Date()),
        description
    };
    // 读取目录
    const files = fs.readdirSync(path.isAbsolute(templateDir) ? templateDir : path.resolve(__dirname, templateDir));
    let filename;
    let finalPath;
    let result;
    for (const file of files) {
        filename = file.replace('.ejs', '');
        finalPath = path.join(rootPath, fileName + path.extname(filename));
        if (await pathExists(finalPath)) {
            log.error('', 'the target file already exists, and the current operation is interrupted');
            return;
        }
        result = await renderFile(path.resolve(__dirname, templateDir, file), { data });
        fs.writeFileSync(finalPath, result);
    }
    log.success('', `${isWindows() ? '' : '🎉 '}page generation succeed`);
};
module.exports = createPageAction;
