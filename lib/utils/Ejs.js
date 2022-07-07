const ejs = require('ejs');
/**
 *  渲染
 * @param {*} filename
 * @param {*} data
 * @returns
 */
const renderFile = (filename, data) => {
    return new Promise((resolve, reject) => {
        ejs.renderFile(filename, data, {}, function (err, str) {
            if (err) {
                reject(err);
            } else {
                resolve(str);
            }
        });
    });
};

const nameFormat = (name) => {
    let names = name.split('_');
    names = names.map((item) => {
        return item.substring(0, 1).toUpperCase() + item.substring(1);
    });
    return names;
};
module.exports = {
    renderFile,
    nameFormat
};
