# 让项目支持SVG

### 创建`icon-component`组件

```javascript
// components/SvgIcon
<template>
  <div v-if="isExternal" :style="styleExternalIcon" class="svg-external-icon svg-icon" v-on="$listeners" />
  <svg v-else :class="svgClass" aria-hidden="true" v-on="$listeners">
    <use :href="iconName" />
  </svg>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    isExternal () {
      return isExternal(this.iconClass)
    },
    iconName () {
      return `#icon-${this.iconClass}`
    },
    svgClass () {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    },
    styleExternalIcon () {
      return {
        mask: `url(${this.iconClass}) no-repeat 50% 50%`,
        '-webkit-mask': `url(${this.iconClass}) no-repeat 50% 50%`
      }
    }
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover!important;
  display: inline-block;
}
</style>

```

### 使用`svg-sprite-loader`处理SVG

接下来我们在`vue-cli`基础上进行改造，配置`svg-sprite-loader`，将多个SVG打包成`svg-sprite`。
我们不能保证所有的SVG都是用来作为Icon的，并且`url-loader`会将所有SVG处理成base64，所以使用webpack 的`exclude`和`include`，让`url-loader`处理除此文件夹之外的SVG，`svg-sprite-loader`只处理指定文件夹下的SVG。`Electron-vue`也可参照。

```javascript
{
  test: /\.svg$/,
  include: [resolve('src/icons')],
  use: {
    loader: 'svg-sprite-loader',
    options: {
      symbolId: 'icon-[name]'
    }
  }
},
{
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  exclude: [resolve('src/renderer/icons')],
  use: {
    loader: 'url-loader',
    query: {
      limit: 10000,
      name: 'imgs/[name]--[folder].[ext]'
    }
  }
}
```

### `Nuxt.js`支持，修改`nuxt.config`文件

```javascript
build: {
  extend (config, ctx) {
    const svgRule = config.module.rules.find(rule => rule.test.test('.svg'))
    svgRule.exclude = [path.resolve(__dirname, 'assets/svg')]
    // Includes /icons/svg for svg-sprite-loader
    config.module.rules.push({
      test: /\.svg$/,
      include: [path.resolve(__dirname, 'assets/svg')],
      loader: 'svg-sprite-loader',
      options: {
        symbolId: 'icon-[name]',
      },
    })
  }
}
```

### 自动导入

创建一个专门存放SVG图标的文件夹`@src/icons`，将所有SVG图标放到该文件夹下。之后使用webpack的[require.context](https://webpack.js.org/guides/dependency-management/#require-context)，通过正则引入SVG图标文件

```javascript
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)
requireAll(req)
```

### 页面使用

```javascript
<svg-icon class="login" />
```

*文章参考：[手摸手，带你优雅的使用 icon](https://juejin.im/post/59bb864b5188257e7a427c09#heading-0)*

<Vssue :title="$title" />