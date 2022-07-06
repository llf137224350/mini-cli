const program = require('commander');
/**
 * 配置可选项
 */
const helpOptions = () => {
  program.option('-d, --dest <dest>', 'destination folder,for example: -d ./');
};
module.exports = helpOptions;
