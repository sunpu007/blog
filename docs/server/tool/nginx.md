# Centos安装Nginx

> 安装编译工具及库文件

```sh
$ yum -y install make zlib zlib-devel gcc-c++ libtool  openssl openssl-devel
```

> 安装Nginx

下载Nginx，下载地址：[https://nginx.org/en/download.html](https://nginx.org/en/download.html)

![image-20201121153734585](https://cdn-blog.myjerry.cn/image-20201121153734585.png)

选择所要安装的版本，这里选择最新版`nginx-1.18.0`

```sh
$ cd /usr/local/
$ wget https://nginx.org/download/nginx-1.18.0.tar.gz
```

解压安装包

```sh
$ tar zxvf nginx-1.18.0.tar.gz
```

进入安装包目录

![image-20201121151415405](https://cdn-blog.myjerry.cn/image-20201121151415405.png)

常用目录介绍

```sh
# Nginx配置文件目录
drwxr-xr-x  3 root   root 4096 Nov  8 21:21 conf
# 网站静态资源存放目录
drwxr-xr-x  2 root   root 4096 Jul 26  2018 html
# Nginx日志文件目录
drwxr-xr-x  2 root   root 4096 Nov  6 13:41 logs
# Nginx脚本目录
drwxr-xr-x  2 root   root 4096 Jul 26  2018 sbin
```

编译安装

```sh
# 配置[可以添加自己所需要的模块]
$ ./configure
# 编译
$ make
# 安装
$ make install
```

检测是否安装成功，输出版本号即为安装成功

```sh
$ ./sbin/nginx -v
nginx version: nginx/1.18.0
```

启动Nginx

```sh
$ ./sbin/nginx
```

浏览器访问http://localhost:8080

![image-20201121153652684](https://cdn-blog.myjerry.cn/image-20201121153652684.png)

> 使用`systemd`进行服务管理

在`/etc/systemd/system`目录下新建名为`nginx.service`的文件，内容如下：

```sh
[Unit]
Description=nginx
After=network.target
  
[Service]
Type=forking
ExecStart=/usr/local/nginx/sbin/nginx
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s quit
PrivateTmp=true
  
[Install]
WantedBy=multi-user.target
```

刷新`systemctl`查看Nginx状态

```sh
$ sudo systemctl daemon-reload
$ sudo systemctl status nginx
```

![image-20201121153040158](https://cdn-blog.myjerry.cn/image-20201121153040158.png)

设置开机启动

```sh
$ sudo systemctl enable nginx.service
```

***附：常用命令***

```sh
$ sudo systemctl enable nginx.service   # 将 nginx 服务设置为开机启动
$ sudo systemctl start nginx.service    # 启动 nginx 服务
$ sudo systemctl status nginx.service   # 查看 nginx 服务状态
$ sudo systemctl stop nginx.service     # 停止 nginx 服务
$ sudo systemctl status nginx.service   # 查看 nginx 服务状态
$ sudo systemctl restart nginx.service  # 重启 nginx 服务
$ sudo systemctl status nginx.service   # 查看 nginx 服务状态
```

<Vssue :title="$title" />