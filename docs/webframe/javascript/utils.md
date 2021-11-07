# 常见Js工具方法

### 获取url指定参数

```js
function QueryString(val) {
  var uri = window.location.search;
  var re = new RegExp("[?&]" + val + "=([^&?]*)", "ig");
  return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 2)) : null)
}
```

### 获取url所有参数

```js
function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}
```

### 验证手机号

```js
function checkMobile(mobile) {
  if (mobile === null || mobile.toString() === '') {
    return false
  }
  if ((/^1[34578]\d{9}$/.test(mobile))) {
    return true
  } else {
    return false
  }
}
```

### 时间格式化

```js
function formatDeta(time, formatStr) {
  const date = time ? new Date(time) : new Date()
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  }
  if (/(y+)/.test(formatStr)) formatStr = formatStr.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(formatStr)) formatStr = formatStr.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
  }
  return formatStr
}
```

### 对象克隆

```js
function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}
```

### 根据生日获取年龄

```js
function getAge(birthday) {
  const year = new Date(birthday).getFullYear();
  const curYear = new Date().getFullYear();
  return curYear - year;
}
```

### 查询数组中指定元素下标

```js
function findArray(array, feature, all = true) {
  for (const index in array) {
    const cur = array[index];
    if (feature instanceof Object) {
      let allRight = true;
      for (const key in feature) {
        const value = feature[key];
        if (cur[key] === value && !all) return array[index];
        if (all && cur[key] !== value) {
          allRight = false;
          break;
        }
      }
      if (allRight) return array[index];
    } else {
      if (cur === feature) {
        return array[index];
      }
    }
  }
  return null;
}
```

### 获取昨天

```js
function getYesterDate(time) {
  const date = time ? new Date(time) : new Date();
  date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
  return date;
}
```

### 判断是否为对象

```js
function isPlainObject(obj) {
  return toString.call(obj) === '[object Object]';
}
```

### 判断是否为数组

```js
function isPlainArray(obj) {
  return toString.call(obj) === '[object Array]';
}
```

### 重命名对象key值(下划线转驼峰)

```js
function formatResult(obj) {
  if (!obj) return {};
  let resObj;

  // 防止对象被冻结
  obj = JSON.parse(JSON.stringify(obj));

  if (isPlainArray(obj)) {
    resObj = [];
  } else if (isPlainObject(obj)) {
    resObj = {};
  }

  for (const key of Object.keys(obj)) {
    if (obj.hasOwnProperty(key)) {
      if (isPlainObject(obj[key]) || isPlainArray(obj[key])) {
        resObj[replaceUnderLine(key)] = formatResult(obj[key]);
      } else {
        resObj[replaceUnderLine(key)] = obj[key] || '';
      }
    }
  }

  return resObj;
}
```

### 模版字符串替换

```js
function formatStr(str, ...args) {
  if (str === '') return '';
  for (const i in args) {
    str = str.replace(new RegExp('\\{' + i + '\\}', 'g'), args[i]);
  }
  return str;
}
```

### 获取周数(周一为第一天)

```js
function getNowWeek(date) {
  // 截掉时分秒保留整数天
  date = new Date((date || new Date()).toLocaleDateString());
  // 设置日期为当前周周四
  date.setDate(date.getDate() + (4 - (date.getDay() || 7)));
  const year = date.getFullYear();
  const firstDate = new Date(year, 0, 1);
  firstDate.setDate(firstDate.getDate() + (4 - (firstDate.getDay() || 7)));
  // 当年第一天早于周四 第一周延后七天
  if (firstDate.getFullYear() < year) {
    firstDate.setDate(firstDate.getDate() + 7);
  }
}
```

### 获取字段类型

```js
function getFieldType(field) {
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object',
  };
  return map[toString.call(field)];
}
```

### 判断当前是时分是否在配置的时间范围内

```js
function judgeNowComeWithIn(openTime, closetTime) {
  const currTime = new Date().getTime();
  const openTimes = openTime.split(':'),
    closetTimes = closetTime.split(':');
  if (new Date().setHours(openTimes[0], openTimes[1], 0, 0) < currTime && currTime < new Date().setHours(closetTimes[0], closetTimes[1], 0, 0)) {
    return true;
  }
  return false;
}
```

### 防抖

```js
function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
```

### 移动端计算根元素字体大小

```js
(function (doc, win) {
  var docEl = doc.documentElement,
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    recalc = function () {
      var clientWidth = docEl.clientWidth;
      if (!clientWidth) return;
      docEl.style.fontSize = clientWidth < 640 ? (100 * (clientWidth / 375) + 'px') : "100px";
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);
```

### 自定义异常

```js
function BlogError(code, msg) {
  this.code = code;
  this.message = msg;
}
BlogError.prototype = Object.create(Error.prototype);
BlogError.prototype.constructor = BlogError;
```

### 验证手机号码

```js
function checkMobile(mobile) {
  if (mobile === null || mobile === '') return false;
  if ((/^1[34578]\d{9}$/.test(mobile))) {
    return true;
  } else {
    return false;
  }
}
```

### 获取系统类型

```js
function fetchOS() {
  var sUserAgent = navigator.userAgent;
  var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
  if (isWin) {
    return "win";
  }
  var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
  if (isMac) {
    return "mac";
  }
  var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
  if (isUnix) {
    return "unix"
  }
  return "other";
}
```

### 判断对象数组中是否存在指定键值对

```js
function arrayIsExistKeyValue(arr, key, value) {
  if (arr.length > 0) {
    return arr.some(item => item[key] === value);
  }
  return false;
}
```

### 获取对象数组中指定键值对下标

```js
function getArrayKeyValueIndex(arr, key, value) {
  if (arr.length > 0) {
    return arr.findIndex(item => item[key] === value);
  }
  return -1;
}
```

### 解析`QueryString`参数

```js
function parsingParams(queryString) {
  const params = queryString.split('&');
  const obj = {};
  for (const item of params) {
    const items = item.split('=');
    obj[items[0]] = items[1];
  }
  return obj;
}
```

### 封装`QueryString`参数

```js
function packageParams(obj) {
  let params = ''
  Object.keys(obj).forEach(key => {
    if (obj[key]) params += key + '=' + obj[key] + '&'
  })
  return params.substring(0, params.length - 1)
}
```

### 验证变量类型

```js
const isType = type => obj => Object.prototype.toString.call(obj) === `[object ${type}]`;
```

### 获取cookie

```js
function getCookie(keyName) {
  const reg = new RegExp(`(^| )${keyName}=([^;]*)(;|$)`)
  return document.cookie.match(reg)[2]
}
```

### 时间过滤器(n(秒|分钟|小时|天)前)

```js
function timeFilter(time) {
  if (!time) return ''
  const s = parseInt(new Date().getTime() / 1000 - time)
  if (s < 60) return s + ' secs ago'
  if (s < 3600) return parseInt(s / 60) + ' mins ago'

  if (s < 86400) {
    const hours = parseInt(s / 3600)
    const min = parseInt((s - hours * 3600) / 60)
    if (min >= 1) return `${hours} hr ${min} min ago`
    return hours + ' hrs ago'
  }
  const day = parseInt(s / 86400)
  const hours = parseInt((s - day * 86400) / 3600)
  if (hours >= 1) return `${day} days ${hours} hrs ago`
  return day + ' days ago'
}
```

<Vssue :title="$title" />