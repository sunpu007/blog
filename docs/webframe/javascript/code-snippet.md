# 代码片段

### 手写new

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

### 手写Bind

```js
Function.prototype.myBind = function(context, ...argArray) {
  var fn = this
  context = (context !== null && context !== undefined) ? Object(context): window

  return function(...args) {
    context.fn = fn
    var finalArgs = argArray.concat(args)
    var result = context.fn(...finalArgs)
    delete context.fn

    return result
  }
}
```

### 手写apply

```js
Function.prototype.myApply = function(context, ...args) {
  var fn = this
  context = (context !== null && context !== undefined) ? Object(context): window

  context.fn = fn
  argArray = argArray || []
  var result = context.fn(...argArray)
  delete context.fn

  return result
}
```

### 手写call

```js
Function.prototype.myCall = function(context, ...args) {
  var fn = this
  context = (context !== null && context !== undefined) ? Object(context): window

  context.fn = fn
  var result = context.fn(...args)
  delete context.fn

  return result
}
```

### 实现函数柯里化

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
