#!/usr/bin/env node
const program = require('commander');
const helpOptions = require('./lib/core/help');
const createCommands = require('./lib/core/create');

//  从package.json中读取版本信息
program.version(require('./package.json').version);

// 设置可选项
helpOptions();

// 创建其他指令
createCommands();

// 解析参数
program.parse(process.argv);
