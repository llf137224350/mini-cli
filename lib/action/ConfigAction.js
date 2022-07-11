const fs = require('fs');
const pathExists = require('path-exists');
const log = require('../utils/Log');
const { getEvnPath, isWindows } = require('../utils/Utils');
const GET = 'get';
const DELETE = 'delete';
const SET = 'set';
const LIST = 'list';
const options = [SET, GET, DELETE, LIST];

/**
 * 读取或者写入环境变量
 * @param {string} option
 * @param {string[]} keyAndValue
 */
const configAction = async (option, keyAndValue = []) => {
    if (!options.includes(option)) {
        log.error('', `${option} operation not support, only support [ set | get | delete | list ]`);
        return;
    }
    if (option === SET && keyAndValue.length !== 2) {
        log.error('', 'configuration format error, for example: cli config set host http:www.uicoder.cn');
        return;
    } else if (option !== LIST && keyAndValue.length < 1) {
        log.error('', 'configuration format error, for example: cli config get host');
        return;
    }
    const oriKey = (keyAndValue[0] || '').trim();
    const key = oriKey.toUpperCase();
    if (option === GET) {
        console.log(process.env[key] || '');
        return;
    }
    if (option === DELETE && process.env[key] === undefined) {
        log.error('', `configuration item "${oriKey}" does not exist`);
        return;
    }
    const value = (keyAndValue[1] || '').trim();
    const content = `${key}=${value}`;
    const envPath = getEvnPath();
    let result;
    if (await pathExists(envPath)) {
        // 如果文件存在,读取文件
        result = fs.readFileSync(getEvnPath(), { encoding: 'utf-8' });
    }
    if (!result) {
        // 没有内容，直接写入文件
        fs.writeFileSync(getEvnPath(), `${content}\n`, { encoding: 'utf-8' });
    } else {
        // 获取内容判断之前是否存在
        const arr = result.split('\n').filter((item) => item !== '');
        if (option === LIST) {
            arr.forEach((item) => console.log(item));
            return;
        }
        let exists = false;
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if (item) {
                const saveKey = item.split('=')[0];
                if (saveKey === key) {
                    if (option === SET) {
                        arr[i] = content; // 重新复制
                    } else {
                        delete process.env[key];
                        arr.splice(i, 1);
                    }
                    exists = true;
                    break;
                }
            }
        }
        if (!exists) {
            arr.push(content);
        }
        let res = '';
        arr.forEach((item) => (res += item + '\n'));
        fs.writeFileSync(getEvnPath(), res, { encoding: 'utf-8' });
    }
    log.success('', option === SET ? `${isWindows() ? '' : '🔧 '}set ${content} succeed` : `${isWindows() ? '' : '🔧 '}delete ${oriKey} succeed`);
};

module.exports = configAction;
