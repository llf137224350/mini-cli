const program = require('commander');
const open = require('open');
const createProjectAction = require('../action/CreateProjectAction');
const deleteEmptyFolderOrFilesAction = require('../action/DeleteEmptyFolderOrFilesAction');
const renameFilesAction = require('../action/RenameFilesAction');
const {uploadFiles2Server} = require('../action/UploadFiles2ServerAction');
const configAction = require('../action/ConfigAction');
const createPageAction = require('../action/CreatePageAction');
const createComponentAction = require('../action/CreateComponentAction');
const compressPictureAction = require("../action/CompressPictureAction");
/**
 * create指令
 */
const registerCommands = () => {
    /**
     * 根据模板创建新项目
     */
    program
        .command('create <project>')
        .description('create a new project from the project template')
        .action(async (project) => {
            await createProjectAction(project, program.opts().dest);
        });
    // 根据模板创建页面
    program
        .command('page <pageName>')
        .description('create a page from a template, pageName only supports lowercase letters, numbers, and underline')
        .action(async (pageName) => {
            const opts = program.opts();
            const dest = opts.dest || './';
            await createPageAction(dest, pageName);
        });
    // 根据模板创建组件
    program
        .command('component <componentName>')
        .description('create a component from a template, componentName only supports lowercase letters, numbers, and underline')
        .action(async (componentName) => {
            const opts = program.opts();
            const dest = opts.dest || './';
            await createComponentAction(dest, componentName);
        });
    /**
     * 递归删除空文件夹或者指定后缀的文件
     */
    program
        .command('rm')
        .description('recursively delete empty folders or files with specified suffixes. if the current folder is empty after deleting files, the current folder will also be deleted')
        .action(async () => {
            const opts = program.opts();
            const dest = opts.dest;
            const extensions = opts.extensions;
            const force = opts.force;
            await deleteEmptyFolderOrFilesAction(dest, extensions, force);
        });

    // 递归对指定文件夹下的文件进行重命名（去掉文件名中不需要的部分）,例如mini-core-cli.test.js重命名为mini-core-cli.js
    program
        .command('rn')
        .description('rename the file under the specified folder recursively (remove the unnecessary part of the file name), such as mini-core-cli-test.js is renamed mini-core-cli.js')
        .action(async () => {
            const opts = program.opts();
            const dest = opts.dest;
            const force = opts.force;
            const parameter = opts.parameter;
            await renameFilesAction(dest, force, parameter);
        });
    // 上传文件到文件服务器
    program
        .command('upload [filePaths...]')
        .description('upload files to file server')
        .action(async (filePaths) => {
            await uploadFiles2Server(filePaths);
        });
    // 压缩本地图片
    program
        .command('compress [localPicturePaths...]')
        .description('compress pictures')
        .action(async (localPicturePaths) => {
            const opts = program.opts();
            const dest = opts.dest;
            await compressPictureAction(localPicturePaths,dest);
        });

    program
        .command('config <option> [configKeyAndValue...]')
        .description(
            `configure environment variables, keys:
                                          host\t        configure image server address
                                          expression\t        the server returns json parsing expression
                                          author\t        author in note 
                                          tinify_api_key\thttps://tinypng.com/ api key
                                          compression_times\tcompression times, default to 1`
        )
        .action(async (option, configKeyAndValue) => {
            await configAction(option, configKeyAndValue);
        });

    // 打开json格式化工具
    program
        .command('hellojson')
        .description('open json format tool')
        .action(async () => {
            await open('http://www.uicoder.cn/hello_json/');
        });
    // 打开json格式化工具
    program
        .command('minicore')
        .description('open the mini-core help document')
        .action(async () => {
            await open('http://www.uicoder.cn/mini_core_docs/');
        });
};

module.exports = registerCommands;