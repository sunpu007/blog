# centos安装Node环境

### 安装编译工具及库文件

```sh
$ yum install gcc gcc-c++
```

### 安装Node

下载Node，下载地址：[https://nodejs.org/en/download/](https://nodejs.org/en/download/)

![image-20201122171624672](https://oss-blog.myjerry.cn/files/20201122171710.png)

```sh
$ wget https://nodejs.org/dist/v14.15.1/node-v14.15.1-linux-x64.tar.xz
```

解压安装包

```sh
$ tar -xvf node-v14.15.1-linux-x64.tar.xz
```

重命名

```sh
mv node-v14.15.1-linux-x64 node-v14.15.1
```

建立软链

```
$ ln -s /opt/tools/node-v14.15.1/bin/node /usr/bin/node
$ node -v
$ ln -s /opt/tools/node-v14.15.1/bin/npm /usr/bin/npm
$ npm -v
```

安装Yarn

```
$ curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo
$ yum install -y yarn
```

<Vssue :title="$title" />