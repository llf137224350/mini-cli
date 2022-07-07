const program = require('commander');
const createProjectAction = require('./CreateProjectAction');
const deleteEmptyFolderOrFiles = require('./DeleteEmptyFolderOrFilesAction');
/**
 * create指令
 */
const createCommands = () => {
    /**
     * 根据模板创建新项目
     */
    program
        .command('create <project>')
        .description('根据项目模板创建新项目')
        .action((project) => {
            createProjectAction(project, program.opts().dest);
        });
    /**
     * 删除空文件夹或者指定后缀的文件
     */
    program
        .command('rm')
        .description(
            '删除空文件夹或者指定后缀的文件，如果删除文件后，当前文件夹为空，则也会删除当前文件夹。'
        )
        .action(() => {
            console.log(program.opts());
            const opts = program.opts();
            const dest = opts.dest;
            const extensions = opts.extensions;
            const force = opts.force;
            deleteEmptyFolderOrFiles(dest, extensions, force);
        });
};

module.exports = createCommands;
