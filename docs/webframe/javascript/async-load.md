# 动态加载js与css文件

###  背景

在前端日常开发中，肯定会遇到这样的需求场景：一个使用频率很低的功能引入了较大的第三方SDK，且第三方SDK没有提供相应的npm包，无法按需引入，只能在index.html中使用标签的方式引入，导致项目启动的时候需要加载较多的文件，带来了首屏渲染的时间延长。当然也可以使用`async`与`defer`属性告诉浏览器延迟执行，但还是会浪费一定的加载资源。

所以可以采用资源的动态加载，只有在需要的时候去动态加载相应的资源文件。

### 实现

#### 动态加载js

实现思想：

1. 使用`createElement`创建DOM元素
2. 设置`type`与`src`
3. 将DOM元素添加到body中
4. 监听加载成功与失败执行相应的回调函数

```js
export function loadJs(srcUrl) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = srcUrl
    document.body.appendChild(script)
    script.onload = () => {
      resolve()
    }
    script.onerror = (err) => {
      reject(err)
    }
  })
}
```

动态创建时，可能遇到已经创建过该元素并添加到body中，重复创建的有点浪费（DOM的创建很浪费资源），所以在创建时判断当前文件是否已经存在

```js
...
// 判断当前js是否已经加载过
const scriptNodes = [].slice.call(document.querySelectorAll('script')).map(item => item.src)
if (scriptNodes.includes(srcUrl)) return resolve()
...
```

### 完整代码

```js
/**
 * 动态加载js文件
 * @param {*} srcUrl 文件地址
 * @returns Promise
 */
export function loadJs(srcUrl) {
  return new Promise((resolve, reject) => {
    // 判断当前js是否已经加载过
    const scriptNodes = [].slice.call(document.querySelectorAll('script')).map(item => item.src)
    if (scriptNodes.includes(srcUrl)) return resolve()

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = srcUrl
    document.body.appendChild(script)
    script.onload = () => {
      resolve()
    }
    script.onerror = (err) => {
      reject(err)
    }
  })
}
```

#### 动态加载css

```js
/**
 * 动态加载js文件
 * @param {*} hrefUrl 文件地址
 * @returns Promise
 */
export function loadCss(hrefUrl) {
  return new Promise((resolve, reject) => {
    // 判断当前css是否已经加载过
    const linkNodes = [].slice.call(document.querySelectorAll('link')).map(item => item.href)
    if (linkNodes.includes(hrefUrl)) return resolve()

    const link = document.createElement('link')
    link.type = 'text/css'
    link.rel = 'stylesheet'
    link.href = hrefUrl
    document.head.appendChild(link)
    link.onload = () => {
      resolve()
    }
    link.onerror = (err) => {
      reject(err)
    }
  })
}
```

#### 动态加载多个文件

```js
/**
 * 动态加载多个文件
 * @param {*} jsList js文件地址列表
 * @param {*} cssList css文件地址列表
 * @returns Promise
 */
export function asyncLoad(jsList, cssList) {
  return new Promise((resolve, reject) => {
    const jsPromiseList = []
    const cssPromiseList = []
    jsList.forEach(item => {
      jsPromiseList.push(loadJs(item))
    })
    cssList.forEach(item => {
      cssPromiseList.push(loadCss(item))
    })
    Promise.all([
      ...cssPromiseList,
      ...jsPromiseList
    ]).then(_ => resolve()).catch(reject)
  })
}
```

### 使用

```js
loadJs('js_url').then(res => ...)
loadCss('css_url').then(res => ...)
asyncLoad(['js_url', ...], ['css_url', ...]).then(res => ...)
```

