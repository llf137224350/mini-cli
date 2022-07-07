const fs = require('fs');
const pathExists = require('path-exists');
const log = require('../utils/Log');
const { getEvnPath } = require('../utils/Utils');
/**
 * 读取或者写入环境变量
 * @param {string[]} keyAndValue
 */
const configAction = async (keyAndValue = []) => {
    if (keyAndValue.length !== 2) {
        log.error('', 'configuration format error, for example: cli config host http:www.uicoder.cn');
    }
    const key = keyAndValue[0].trim().toUpperCase();
    const value = keyAndValue[1].trim();
    const content = `${key}=${value}`;
    const envPath = getEvnPath();
    let result;
    if (await pathExists(envPath)) { // 如果文件存在,读取文件
        result = fs.readFileSync(getEvnPath(), { encoding: 'utf-8' });
    }
    if (!result) { // 没有内容，直接写入文件
        fs.writeFileSync(getEvnPath(), `${content}\n`, { encoding: 'utf-8' });
    } else {
        // 获取内容判断之前是否存在
        const arr = result.split('\n').filter((item) => item !== '');
        let exists = false;
        for (let i = 0; i < arr.length; i++) {
            const item = arr[i];
            if (item) {
                const saveKey = item.split('=')[0];
                if (saveKey === key) {
                    arr[i] = content; // 重新复制
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
    log.success('', `set ${content} succeed`);
};

module.exports = configAction;
