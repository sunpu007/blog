# 记录一次服务器被挖矿修复

> 起因

由于开发中使用了reids，并且没有做密码验证，不幸被黑客利用植入了挖矿程序，并删除了我的操作权限。

> 现象

收到阿里云的安全告警说该ECS疑似有挖矿程序，CPU占用率达到了100%。

> 初步审查

1. 执行`top -c`查看异常进程（大部分情况是无法找到异常进程的）

   ![image-20201122144046173](https://cdn-blog.myjerry.cn/image-20201122144046173.png)

2. 查看定时任务，执行`crontab -l`，删除来历不明的定时任务（***特别注意！！！***）

3. 清除公钥文件`authorized_keys`，有可能被黑客锁定对改文件的编辑修改权限。

> 处理挖矿进程

1. 执行`perf top -s comm,pid,symbol`找到占用较高进程
2. 根据`/proc/pid`找到执行文件所在地
3. 执行`sudo kil -9 ${pid}`杀掉进程（一般会有两个进程）
4. 删除执行文件整个目录

> 删除服务器中的异常文件

通常在`/usr/tmp`和`/tmp`目录下