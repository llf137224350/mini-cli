const { execCommandSync } = require('../utils/Terminal');
const { makeSureDirectoryExists, getAbsolutePath } = require('../utils/Utils');
/**
 *
 * @param commands
 * @param dest
 * @param force
 * @returns {Promise<void>}
 */
const execAction = async (commands, dest = './', force = false) => {
    const rootPath = getAbsolutePath(dest);
    await makeSureDirectoryExists(rootPath);
    await execCommandSync(commands, rootPath, force);
};
module.exports = execAction;
