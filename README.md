# mini-cli 脚手架

# mini create
> 根据模板在指定目录下（./test）创建新项目
 ```bash
# -d 目标文件夹（只能传入一个文件夹）
mini create -d ./test
```
# mini rm
> 删除指定目录（./test）下的空文件夹或者指定的扩展名文件
```bash
# 删除./test目录下的空文件夹和.*js文件
# -d 目标文件夹（只能传入一个文件夹）
# -e 指定删除文件扩展名，如.js .wxss
# -f 静默强制删除，不会进行是否删除确认
mini -rm -d ./test  -e .js -f
```

# mini rn
> 重命名指定目录（./test）下的文件
```bash
# -d 目标文件夹（只能传入一个文件夹）
# -f 静默重命名，不会进行是否重命名确认
# -p 待替换字符串 值 1.test.js  => 1.js
mini -rm -d ./test  -p '.test' ''
```
