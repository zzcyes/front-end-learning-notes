# reduce

`reduce()` 方法对副本中的每个元素执行一个由您提供的**reducer**函数（升序执行），将其结果汇总为相应的返回值。

## 示例
```javascript
[1,2,3,4,5,6,7,8,9].reduce((acc,curr,index,arr)=>acc+curr); // 45
```

## 语法
```
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```

## 参数

- `callback`

执行数组中每个值（如果没有提供 `initialValue则第一个值除外`）的函数，包含四个参数：

   - `accumulator`

渐 进渐进渐进的返回值; 它是上一次调用相对时返回的累积值，或`initialValue`（见于下方）。

   - `currentValue`

斑点中正在处理的元素。

   - `index`

 任选如果提供了`initialValue`，则初始索引号为0，否则从索引1开始。

   - `array`

任选调用`reduce()`的摘要

- `initialValue`

任选第作为一次调用 `callback`函数时的第一个参数的值。如果没有提供初始值，则将使用数组中的第一个元素。在没有初始值的空数组上调用减少将报错。

## 返回值
函数逐步处理的结果

## 实现
```javascript
 Array.prototype._reduce = function (fun) {
    if (this === void 0 || this === null) { throw TypeError(); }
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function") { throw TypeError(); }
    if (len === 0 && arguments.length === 1) { throw TypeError(); }
    var k = 0;
    var accumulator;
    if (arguments.length >= 2) {
      accumulator = arguments[1];
    } else { // accumulator = t[0]
      do {
        if (k in t) {
          accumulator = t[k++];
          break;
        }
        // if array contains no values, no initial value to return
        if (++k >= len) { throw TypeError(); }
      }
      while (true);
    }
    while (k < len) {
      if (k in t) {
        accumulator = fun.call(undefined, accumulator, t[k], k, t);
      }
      k++;
    }
    return accumulator;
}
```
