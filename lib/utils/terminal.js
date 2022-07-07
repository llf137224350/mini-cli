const { spawn } = require('child_process');
/**
 * 执行终端命令
 * @param args
 */
const commandSpawn = (...args) => {
    return new Promise((resolve) => {
        const childProcess = spawn(...args);
        // 将子线程输出信息同步到主进程
        childProcess.stdout.pipe(process.stdout);
        childProcess.stderr.pipe(process.stderr);
        childProcess.on('close', () => {
            resolve();
        });
    });
};

module.exports = commandSpawn;
