# 实现一个Toast

通常我们看到的`Vue`相关文章都是讲Vue单文件组件开发页面。单一组件开发的文章相对较少，所以写了一个`Toast`组件作为记录，总共涉及三个文件。

v-toast.js

```javascript
import Vue from 'vue'

const ToastConstructor = Vue.extend({
  template: `<transition name="dialog-fade"><div class="v-toast" v-if="show"><span>{{massage}}</span></div></transition>`
})
const Toast = (massage, duration = 1500) => {
  let _t = new ToastConstructor({
    el: document.createElement('div'),
    data () {
      return {
        massage: massage,
        show: true
      }
    }
  })
  document.body.appendChild(_t.$el)
  let time = setTimeout(() => {
    _t.show = false
    clearTimeout(time)
    document.body.removeChild(_t.$el)
    _t.$destroy()
  }, duration)
}

export default Toast
```

main.js

```javascript
import Toast from './v-toast.js'

Vue.prototype.VToast = Toast
```

v-toast.scss

```javascript
.v-toast {
  width: 100%;
  position: fixed;
  top: 50%;
  left: 0;
  z-index: 1000;
  text-align: center;
  span {
    display: inline-block;
    max-width: 80%;
    font-size: 26px;
    color: white;
    background: rgba(0, 0, 0, .5);
    padding: 10px 30px;
    border-radius: 15px;
  }
}
```

> 使用

```javascript
Vue.VToast('massage', 1500)
```