# Centos安装Redis

> 下载源码

下载地址：[http://redis.io/download](http://redis.io/download)，下载最新稳定版

![image-20201124203017327](http://oss-blog.myjerry.cn/image-20201124203017327.png)

```sh
$ wget https://download.redis.io/releases/redis-6.0.9.tar.gz
$ tar xzf redis-6.0.9.tar.gz
$ cd redis-6.0.9
```

> 编译安装

```sh
$ make
$ make install
```

> 修改配置文件`redis.conf`

修改远程访问、后台启动和密码

- 隐藏`bind 127.0.0.1`或修改为`bind 0.0.0.0`
- 修改`daemonize no`为`yes`
- 修改`requirepass <你的密码>`

> 启动

```
$ ./src/redis-server ./redis.conf
```

> 使用systemd管理服务

在`/etc/systemd/system`目录下新建`redis.service`文件，写入以下内容

```sh
[Unit]
Description=redis-server
After=network.target

[Service]
Type=forking
ExecStart=${安装目录}/src/redis-server ${安装目录}/redis.conf
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

刷新`systemctl`查看Redis状态

```sh
$ sudo systemctl daemon-reload
$ sudo systemctl status redis
```

![image-20201124204509672](http://oss-blog.myjerry.cn/image-20201124204509672.png)

设置开机启动

```sh
$ sudo systemctl enable redis.service
```



<Vssue :title="$title" />

