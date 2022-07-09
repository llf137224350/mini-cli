const path = require("path");
const pathExists = require("path-exists");
const fse = require("fs-extra");
const {execCommandSync} = require("../utils/Terminal");
/**
 *
 * @param commands
 * @param dest
 * @param force
 * @returns {Promise<void>}
 */
const execAction = async (commands, dest = './', force = false) => {
    const rootPath = path.resolve(process.env.PWD, dest);
    if (!(await pathExists(rootPath))) {
        fse.mkdirpSync(rootPath);
    }
    await execCommandSync(commands, rootPath, force);
}
module.exports = execAction;
