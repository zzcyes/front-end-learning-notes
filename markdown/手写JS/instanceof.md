# instanceof

**`instanceof`** **运算符**用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

## 示例
```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}
const boy = new Person('zzcyes', 23);
boy.name; // 'zzcyes'

boy instanceof Person; // true
boy instanceof Object; // true
```

## 语法
```
object instanceof constructor
```

## 参数

- `object`

某个实例对象

- `constructor`

某个构造函数

## 描述
`instanceof` 运算符用来检测 `constructor.prototype `是否存在于参数 `object` 的原型链上。

## 注意

- instanceof和多全局对象（例如：多个frame或多个window之间的交互）

在浏览器中，我们的脚本可能需要在多个窗口之间进行交互。多个窗口意味着多个全局环境，不同的全局环境拥有不同的全局对象，从而拥有不同的内置类型构造函数。这可能会引发一些问题。
```javascript
[] instanceof window.frames[0].Array; // false
// Array.prototype !== window.frames[0].Array.prototype  // 并且数组从前者继承。

```

## 实现
```javascript
function _instanceof(obj, ctor) {
    if(typeof obj !== 'object' || constructor === null) return false;
    let objProto = obj.__proto__,
        ctorProto = ctor.prototype;
    while (true) {
      if (objProto === null) {
        return false;
      }
      if (objProto === ctorProto) {
        return true;
      }
      objProto = objProto.__proto__
    }
}
```

## 扩展

- **Symbol.hasInstance**

用于判断某对象是否为某构造器的实例。因此你可以用它自定义 [`instanceof`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/instanceof) 操作符在某个类上的行为。
```java
class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}
[] instanceof MyArray; // true
```

## 资源

- [MDN-Symbol.hasInstance](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/hasInstance)
