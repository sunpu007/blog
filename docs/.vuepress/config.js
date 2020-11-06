module.exports = {
  title: 'Jerry的博客',
  description: '专注于前后端技术反向，从前端到Node.js/Java再到数据库',
  dest: './dist'
  head: [
    ['link', { rel: 'icon', href: `/favicon.ico` }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
  ],
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
