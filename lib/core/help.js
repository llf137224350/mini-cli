const program = require('commander');
/**
 * 配置可选项
 */
const helpOptions = () => {
    // 目标目录
    program.option('-d, --dest <dest>', 'specify the target directory. for example: -d ./');
    // 文件扩展名
    program.option('-e, --extensions <extensions...>', 'use with rm, specify the file extension to delete. for example: -e .js .wxss');
    // 是否强制执行
    program.option('-f, --force', 'use with rm or rn, force current operation');
    // 重命名时指定待替换字符串和值
    program.option('-p, --parameter <parameter...>', 'use with rn, the first parameter is the string to be replaced, and the second is the value. for example: -p a b');
};
module.exports = helpOptions;
