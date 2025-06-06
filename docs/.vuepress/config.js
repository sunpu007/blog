const clientId = 'cf4688b75929f82666bd';
const clientSecret = '2556e373875d899e7750cf27d97189b3974bf4e7';
const baiduKey = '97f3b97ce0bea6ad75db099c2a6e1504';

module.exports = {
  title: 'Jerry的博客',
  description: '✌知名“百度CV”高级工程师✌',
//   description: '专注于前后端技术，从前端到后端再到数据库',
  dest: './dist',
  head: [
    [ 'meta', { name: 'keywords', content: 'sunpu,Jerry,sp,jerry,sun,孙谱-前端开发工程师,孙谱,孙谱-前端,孙谱-全栈,孙谱-陕西西安,孙谱-西安,孙谱-全栈工程师' } ],
    [ 'meta', { name: 'baidu-site-verification', content: 'code-3R75nJx62i' }],
    ['link', { rel: 'icon', href: `/favicon.ico` }],
    // ['link', { rel: 'manifest', href: '/manifest.json' }],
    // ['script', { src: '/common.js' }],
    [
      "script",
      {},
      `
      window.__rum = {
        "pid": "gx1kuz64zg@95fdd72b343c07d",
        "endpoint": "https://gx1kuz64zg-default-cn.rum.aliyuncs.com"
      };
      `
    ],
    [
      "script",
      {
        type: "text/javascript",
        src: 'https://sdk.rum.aliyuncs.com/v2/browser-sdk.js',
        crossorigin: 'crossorigin'
      }
    ],
    [
      "script",
      {},
      `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?${baiduKey}";
        var s = document.getElementsByTagName("script")[0]; 
        s.parentNode.insertBefore(hm, s);
      })();
      `
    ],
    [
      "script",
      {
        async: 'async',
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1039566856859181',
        crossorigin: 'anonymous',
      },
    ],
  ],
  // 显示行号
  // markdown: {
  //   lineNumbers: true,
  // },
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '前端', link: '/webframe/' },
      { text: '后端', link: '/backend/' },
      { text: '数据结构与算法', link: '/datastructure-algorithm/' },
      { text: '服务器', link: '/server/' },
      { text: '关于我', link: '/about/' },
      { text: '掘金', link: 'https://juejin.cn/user/1662117310106909', target:'_blank' },
      { text: 'CSDN', link: 'https://blog.csdn.net/Jerry_zpon', target:'_blank' },
      { text: 'github', link: 'https://github.com/sunpu007', target:'_blank' }
    ],
    sidebarDepth: 3,
    displayAllHeaders: true,
    lastUpdated: '上次更新时间',
    sidebar: {
      '/webframe/': [
        {
          title: '前端',
          collapsable: false,
          children: [
            '/webframe/javascript/utils.md',
            '/webframe/javascript/code-snippet.md',
            '/webframe/vue/toast.md',
            '/webframe/vue/svg.md',
            '/webframe/vue/vue-cli.md',
            '/webframe/vue/permission.md',
            '/webframe/dart/basic-grammar.md',
            '/webframe/javascript/async-load.md',
            '/webframe/vue/oss-deploy.md'
            // '/webframe/javascript/closure.md'
          ]
        },
        // {
        //   title: 'Javascript',
        //   collapsable: false,
        //   children: [
        //     '/webframe/javascript/utils.md',
        //     '/webframe/javascript/code-snippet.md'
        //   ]
        // },
        // {
        //   title: 'Vue',
        //   collapsable: false,
        //   children: [
        //     '/webframe/vue/toast.md',
        //     '/webframe/vue/svg.md',
        //     '/webframe/vue/vue-cli.md',
        //     '/webframe/vue/permission.md'
        //   ]
        // },
        // {
        //   title: 'Typescript',
        //   collapsable: false,
        //   children: [
        //     '/webframe/typescript/arrayList.md'
        //   ]
        // },
      ],
      '/backend/': [
        {
          title: 'Node',
          collapsable: false,
          children: [
            '/backend/node/download-file.md',
            '/backend/node/command-out.md',
            '/backend/node/job.md',
            '/backend/node/server-info.md'
          ]
        },
      ],
      '/datastructure-algorithm/': [
        {
          title: '数据结构',
          collapsable: false,
          children: [
            '/datastructure-algorithm/data-structure/typescript-arrayList.md',
            '/datastructure-algorithm/data-structure/typescript-linkedList.md'
          ]
        },
      ],
      '/server/': [
        {
          title: '服务器',
          collapsable: false,
          children: [
            '/server/tool/nginx.md',
            '/server/tool/node.md',
            '/server/tool/mongodb.md',
            '/server/tool/redis.md',
            '/server/operation/ssh.md'
          ]
        },
        // {
        //   title: '工具',
        //   collapsable: false,
        //   children: [
        //     '/server/tool/nginx.md',
        //     '/server/tool/node.md',
        //     '/server/tool/mongodb.md',
        //     '/server/tool/redis.md'
        //   ]
        // },
        // {
        //   title: '运维',
        //   collapsable: false,
        //   children: [
        //     // '/server/operation/mining.md'
        //     '/server/operation/ssh.md'
        //   ]
        // },
      ],
      '/about/': [
        {
          title: '',
          collapsable: false,
          children: [
            '/about/'
          ]
        },
      ]
    },
  },
  plugins: [
    ['@vuepress/back-to-top'], // 返回顶部
    ['@vuepress/nprogress'], // 加载进度条
    ['@vuepress/medium-zoom'],
    ['vuepress-plugin-code-copy', true],
    ['@vssue/vuepress-plugin-vssue', {
      platform: 'github', //v3的platform是github，v4的是github-v4
      locale: 'zh', //语言
      owner: 'sunpu007', //github账户名
      repo: 'blog', //github一个项目的名称
      clientId,//注册的Client ID
      clientSecret,//注册的Client Secret
      proxy: 'https://www.myjerry.cn',
      autoCreateIssue: true // 自动创建评论，默认是false，最好开启，这样首次进入页面的时候就不用去点击创建评论的按钮了。
    }], // 评论
    ["copyright", {
      noCopy: false,  // 设置为true, 不允许复制
      minLength: 100,
      authorName: "Jerry的博客-Jerry",
      clipboardComponent: ".vuepress/components/clipboardComponent.vue"
    }],
    // '@vuepress/pwa',
    // {
    //   serviceWorker: true,
    //   updatePopup: true,
    // },
    {
      name: 'page-plugin',
      // , 'notice'
      globalUIComponents: ['fixed'],
    },
  ]
}
