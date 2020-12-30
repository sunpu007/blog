# 代码片段

> 手写new

```js
function myNew(fn, ...args) {
  // 判断是否为方法
  if (typeof fn !== 'function') throw '第一个参数必须为方法'

  const tempObj = {};

  // 继承原型
  tempObj.__proto__ = Object.create(fn.prototype)

  const result = fn.apply(tempObj, args);
  
  const isObject = typeof result === 'object' && result != null
  const isFunction = typeof result === 'function'

  return isObject || isFunction ? result : tempObj;
}
```

> 手写Bind

```js
Function.prototype.myBind = function(context) {
  if (typeof context === "undefined" || context === null) {
    context = window;
  }
  const self = this;
  return function() {
    return self.apply(context, arguments);
  };
}
```

> 实现函数柯里化

```js
const createCurry = (fn, ...args) => {
  const arr = args || [];
  const length = fn.length;

  return (...res) => {
    const newArr = arr.splice(0);
    newArr.push(...res);
    if (res.length > 0 || newArr.length < length) {
      return createCurry.call(this, fn, ...newArr);
    } else {
      return fn.apply(this, newArr);
    }
  }
}
```

<Vssue :title="$title" />
