const fs = require('fs');
const dotenv = require('dotenv');
const pathExists = require('path-exists');
const { getEvnPath } = require('../utils/Utils');
const log = require('../utils/Log');
const init = async () => {
    const envPath = getEvnPath();
    if (!await pathExists(envPath)) {
        fs.writeFileSync(envPath, '');
    }
    const result = dotenv.config({ path: envPath });
    if(result.error) {
       log.error('', 'failed to load user settings');
    }
};
module.exports = init;
