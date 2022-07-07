const program = require('commander');
/**
 * 配置可选项
 */
const helpOptions = () => {
    program.option('-d, --dest <dest>', '指定目标目录，例如: -d ./');
    program.option(
        '-e, --extensions <extensions...>',
        '搭配rm使用，指定删除的文件扩展名，: -e .js .wxss'
    );
    program.option('-f, --force', '强制执行当前操作');
};
module.exports = helpOptions;
