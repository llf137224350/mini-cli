const liveServer = require("live-server");
const {getAbsolutePath} = require("../utils/Utils");
const serverAction = (dest = './', host = process.env.IP, port = '8080', open = true, file = '') => {
    const rootPath = getAbsolutePath(dest);
    const params = {
        host, // 设置绑定的ip
        port, // 端口号，默认8080
        root: rootPath, // 监听的根路径
        open, // 是否用默认浏览器打开
        ignore: '',
        watch: dest,
        file, // 打开的文件
        wait: 300, // 改变后等待多次实践刷新浏览器
        logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
        cors: true
    };
    liveServer.start(params);
}
module.exports = serverAction;
