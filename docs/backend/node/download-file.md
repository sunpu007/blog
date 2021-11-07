# 网络文件下载

### 获取网络文件名

使用`path`模块获取网络文件名。

```javascript
const fileName = fileName ? fileName : Path.basename(fileUrl);
```

### 创建网络连接

由于`http`与`https`所使用的获取下载流模块不同，所以需要对不同协议创建不同的连接。

```javascript
const url = URL.parse(fileUrl);
let req = null;
if (url.protocol === 'http:') req = http.request(url);
if (url.protocol === 'https:') req = https.request(url);
```

### 创建文件写入流

由于`http`/`https`获取的文件信息是流信息，所以需要使用`fs`模块来创建文件写入流

```javascript
const stream = fs.createWriteStream(path + fileName);
```

### 监听网络连接并写入文件

监听连接的响应，获取返回信息流并写入文件。因为io流非常耗费性能，所以每写完一个文件必须要将其关闭，释放资源。

```javascript
req.on('response', (res) => {
  const len = parseInt(res.headers['content-length'], 10);

  const bar = new ProgressBar(`downloading ${fileName} [:bar] :rate/bps size: ${len}KB :percent :etas`, {
    complete: '=',
    incomplete: '-',
    width: 100,
    total: len,
  })

  res.on('data', chunk => {
    bar.tick(chunk);
    stream.write(chunk, 'utf-8');
  })

  res.on('end', _ => {
    console.log('/n')
    stream.end();
  })

  res.on('error', err => {
    console.error(err);
  })
})
req.end();
```

### 完整代码

```javascript
'use strict';

const ProgressBar = require('progress');
const https = require('https');
const http = require('http');
const fs = require('fs');
const Path = require('path');
const URL = require('url');

/**
 * 下载单个文件
 * @param {String} fileUrl 网络文件路径
 * @param {String} path 文件存放位置
 * @param {String} fileName 文件名
 */
const downloadFile = (fileUrl, path, fileName) => {
  fileName = fileName ? fileName : Path.basename(fileUrl);
  path = path ? path : './';
  const stream = fs.createWriteStream(path + fileName);

  const url = URL.parse(fileUrl);
  let req = null;
  if (url.protocol === 'http:') req = http.request(url);
  if (url.protocol === 'https:') req = https.request(url);

  req.on('response', (res) => {
    const len = parseInt(res.headers['content-length'], 10);

    const bar = new ProgressBar(`downloading ${fileName} [:bar] :rate/bps size: ${len}KB :percent :etas`, {
      complete: '=',
      incomplete: '-',
      width: 100,
      total: len,
    })
  
    res.on('data', chunk => {
      bar.tick(chunk);
      stream.write(chunk, 'utf-8');
    })
  
    res.on('end', _ => {
      console.log('/n')
      stream.end();
    })

    res.on('error', err => {
      console.error(err);
    })
  })
  req.end();
}

/**
 * 下载多个文件
 * @param {String[]} fileUrls 网络文件路径数组
 * @param {String} path 文件存放位置
 */
const downloadFiles = (fileUrls, path) => {
  if (fileUrls && fileUrls.length === 0) throw new Error('fileUrls cannot be empty');
  path = path ? path : './';

  fileUrls.forEach(url => {
    downloadFile(url, path)
  })
}

module.exports = {
  downloadFile,
  downloadFiles,
}
```

<Vssue :title="$title" />