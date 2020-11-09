# 命令行输出

> 使用控制台模块的基础输出

以最基础、最常用的`console.log()`为例。可传入任何对象，最终以字符串的方式展示在控制台。
可传入多个参数。例如：

```javascript
const x = 'x';
const y = 'y;'
console.log(x, y);
$ x y
```
也可以通过传入变量和格式说明符来格式化用语。例如：

```javascript
console.log('你好%s，今天是星期%d', 'Jerry', );
```

* %s 会格式化变量为字符串
* %d 会格式化变量为数字
* %i 会格式化变量为其整数部分
* %o 会格式化变量为对象

例如：

```javascript
console.log('%o', Number);
```

> 为输出着色

可以使用`转义序列`在控制台中为文本的输出着色。 转义序列是一组标识颜色的字符。
例如：

```javascript
console.log('\x1b[33m%s\x1b[0m', '你好');
# 会在控制台出入黄色字体的你好
```

也可以使用第三方库`chalk`为输出着色，它还有助于其他样式的设置（例如使文本变为粗体、斜体或带下划线）。
可以使用`npm install chalk`进行安装，然后就可以使用它：

```javascript
const chalk = require('chalk');
console.log(chalk.yellow('你好'));
```

与尝试记住转义序列相比，`chalk.*`相对方便许多，也能提高代码可读性。

> 创建进度条

`Progress`是一个很棒的软件包，可在控制台中创建进度条。 使用`npm install progress`进行安装。
以下代码段会创建一个 10 步的进度条，每 100 毫秒完成一步。 当进度条结束时，则清除定时器：

```javascript
const ProgressBar = require('progress')

const bar = new ProgressBar(':bar', { total: 10 })
const timer = setInterval(() => {
  bar.tick()
  if (bar.complete) {
    clearInterval(timer)
  }
}, 100)
```

也可用来展示文件下载进度：

```javascript
var ProgressBar = require('progress');
var https = require('https');
var req = https.request({
  host: 'www.myjerry.cn',
  port: 443,
  path: '/_nuxt/7915dad877fcafaf1273.js'
});
req.on('response', function(res){
  var len = parseInt(res.headers['content-length'], 10);
  let fileName = '7915dad877fcafaf1273.js';
  let size = '269KB';
  var bar = new ProgressBar(`downloading ${fileName} [:bar] :rate/bps ${size} :percent :etas`, {
    complete: '=',
    incomplete: '-',
    width: 100,
    total: len
  });
  res.on('data', function (chunk) {
    bar.tick(chunk.length);
  });
  res.on('end', function () {
    console.log('\n', '完成');
  });
});
req.end();
```

<Vssue :title="$title" />