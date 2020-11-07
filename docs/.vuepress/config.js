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
    '@vuepress/pwa',
    {
      serviceWorker: true,
      updatePopup: true,
    },
  ]
}
