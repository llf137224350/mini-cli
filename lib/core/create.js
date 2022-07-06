const program = require('commander');
const { createProjectAction } = require('./actions');
/**
 * create指令
 */
const createCommands = () => {
  program
    .command('create <projectName>')
    .description('create a project from a template in the current folder')
    .action((projectName) => {
      createProjectAction(projectName, program.opts().dest);
    });
};

module.exports = createCommands;
