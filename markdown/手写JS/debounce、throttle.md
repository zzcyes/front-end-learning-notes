# debounce、throttle

## 函数防抖(debounce)
如果一个事件被频繁触发多次，并且触发的时间间隔过短，则**防抖函数可以使得对应的事件处理函数只执行最后触发的一次。 函数防抖可以把多个顺序的调用合并成一次。**

任务频繁触发的情况下，只有任务触发的间隔超过指定间隔的时候，任务才会执行。

### 示例

- 用户连续点击按钮提交表单。若不防抖，则会提交多次。加上防抖会在每次点击时重新计时，在最后一次点击后到指定间隔时间表单便会提交。

### 实现

#### 简易版
```typescript
function debounce(fn, wait) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn.apply(this, arguments);
    }, wait);
  };
}
```

#### 是否立即执行
```javascript
function debounce(fn, wait, immediate) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() =>{
            timeout = null;
            if (!immediate) fn.apply(this, arguments);
        }, wait);
        if (immediate && !timeout) fn.apply(this, arguments);
    };
};
```

#### 进阶版
```typescript
function debounce(func, wait, immediate) {
  var timeout, previous, args, result, context;
  var later = function() {
    var passed = new Date().getTime() - previous;
    if (wait > passed) {
      timeout = setTimeout(later, wait - passed);
    } else {
      timeout = null;
      if (!immediate) result = func.apply(context, args);
      // This check is needed because `func` can recursively invoke `debounced`.
      if (!timeout) args = context = null;
    }
  };
  var debounced = function() {
    context = this;
    args = arguments;
    previous = new Date().getTime();
    if (!timeout) {
      timeout = setTimeout(later, wait);
      if (immediate) result = func.apply(context, args);
    }
    return result;
  };
  debounced.cancel = function() {
    clearTimeout(timeout);
    timeout = args = context = null;
  };

  return debounced;
}
```

## 函数节流(throttle)
如果一个事件被频繁触发多次，**节流函数可以按照固定频率去执行对应的事件处理方法**。** 函数节流保证一个事件一定时间内只执行一次**。

指定时间间隔内只会执行一次任务。

### 示例

- 王者荣耀技能释放，每个技能（不讨论二段技能）有固定的冷却时间，在规定的冷却时间内只能释放一次该技能。
- 搜索联想，根据用户输入的信息请求后台查询联想信息。

### 实现

#### 计时器
```typescript
function throttle(fn, wait) {
  let timeout;
  return function () {
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null;
        fn.apply(this, arguments);
      }, wait);
    }
  };
}
```

#### 时间戳
```typescript
function throttle(fn,wait){
    let pre = Date.now();
    return function(){
        let now = Date.now();
        if(now - pre >= wait){
          fn.apply(this,arguments);
          pre = Date.now();
        }
    }
}
```

#### 进阶版
```javascript
function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};
    var later = function () {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    var throttled = function () {
        var _now = new Date().getTime();
        if (!previous && options.leading === false) previous = _now;
        var remaining = wait - (_now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = _now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
    throttled.cancel = function () {
        clearTimeout(timeout);
        previous = 0;
        timeout = context = args = null;
    };
    return throttled;
}
```

## 实战
```html
<!DOCTYPE html>
<html lang="zh-cmn-Hans">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="IE=edge, chrome=1">
    <title>debounce</title>
    <style>
        #container {
            width: 100%;
            height: 200px;
            line-height: 200px;
            text-align: center;
            color: #fff;
            background-color: #444;
            font-size: 30px;
        }
    </style>
</head>
<body>
    <div id="container"></div>
    <script>
        var count = 1;
        var container = document.getElementById('container');
        function getUserAction() {
            container.innerHTML = count++;
        };
        container.onmousemove = getUserAction;
    </script>
</body>
</html>
```

## 资源

- [JS函数节流和函数防抖](https://juejin.cn/post/6844903728328212488)
- [函数防抖和节流](https://juejin.cn/post/6844903651278848014)
- [司徒正美-函数防抖与函数节流](https://zhuanlan.zhihu.com/p/38313717)
- [MDN-window.setTimeout](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setTimeout)
- [Javascript专题之跟着underscore学防抖](https://juejin.cn/post/6844903480239325191)
- [JavaScript专题之跟着 underscore 学节流](https://juejin.cn/post/6844903481761857543)







