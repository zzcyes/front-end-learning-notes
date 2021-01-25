# new-operator

**`new` 运算符**创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。

## 示例
```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}
const boy = new Person('zzcyes', 23);
boy.name; // 'zzcyes'
```

## 语法
```
new constructor[([arguments])]
```

## 参数

- `constructor`

一个指定对象实例的类型的类或函数。

- `arguments`

一个用于被 `constructor` 调用的参数列表。

## 描述
new 关键字会进行如下的操作：

1. 创建一个空的简单JavaScript对象（即**`{}`**）；
1. 链接该对象（设置该对象的**`constructor`**）到另一个对象 ；
1. 将步骤1新创建的对象作为**`this`**的上下文 ；
1. 如果该函数没有返回对象，则返回**`this`**。


创建一个用户自定义的对象需要两步：

1. 通过编写函数来定义对象类型。
1. 通过 new 来创建对象实例。

创建一个对象类型，需要创建一个指定其名称和属性的函数；对象的属性可以指向其他对象。

当代码 `new _Foo_(...)` 执行时，会发生以下事情：

1. 一个继承自 `_Foo_.prototype` 的新对象被创建。
1. 使用指定的参数调用构造函数 _`Foo`_，并将 `[this](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)` 绑定到新创建的对象。`new _Foo_` 等同于 _`new Foo`_`()`，也就是没有指定参数列表，_`Foo`_ 不带任何参数调用的情况。
1. 由构造函数返回的对象就是 `new` 表达式的结果。如果构造函数没有显式返回一个对象，则使用步骤1创建的对象。（一般情况下，构造函数不返回值，但是用户可以选择主动返回对象，来覆盖正常的对象创建步骤）

## 实现
```javascript
function _new (fn, ...args) {
  if (typeof fn !== 'function') {
    throw 'not a function';
  }
  const obj = {};
  obj.__proto__ = fn.prototype;
  // const obj = Object.create(fn.prototype);  // 合并1、2步 
  const result = fn.call(obj, ...args);
  return typeof result === 'object' ? result : obj;
}
```
## 疑问

### Q：对象的__proto__属性纳入规范吗？


