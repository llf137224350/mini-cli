#!/usr/bin/env node
const importLocal = require('import-local');
const log = require('./lib/utils/Log');
if (importLocal(__filename)) {
    // 使用本地的版本
    log.info('', '正在使用 mini-core-cli 本地版本');
} else {
    // 加载lib下index并传入cli后的参数
    require('./lib/core/Init')(process.argv.slice(2));
}
