# 实现ssh免密登陆服务器

### 创建ssh公钥

```sh
# 创建公钥
$ ssh-keygen -o
# 获取公钥
$ cat ~/.ssh/id_rsa.pub
```

### 在服务器`authorized_keys`添加公钥

```sh
$ cd ~/.ssh/
# 写入公钥
$ vim authorized_keys
```

在文件中写入上面的公钥信息，`wq!`保存并退出

### 关闭密码登录(可选)

```sh
# 进入sshd_config文件，将"PasswordAuthentication yes"修改为"PasswordAuthentication no"
$ vim /etc/ssh/sshd_config
# 重新加载ssh配置
$ /etc/init.d/sshd reload
```

推出登录后就可以使用ssh公钥免密登录服务器啦

<Vssue :title="$title" />