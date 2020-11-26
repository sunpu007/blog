# 手写脚手架工具

> 什么是cli

**命令行界面**（英语：**command-line interface**，[缩写]：**CLI**）是在图形用户界面得到普及之前使用最为广泛的[用户界面]，它通常不支持[鼠标]，用户通过键盘输入指令，计算机接收到指令后，予以执行。

> 所需依赖包

- **commander** 参数解析 如：-V、--help
- **axios** 接口调用
- **inquirer** 交互式命令行工具
- **download-git-repo** 下载并提取git存储库
- **metalsmith** 读取所有文件,实现模板渲染
- **consolidate** 统一模板引擎
- **ncp** 异步递归文件和目录复制
- **ora** loading加载器
- **ejs** 模版编译
- **util** 工具方法

> 目录结构

```sh
├── bin 
│ └── www // 全局命令执行的根文件 
├── package.json 
├── src 
│ ├── constants.js // 存放常量
│ ├── create.js // create命令逻辑 
│ ├── main.js // 入口文件 
```

> 实现功能

```sh
vue-cli create projectName
```

> 创建工程

**创建项目文件夹**

```sh
mkdir vue-cli
```

**初始化项目并添加配置**

- 初始化`package.json`

```sh
npm init -y
```

- 编写入口文件，在`bin`文件夹下创建`www.js`文件，写入一下代码

```js
#! /usr/bin/env node

require('../src/main');
```

- 配置bin命令，指向www文件

```json
"bin": {
  "vue-cli": "./bin/www"
}
```

- 链接包到全局

```sh
npm link
```

*链接成功后可在命令行执行`vue-cli`命令测试*

> 添加参数解析

- 安装模块

```sh
npm install --save-dev commander
```

- 编写main.js文件

```js
const program = require('commander');

// process.argv为用户在命令行传入的参数
program.version('0.0.1').parse(process.argv);
```

*执行`vue-cli -V`出现`0.0.1`即为成功*

- 动态获取版本号*从`package.json`文件中获取*

```js
// constants.js
const { version } = require('../package.json');

module.exports = {
  version,
};

// main.js
const { version } = require('./constants');
program.version(version).parse(process.argv);
```

> 添加指令命令

根据我们想要实现的功能配置执行的动作。

```js
// 配置3个指令命令
const mapActions = {
  // 创建项目
  create: {
    // 别名
    alias: 'c',
    // 描述
    description: 'create a project',
    // 示例
    examples: [
      'td-cli create <project-name>',
    ],
  },
  config: {
    alias: 'conf',
    description: 'config project variable',
    examples: [
      'td-cli config set <k><v>',
      'td-cli config get <k>',
    ],
  },
  '*': {
    alias: '',
    description: 'command not found',
    examples: [],
  },
};

// 循环添加命令
Reflect.ownKeys(mapActions).forEach(action => {
  program
    .command(action)  // 配置命令的名字
    .alias(mapActions[action].alias)  // 命令的别名
    .description(mapActions[action].description)  // 命令对应的描述
    .action(_ => {
      if (action === '*') {
        // 访问不到对应的命令 就打印找不到命令
        console.log(mapActions[action].description);
      } else {
        console.log(action);
      }
    });
});

// 监听help事件
program.on('--help', _ => {
  console.log('\nExample:');
  // 循环打印出示例
  Reflect.ownKeys(mapActions).forEach(actions => {
    mapActions[actions].examples.forEach(example => {
      console.log(example);
    });
  });
});
```

*执行`vue-cli --help`可打印出配置的命令信息*

> 实现create命令

create命令的主要作用是拉取git仓库中的对应模版到本地

```js
// main.js
.action(_ => {
	if (action === '*') {
  	console.log(mapActions[action].description);
  } else {
    // console.log(action);
    require(path.resolve(__dirname, action))(...process.argv.slice(3))
  }
});

// 创建create.js
module.exports = async (projectName) => {
  console.log(projectName);
};
```

*执行`vue-cli create projectName`可以打印出projectName*

> 拉取项目

我们需要获取仓库的所有模版信息（*以github为例*）。通过使用axios获取获取相关信息

```sh
npm install --save-dev axios
```

拉去github上的仓库模版

```js
// create.js
const axios = require('axios');

// 获取仓库列表
const fetchRopeList = async () => {
  // 获取当前组织中的所有仓库信息，这个仓库中存放的都是项目模版
  const { data } = await axios.get('https://api.github.com/orgs/td-cli/repos');
  return data;
}

module.exports = async () => {
  let repos = await fetchRepoList();
  // 获取模版名称
  repos = repos.map((item) => item.name);
  console.log(repos);
};
```

> 添加loading和命令行交互工具

```sh
npm install --save-dev inquirer ora
```

```js
// create.js
const org = require('ora');
const Inquirer = require('inquirer');

module.exports = async () => {
  // 初始化loading
  const spinner = ora('fetching template .....');
  spinner.start(); // 开始loading
  let repos = await fetchRepoList();
  spinner.succeed(); // 结束loading
  // 获取模版名称
  repos = repos.map((item) => item.name);
  // 选择模版
  const {
    repo,
  } = await Inquirer.prompt({
    // 获取选择后的结果
    name: 'repo',
    // 什么方式显示在命令行
    type: 'list',
    // 提示信息
    message: 'please choise a template to create project',
    // 选择的数据/数据源
    choices: repos,
  });
  // 获取到用户选择模版名
  console.log(repo);
};
```

