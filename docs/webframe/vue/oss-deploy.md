# 阿里oss+cdn部署前后端分离项目

### 前言

相对于ECS部署前端项目，直接使用阿里云oss+cdn部署有几大好处：

-   成本低。oss+cdn部署不需要单独的购买ECS服务器所需要的花费少很多；
-   大幅度降低运营成本。直接使用现成云服务，无需花精力去维护ECS；
-   极高的可用性与访问速度。ECS带宽毕竟有限，高带宽伴随着超高的计费。但用oss+cdn可以解决带宽瓶颈，极大的提升了用户的访问体验

### 部署准备

1.  备案过的域名
1.  足够的账户余额

### 部署步骤

#### 开通oss与cdn服务

oss与cdn都是按量付费（后付），开通无需付款

#### oss创建存储桶（bucket）

每个存储桶（bucket）可以当作一个单独的网盘使用，但存储桶名称必须全局唯一，不能重名。创建如下：

![image2021-10-25_22-2-47](/images/image2021-10-25_22-2-47.png)

#### 配置存储桶

存储桶创建后，默认市不具备惊天网站托管的功能，因此需要所一些配置。配置如下：

![image2021-10-25_22-6-22](/images/image2021-10-25_22-6-22.png)

如果不是部署history默认的前端项目，可以不用开通子目录首页功能

#### 绑定域名

存储桶配置完成后，需要绑定自己的域名，虽然可以使用oss提供的存储桶域名，但在当前需求下是不能使用的。所以需要配置自己的域名。如下：


![image2021-10-25_22-12-2](/images/image2021-10-25_22-12-2.png)

如果域名在当前账号下可直接勾选 `自动添加 CNAME 记录`，减少手动配置。如果域名没有在当前账号或者当前平台，需手动配置域名解析。如下：


![image2021-10-25_22-18-32](/images/image2021-10-25_22-18-32.png)

#### 启用cdn加速

![image2021-10-25_22-19-55](/images/image2021-10-25_22-19-55.png)

![image2021-10-25_22-21-3](/images/image2021-10-25_22-21-3.png)

cdn还存在一些优化配置，此处不作以列出（如ssl、http2等）。

#### Jenkins集成部署

在Jenkins中前端项目打包完成后，可通过命令行工具（ossutil64）直接将打包文件上传到oss上，一般情况会存在打包文件版本控制，如文件`20211025`。

ossutil64：文档地址：<https://help.aliyun.com/document_detail/50452.html?spm=5176.8465980.help.dexternal.4e701450qfeUER>

```bash
#!/bin/bash

cd /opt/appserver/<项目存放目录>

yarn instal && yarn build

ossutil64 cp -r -f /opt/appserver/<项目存放目录>/dist oss://cn-myjerry-test/dev/<打包时间/版本>
# 创建index.html软链(如果是一级目录部署可忽略)
ossutil64 create-symlink oss://cn-myjerry-test/index.html oss://cn-myjerry-test/dev/<打包时间/版本>/index.html
```
