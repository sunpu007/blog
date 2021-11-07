# Centos安装Mysql

### 检查系统是否安装老版本，有的话干掉

```sh
$ yum list installed | grep mysql
# 卸载系统中的老版本
$ yum -y remove mysql-libs.x86_64
```

### 安装及配置

获取安装版本的`Yum`资源包，下载地址：[https://dev.mysql.com/downloads/repo/yum/](https://dev.mysql.com/downloads/repo/yum/)





<Vssue :title="$title" />