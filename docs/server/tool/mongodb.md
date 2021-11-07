# Centos安装MongoDB

### 安装平台依赖包

```sh
sudo yum install libcurl openssl
```

### 安装MongoDB

下载`MongoDB`源码，下载地址：[https://www.mongodb.com/download-center#community](https://www.mongodb.com/download-center#community)

![image-20201124120633052](https://oss-blog.myjerry.cn/files/image-20201124120633052.png)

下载tgz安装包，并解压tgz。

```sh
$ wget https://fastdl.mongodb.org/linux/mongodb-shell-linux-x86_64-rhel70-4.4.2.tgz
$ tar -zxvf mongodb-shell-linux-x86_64-rhel70-4.4.2.tgz
# 重命名文件夹
$ mv mongodb-shell-linux-x86_64-rhel70-4.4.2 mongodb4
```

添加环境变量

```sh
# ${mongodb-install-directory} 为MongoDB的安装目录
$ export PATH=${mongodb-install-directory}/bin:$PATH
```

### 创建数据库目录

默认情况下 MongoDB 启动后会初始化以下两个目录

- 数据存储目录：/var/lib/mongodb
- 日志文件目录：/var/log/mongodb

我们在启动前可以先创建这两个目录并设置当前用户有读写权限

```sh
$ sudo mkdir -p /var/lib/mongo
$ sudo mkdir -p /var/log/mongodb
$ sudo chown `whoami` /var/lib/mongo     # 设置权限
$ sudo chown `whoami` /var/log/mongodb   # 设置权限
```

### 编写启动配置文件

创建`mongodb.conf`文件写入一下内容

```sh
# 数据存储目录
dbpath=/var/lib/mongo
# 日志文件目录
logpath=/var/log/mongodb/mongod.log
# 启动端口
port=27017
# 开启进程守护
fork=true
# 开启权限验证
auth=true
# 设置对外开放（不对外开放的话可不设或设置成127.0.0.1）
bind_ip=0.0.0.0
# 设置日志每天自动切割
logappend=true
```

### 启动MongoDB

```sh
$ mongodb --config mongodb.conf
```

### 添加用户名和密码

登陆MongoDB

```sh
$ mongo
```

选择admin库，添加用户名和密码

```sh
$ use admin
$ db.createUser({ user: "root", pwd: "password", roles: [{ role: "userAdminAnyDatabase", db: "admin" }] })
```

登陆验证

```sh
$ db.auth("root", "password")
```

### 测试远程访问

使用ip+端口访问，如`127.0.0.1:27017`

![image-20201124122800195](https://oss-blog.myjerry.cn/files/image-20201124122800195.png)

能访问到，就说明服务开启成功，并且可以远程访问。

### 使用`systemd`进行服务管理

在`/etc/systemd/system`目录下新建名为`mongod.service`的文件，内容如下：

```sh
[Unit]
Description=mongod-server
After=network.target

[Service]
Type=forking
ExecStart=${mongodb-install-directory}/bin/mongod --config ${mongodb-install-directory}/mongodb.conf
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

刷新`systemctl`查看MongoDB状态

```sh
$ sudo systemctl daemon-reload
$ sudo systemctl status mongod
```

![image-20201124123122694](https://oss-blog.myjerry.cn/files/image-20201124123122694.png)

设置开机启动

```sh
$ sudo systemctl enable mongod.service
```

<Vssue :title="$title" />