# bind、call、apply

## bind
`**bind()**` 方法创建一个新的函数，在 `bind()` 被调用时，这个新函数的 `this` 被指定为 `bind()` 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

### 示例
```javascript
this.name = "window-name"
const person = {
  name: 'person-name',
  getName: function() {
    return this.name;
  }
};
const unboundGetX = person.getName;
const boundGetX = unboundGetX.bind(person);
unboundGetX(); // "window-name"
boundGetX(); // "person-name"
```
```javascript
function Point(x, y) {
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function() {
  return this.x + ',' + this.y;
};

var emptyObj = {};
var YAxisPoint = Point.bind(emptyObj, 0);

var axisPoint = new YAxisPoint(5);
axisPoint.toString(); // '0,5'
axisPoint instanceof Point; // true
axisPoint instanceof YAxisPoint; // true
new YAxisPoint(17, 42) instanceof Point; // true
```

### 语法
```
function.bind(thisArg[, arg1[, arg2[, ...]]])
```

### 参数

- `thisArg`

调用绑定函数时作为 `this` 参数传递给目标函数的值。 如果使用[`new`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new)运算符构造绑定函数，则忽略该值。当使用 `bind` 在 `setTimeout` 中创建一个函数（作为回调提供）时，作为 `thisArg` 传递的任何原始值都将转换为 `object`。如果 `bind` 函数的参数列表为空，或者`thisArg`是`null`或`undefined`，执行作用域的 `this` 将被视为新函数的 `thisArg`。

- `arg1, arg2, ...`

当目标函数被调用时，被预置入绑定函数的参数列表中的参数。

### 返回值
返回一个原函数的拷贝，并拥有指定的 **`this`** 值和初始参数。

### 实现
```javascript
Function.prototype._bind = function (thisArg,...args1) {
  if (typeof this !== 'function') { throw TypeError("Bind must be called on a function"); }
  var self = this,
      nop = function() {},
      bound = function (...args2) {
        return self.apply(this instanceof nop ? this : thisArg,args1.concat(args2);
                          };
  if (this.prototype){
    nop.prototype = this.prototype;
  }
  bound.prototype = new nop();
  return bound;
};
```

## call
`**call()**` 方法使用一个指定的 `this` 值和单独给出的一个或多个参数来调用一个函数。

### 示例
```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}
function Boy(name, age) {
  Person.call(this, name, age);
  this.sex = 'boy';
}
const boy = new Boy('zzcyes', 23);
boy.name; // 'zzcyes'
```

### 语法
```
function.call(thisArg, arg1, arg2, ...)
```

### 参数

- `thisArg`

可选的。在 _`function`_ 函数运行时使用的 `this` 值。请注意，`this`可能不是该方法看到的实际值：如果这个函数处于[非严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)下，则指定为 `null` 或 `undefined` 时会自动替换为指向全局对象，原始值会被包装。

- `arg1, arg2, ...`

指定的参数列表。

### 返回值
使用调用者提供的 `this` 值和参数调用该函数的返回值。若该方法没有返回值，则返回 `undefined`。

### 实现
```javascript
Function.prototype._call = function(thisArg, ...args) { 
  	thisArg = thisArg || this; 
  	const fun = Symbol('fun')
    thisArg[fun] = this; 
    const result = thisArg[fun](...args); 
    delete thisArg[fun];
    return result;
}
```

## apply
**`apply()`** 方法调用一个具有给定`this`值的函数，以及以一个数组（或[类数组对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections#Working_with_array-like_objects)）的形式提供的参数。

### 示例
```javascript
const numbers = [5, 6, 2, 3, 7];
Math.max.apply(null, numbers); // 7
Math.min.apply(null, numbers); // 2
```

### 语法
```
func.apply(thisArg, [argsArray])
```

### 参数

- `thisArg`

必选的。在 _`func`_ 函数运行时使用的 `this` 值。请注意，`this`可能不是该方法看到的实际值：如果这个函数处于[非严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode)下，则指定为 `null` 或 `undefined` 时会自动替换为指向全局对象，原始值会被包装。


- `argsArray`

可选的。一个数组或者类数组对象，其中的数组元素将作为单独的参数传给 `func` 函数。如果该参数的值为 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null) 或  [`undefined`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)，则表示不需要传入任何参数。从ECMAScript 5 开始可以使用类数组对象。 [浏览器兼容性](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply#Browser_compatibility) 请参阅本文底部内容。

### 返回值
调用有指定`**this**`值和参数的函数的结果。

### 实现
```javascript
Function.prototype._apply = function(thisArg, argsArray) { 
  	thisArg = thisArg || this;
    const fun = Symbol('fun')
    thisArg[fun] = this; 
    const result = thisArg[fun](...argsArray); 
    delete thisArg[fun];
    return result;
}
```


