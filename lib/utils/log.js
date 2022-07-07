'use strict';

const log = require('npmlog');

log.level = process.env.LOG_LEVEL || 'info'; // 日志级别 默认为info 2000
log.heading = 'mini-core-cli:'; // 修改前缀
log.headingStyle = { fg: 'green' }; // 前缀样式
// 添加自定义log命令
log.addLevel('success', 2000, { fg: 'green', bold: true });
log.addLevel('silly', -Infinity, { inverse: true }, 'sill');
log.addLevel('verbose', 1000, { fg: 'blue' }, 'verb');
log.addLevel('info', 2000, { fg: 'green' });
log.addLevel('timing', 2500, { fg: 'green' });
log.addLevel('http', 3000, { fg: 'green' });
log.addLevel('notice', 3500, { fg: 'blue' });
log.addLevel('warn', 4000, { fg: 'yellow' }, 'WARN');
log.addLevel('error', 5000, { fg: 'red' }, 'ERR!');
log.addLevel('silent', Infinity);
module.exports = log;
