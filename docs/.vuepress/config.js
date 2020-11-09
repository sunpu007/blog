module.exports = {
  title: 'Jerry的博客',
  description: '专注于前后端技术，从前端到后端再到数据库',
  dest: './dist',
  head: [
    ['link', { rel: 'icon', href: `/favicon.ico` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
  ],
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '前端', link: '/webframe/' },
      { text: '后端', link: '/backend/' },
      { text: '服务器', link: '/server/' },
      { text: '关于我', link: '/about/' },
      { text: 'github', link: 'https://github.com/sunpu007/blog' }
    ],
    sidebarDepth: 3,
    displayAllHeaders: true,
    sidebar: {
      '/webframe/': [
        {
          title: 'Javascript',
          collapsable: false,
          children: [
            '/webframe/javascript/utils.md'
          ]
        },
        {
          title: 'Vue',
          collapsable: false,
          children: [
            '/webframe/vue/toast.md',
            '/webframe/vue/svg.md'
          ]
        },
        {
          title: 'Typescript',
          collapsable: false,
          children: [
            '/webframe/typescript/arrayList.md'
          ]
        },
      ],
      '/backend/': [
        {
          title: 'Node',
          collapsable: false,
          children: [
            '/backend/node/download-file.md',
            '/backend/node/command-out.md'
          ]
        },
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
    ['@vssue/vuepress-plugin-vssue', {
      platform: 'github-v4', //v3的platform是github，v4的是github-v4
      locale: 'zh', //语言
      owner: 'sunpu007', //github账户名
      repo: 'blog', //github一个项目的名称
      clientId: 'cf4688b75929f82666bd',//注册的Client ID
      clientSecret: '2556e373875d899e7750cf27d97189b3974bf4e7',//注册的Client Secret
      // autoCreateIssue: true // 自动创建评论，默认是false，最好开启，这样首次进入页面的时候就不用去点击创建评论的按钮了。
    }], // 评论
    '@vuepress/pwa',
    {
      serviceWorker: true,
      updatePopup: true,
    },
  ]
}