> 获取模版版本信息

封装loading

```js
// create.js
/**
 * 封装loading效果
 * @param {*} fn 方法
 * @param {*} message 提示语
 */
const waitFnloading = (fn, message) => async (...args) => {
  const spinner = org(message);
  spinner.start();
  const result = await fn(...args);
  spinner.stop();
  return result;
}
```

获取版本信息

```js
// create.js
// 获取版本列表
const fetchTagList = async repo => {
  const { data } = await axios.get(`https://api.github.com/repos/td-cli/${repo}/tags`);
  return data;
}

...
let tags = await waitFnloading(fetchTagList, 'fetching tags...')(repo);
tags = tags.map(item => item.name);
const { tag } = await Inquirer.prompt({
	name: 'tag',
  type: 'list',
  message: 'please choise a tag to create project',
  // 数据源
  choices: tags,
})
...
```

> 下载项目

获取项目临时存放目录

```js
// constants.js
// Windows与Mac的用户目录不一致需要兼容
const downloadDirectory = `${process.env[process.platform === 'darwin' ? 'HOME' : 'USERPROFILE']}/.template`;

module.exports = {
  version,
  downloadDirectory
};
```

```sh
npm install --save-dev download-git-reop util
```

```js
// create.js
const { promisify } = require('util');

// 由于`downloadGitRepo`不是`promise`方法，所以需要用`promisify`包装一下
let downloadGitRepo = require('download-git-repo');
downloadGitRepo = promisify(downloadGitRepo);

// 下载模版，返回模版存放目录
const download = async (repo, tag) => {
  let api = `td-cli/${repo}`;
  if (tag) {
    api += `#${tag}`;
  }
  const dest = `${downloadDirectory}/${repo}`;
  await downloadGitRepo(api, dest);
  return dest;
}

...
const dest = await waitFnloading(download, 'download template...')(repo, tag);
...
```

需要将项目拷贝到当前执行命令的目录下

```sh
npm install ncp --save-dev
```

```js
// create.js
let ncp = require('ncp');
ncp = promisify(ncp);

...
// 拷贝文件
await ncp(dest, path.join(path.resolve(), projectName))
...
```

这样就创建了一个简单的模版项目

> 复杂模版下载

通常用户可以定制下载模版的内容，例如`package.json`文件，用户可以根据提示设置项目名、描述等。项目模版中增加了`ask.js`文件

```js
module.exports = [
	{
		type: 'confirm',
    name: 'private',
    message: 'ths resgistery is private?',
  },
  {
    type: 'input',
    name: 'author',
    message: 'author?',
  },
  {
    type: 'input',
    name: 'description',
    message: 'description?',
  },
  {
    type: 'input',
    name: 'license',
    message: 'license?',
  },
]
```

根据对应的询问生成最终的`package.js`

安装需要的模块

```sh
npm i metalsmith ejs consolidate --save-dev
```

```js
// create.js
let { render } = require('consolidate').ejs;
render = promisify(render);
const Metalsmith = require('metalsmith');

...
if (!fs.existsSync(path.join(dest, 'ask.js'))) {
  // 简单模版 -> 拷贝文件
  await ncp(dest, path.resolve(projectName))
} else {
  await new Promise((resolve, reject) => {
    Metalsmith(__dirname)
      .source(dest)
      .destination(path.resolve(projectName))
      .use(async (files, metal, done) => {
        // 读取ask.js文件
        const args = require(path.join(dest, 'ask.js'));
        const obj = await Inquirer.prompt(args);

        // 下传用户选择信息
        const meta = metal.metadata();
        Object.assign(meta, obj);
        
        // 删除ask.js文件
        delete files['ask.js'];

        done();
      })
      .use(async (files, metal, done) => {
        // 获取用户填写的信息渲染模版
        const obj = metal.metadata();
        Reflect.ownKeys(files).forEach(async file => {
          // 只处理js和json文件
          if (file.includes('.js') || file.includes('.json')) {
            // 获取文件内容
            let content = files[file].contents.toString();
            // 判断是否存在模版变量
            if (content.includes('<%')) {
              content = await render(content, obj);
              // 渲染
              files[file].contents = Buffer.from(content);
            }
          }
        });
        done();
      })
      .build(error => {
        if (error) {
          reject();
        } else {
          resolve();
        }
      });
  })
}
...
```

> 优化

判断当前目录是否存在相同的文件夹

```js
...
// 判断当前目录下是否存在相同文件夹
if (fs.existsSync(path.resolve(projectName))) {
  // throw new Error('存在相同目录');
  const { flge } = await Inquirer.prompt({
    name: 'flge',
    type: 'confirm',
    message: 'Project directory exists, do you want to override it?'
  })
  if (!flge) return false;
}
...
```

> 发布工具

```sh
nrm use npm  // 准备发布包
npm addUser  // 填写账号密码
npm publish  // 已经发布成功
```

