const program = require('commander');
/**
 * 配置可选项
 */
const helpOptions = () => {
    program.option('-d, --dest <dest>', 'specify the target directory. for example: -d ./');
    program.option(
        '-e, --extensions <extensions...>',
        'use with rm, specify the file extension to delete. for example: -e .js .wxss'
    );
    program.option('-f, --force', 'use with rm or rn, force current operation');
    program.option('-p, --parameter <parameter...>', 'use with rn, the first parameter is the string to be replaced, and the second is the value');
};
module.exports = helpOptions;
