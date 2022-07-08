const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const inquirer = require('inquirer');
const pathExists = require('path-exists');
const { dateFormat } = require('../utils/Utils');
const { renderFile, nameFormat } = require('../utils/Ejs');
const log = require('../utils/Log');
const chooseTemplate = async () => {
    const { type } = await inquirer.prompt({
        type: 'list',
        name: 'type',
        message: 'please select a component template',
        default: '../template/miniprogram/mini-core/component',
        choices: [
            {
                name: '[wechat miniprogram] mini-core component template',
                value: '../template/miniprogram/mini-core/component'
            },
            {
                name: '[wechat miniprogram] original component template',
                value: '../template/miniprogram/original/component'
            },
            {
                name: '[vue.js 2.x] component template',
                value: '../template/vuejs/2.0'
            },
            {
                name: '[vue.js 3.x] component template',
                value: '../template/vuejs/3.0'
            }
        ]
    });
    return type;
};
/**
 * 创建页面模板
 * @param {*} dest
 * @param {*} componentName
 * @returns
 */
const createComponentAction = async (dest, componentName) => {
    if (!/^[a-z0-9_]*$/g.test(componentName)) {
        log.error('', `componentName only supports lowercase letters, numbers, and underline`);
        return;
    }
    const names = nameFormat(componentName);
    // 样式名称
    const className = names.length > 1 ? names.join('-').toLowerCase() : names[0].toLowerCase();
    // controller 类名
    const controllerName = names.length > 1 ? names.join('') : names[0];
    // 文件名
    const fileName = names.length > 1 ? names.join('_').toLowerCase() : names[0].toLowerCase();
    const rootPath = path.resolve(process.env.PWD, dest, fileName);
    const templateDir = await chooseTemplate();
    if (!(await pathExists(rootPath))) {
        fse.mkdirpSync(rootPath);
    }
    const data = {
        className,
        author: process.env.AUTHOR || '',
        controllerName,
        fileName,
        createDate: dateFormat(new Date())
    };
    // 读取目录
    const files = fs.readdirSync(path.resolve(__dirname, templateDir));
    let filename;
    let finalPath;
    let result;
    for (const file of files) {
        filename = file.replace('.ejs', '');
        // vuejs 目录使用下横线，组件使用大驼峰
        finalPath = path.join(rootPath, (templateDir.indexOf('vuejs') !== -1 ? controllerName : fileName) + path.extname(filename));
        if (await pathExists(finalPath)) {
            log.error('', 'the target file already exists, and the current operation is interrupted');
            return;
        }
        result = await renderFile(path.resolve(__dirname, templateDir, file), { data });
        fs.writeFileSync(finalPath, result);
    }
    log.success('', 'component generation succeed');
};
module.exports = createComponentAction;
