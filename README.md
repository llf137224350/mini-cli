# mini-core-cli 脚手架

## cli create \<project>

> 根据模板在指定目录下（./test）创建新项目

```bash
# -d 可以传入绝对路径或者相对于终端所在当前目录的相对路径，只能传入一个路径
cli create hello-world -d ./test
```

## cli page \<pageName> [description]

> 根据选择模板创建微信小程序页面骨架，支持 mini-core 模板和原生小程序模板

```bash
# -d 可以传入绝对路径或者相对于终端所在当前目录的相对路径，只能传入一个路径
cli page hello_world 测试页面生成  -d ./
```

### 自定义页面模板

> 可以通过```cli config set custom_page_template_dir 模板所在文件夹```
>
指定页面模板所在目录，建议配置为绝对路径。文件名命名格式建议参照index.js.ejs，其中index任意，js为最终生成的文件名类型，ejs可选，为了在编辑模板时可以使用ejs支持的表达式，建议使用ejs格式文件，在创建模板时会传入如下数据，可按需对应取值。

```ejs
<!--输入 cli page hello_world 测试 -d ./test-->
<!--结果：hello-world-->
<%= data.className %>
<!--结果：cli config set author 值，如：い 狂奔的蜗牛-->
<%= data.author %>
<!--结果：HelloWorld-->
<%= data.controllerName %>
<!--结果：hello_world-->
<%= data.fileName %>
<!--结果：当前日期，如：2022-07-09 22:48:15-->
<%= data.createDate %>
<!--结果：测试-->
<%= data.description %>
```

## cli component \<componentName>  [description]

> 根据选择模板创建组件骨架，支持以下模板：
> 1. mini-core 模板(微信小程序)
> 2. 原生小程序页模板(微信小程序)
> 3. vue.js 2.x模板
> 4. vue.js 3.x模板

```bash
# -d 可以传入绝对路径或者相对于终端所在当前目录的相对路径，只能传入一个路径
cli component hello_world 测试组件生成 -d ./
```

### 自定义组件模板

> 可以通过```cli config set custom_component_template_dir 模板所在文件夹```指定组件模板所在目录，其他同创建页面自定义模板

## cli rm

> 批量删除指定目录（./test）下的空文件夹或者指定的扩展名文件

```bash
# 删除./test目录下的空文件夹和.*js文件
# -D 可以传入绝对路径或者相对于终端所在当前目录的相对路径，可以传入多个路径
# -e 指定删除文件扩展名，如.js .wxss
# -f 静默强制删除，不会进行是否删除确认
cli rm -D ./test  -e .js -f
```

## cli rn

> 批量重命名指定目录（./test）下的文件

```bash
# -d 可以传入绝对路径或者相对于终端所在当前目录的相对路径，只能传入一个路径
# -f 静默重命名，不会进行是否重命名确认
# -p 待替换字符串 值 1.test.js  => 1.js
cli rn -d ./test  -p '.test' ''
```

## cli upload [localPicturePaths...]

> 上传图片到文件服务器，支持单张图片与多张图片，如果为单张图片，则自动复制到图片网络地址到粘贴板，
> 图片为多张时，则列出所有图片通过键盘方向键进行选择进行复制图片网络地址。

```bash
# 上传文件需要先通过cli config完成相关信息配置
# cli config expression 'data[0].fileUrl' 配置服务器返回json数据解析表达式
# cli config host www.uicoder.cn 配置文件服务器接口地址
cli upload '/Users/snail/Desktop/learning/图片素材/740c79ce-af29-41b8-b78d-5f49c96e38c4.jpg' '/Users/snail/Desktop/learning/图片素材/00874a5e-0df2-446b-8f69-a30eb7d88ee8.png'
```

## cli compress  [localPicturePaths...]

> 对本地图片进行压缩，支持单张图片与多张图片

```bash
# -d 指定压缩后的图片存放的目录，不指定时会压缩并覆盖当前图片
cli compress '/Users/snail/Desktop/learning/图片素材/740c79ce-af29-41b8-b78d-5f49c96e38c4.jpg' '/Users/snail/Desktop/learning/图片素材/00874a5e-0df2-446b-8f69-a30eb7d88ee8.png'
```

## cli base64 \<localPicturePath>

> 对本地图片进行base64编码，编码成功后可选择将结果复制到粘贴板或者控制台打印，base64操作只支持单张图片

```bash
cli base64 '/Users/snail/Desktop/learning/图片素材/740c79ce-af29-41b8-b78d-5f49c96e38c4.jpg'
```

## cli server

> 开启一个静态资源服务器，支持文件更改时自动刷新，想了解更多请查看[live-server](https://www.npmjs.com/package/live-server)包

```bash
# -H 绑定域名localhost或者127.0.0.1或者本机ip，默认为：127.0.0.1
# -P 绑定端口号，默认为：8080
# -F 指定浏览器默认访问的文件路径，默认为：index.html
# -O 启动完成后是否打开默认浏览器，默认为：false
# -d 静态资源根目录，默认为：./
cli server -d ./test
```

## cli lessc

> 编译less为css、wxss

```bash
# -e 指定less编译生成的目标文件后缀，可以传入多个，如：css wxss，不传入时默认css
# -w 是否监听-d指定目录下的所有less变化，默认为false。会编译目录下的所有less文件，如果设置为true，只会监听文件 ，如果文件没有做修改，不会进行编译
# -d 静态资源根目录，默认为：./
cli lessc
cli lessc -d ./ -w -e wxss
```

## cli exec  [commands...]

> 同步执行多条命令，如果命令执行后有后续操作，如选择或者输入，则不适合通过当前方式执行

```bash
# -d 执行命令时所在目录，默认为：./
# -f 静默，不会提示确认
cli exec 'npm install' 'npm run server' -d ./ -f  
```

## cli config \<option> [configKeyAndValue...]

> 设置配置项
>
> 1. host 文件服务器接口地址
> 2. expression 图片上传到服务器返回 json 获取图片网络地址解析表达式，如：data[0].fileUrl
> 3. author 模板注释中的作者
> 4. tinify_api_key，如果配置了当前值，则自动激活图片压缩功能，不配置时不会激活压缩功能，压缩技术由[tinypng](https://tinypng.com/)提供
> 5. compression_times 图片压缩次数，默认为1

```bash
# 设置文件服务器接口地址
cli config set host http://www.uicoder.cn
# 查看配置信息
cli config get host
# 删除配置信息
cli config delete host
# 查看所有配置信息
cli config list
```

## cli hellojson

> 打开json格式化工具 - HelloJSON

```bash
cli hellojson
```

## cli minicore

> 打开微信小程序框架mini-core帮助文档

```bash
cli minicore
```
