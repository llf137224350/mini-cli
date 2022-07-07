#!/usr/bin/env node
const program = require('commander');
const init = require('./lib/core/Init');
const helpOptions = require('./lib/core/Help');
const createCommands = require('./lib/core/Create');

//  从package.json中读取版本信息
program.version(require('./package.json').version);

// 环境初始化
init().then(() => {
    // 设置可选项
    helpOptions();

    // 创建其他指令
    createCommands();

    // 解析参数
    program.parse(process.argv);
});
