const program = require('commander');
/**
 * 配置可选项
 */
const registerOptions = () => {
    // 目标目录
    program.option('-d, --dest <dest>', 'specify the target directory. for example: -d ./');
    // 文件扩展名
    program.option('-e, --extensions <extensions...>', 'use with rm, specify the file extension to delete. for example: -e .js .wxss');
    // 是否强制执行
    program.option('-f, --force', 'use with rm or rn, force current operation');
    // 重命名时指定待替换字符串和值
    program.option('-p, --parameter <parameter...>', 'use with rn, the first parameter is the string to be replaced, and the second is the value. for example: -p a b');
    // 主机
    program.option('-H, --host <host>', 'select host address to bind to, default: ip env var or 0.0.0.0 ("any address")');
    // 端口
    program.option('-P, --port <port>', 'select port to use, default: port env var or 8080');
    // 是否自动打开
    program.option('-O --open', 'when false, it won\'t load your browser by default.');
    // 打开的文件
    program.option('-F, --file <file>', 'the file accessed when automatically opening the browser is "index html"');
    // 监听
    program.option('-w --watch','watch file');
};
module.exports = registerOptions;
