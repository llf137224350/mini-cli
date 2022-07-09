const {spawn} = require('child_process');
const log = require("./Log");
const {prompt} = require("./Utils");
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

const execCommandSync = async (commands, targetPath = './', force = false) => {
    let isOk = force
    if (!force) {
        const res = await prompt('there is a risk in executing the order. please confirm whether to continue. we will not bear any responsibility for all the consequences of executing the order. do you accept it?', ['accept', 'reject']);
        isOk = res === 0;
    }
    if (!isOk) {
        return;
    }
    for (const command of commands) {
        log.notice('', ` 💀 start execute custom commands: "${command}"`);
        const cmd = command.split(/\s+/g);
        if (cmd.length >= 1) {
            const _command = process.platform === 'win32' ? `${cmd[0].trim()}.cmd` : cmd[0].trim();
            cmd.splice(0, 1);
            await commandSpawn(_command, cmd, {cwd: targetPath});
            log.success('', `🎉 "${command}" command execution succeeded`);
        }
    }
}

module.exports = {
    commandSpawn,
    execCommandSync
};
