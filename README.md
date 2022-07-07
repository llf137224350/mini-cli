# mini-cli 脚手架

# mini create
> 根据模板在指定目录下（./test）创建新项目
 ```bash
# -d 目标文件夹（只能传入一个文件夹）
mini create -d ./test
```
# mini rm
> 批量删除指定目录（./test）下的空文件夹或者指定的扩展名文件
```bash
# 删除./test目录下的空文件夹和.*js文件
# -d 目标文件夹（只能传入一个文件夹）
# -e 指定删除文件扩展名，如.js .wxss
# -f 静默强制删除，不会进行是否删除确认
mini -rm -d ./test  -e .js -f
```

# mini rn
> 批量重命名指定目录（./test）下的文件
```bash
# -d 目标文件夹（只能传入一个文件夹）
# -f 静默重命名，不会进行是否重命名确认
# -p 待替换字符串 值 1.test.js  => 1.js
mini -rm -d ./test  -p '.test' ''
```

# mini upload
> 上传图片到文件服务器，支持单张图片与多张图片，如果为单张图片，则自动复制到图片网络地址到粘贴板，
> 图片为多张时，则列出所有图片通过键盘方向键进行选择进行复制图片网络地址。
```bash
# 上传文件需要先通过mini config完成相关信息配置
# mini config expression 'data[0].fileUrl' 配置服务器返回json数据解析表达式
# mini config host www.uicoder.cn 配置文件服务器接口地址
mini upload '/Users/snail/Desktop/learning/图片素材/740c79ce-af29-41b8-b78d-5f49c96e38c4.jpg' '/Users/snail/Desktop/learning/图片素材/00874a5e-0df2-446b-8f69-a30eb7d88ee8.png'
```
