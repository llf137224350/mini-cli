const fs = require('fs');
const {pathExists} = require("fs-extra");
const path = require("path");
const log = require("../utils/Log");
const {prompt} = require("../utils/Utils");
const clipboardy = require("clipboardy");
const base64EncodeAction = async (localPicturePath) => {
    if (!localPicturePath) {
        log.error('', 'please enter the picture path');
        return;
    }
    if (!/\.(jpe?g|png|gif)$/g.test(localPicturePath)) {
        log.error('', 'only supported jpg, jpeg, png and gif picture');
        return;
    }
    const filePath = path.resolve(process.env.PWD, localPicturePath);
    if (!(await pathExists(filePath))) {
        log.error('', 'the picture file does not exist, please check');
        return;
    }
    const pictureData = fs.readFileSync(filePath, 'binary');
    const base64 = Buffer.from(pictureData, 'binary').toString('base64');
    const extname = path.extname(filePath).substring(1);
    const base64Header = `data:image/${extname};base64,`;
    const base64Result = base64Header + base64;
    log.success('', '🚀  processed successfully');
    const index = await prompt('please select the operation type', ['copy', 'print']);
    if (index === 0) {
        clipboardy.writeSync(base64Result);
        log.success('', `🚀  success copy`);
    } else {
        console.log(base64Result)
    }
}
module.exports = base64EncodeAction;
