# 模块

《JavaScript高级程序设计》第四版笔记。

## 理解模块模式

将代码拆分成独立的块，然后再把这些块连接起来可以通过模块模式来实现。这种模式背后的思想很简单：把逻辑分块，各自封装，相互独立，每个块自行决定对外暴露什么，同时自行决定引入执行哪些外部代码。不同的实现和特性让这些基本的概念变得有点复杂，但这个基本的思想是所有 JavaScript 模块系统的基础。

### 模块标识符

模块标识符是所有模块系统通用的概念。模块系统本质上是键/值实体，其中每个模块都有个可用于引用它的标识符。这个标识符在模拟模块的系统中可能是字符串，在原生实现的模块系统中可能是模块文件的实际路径。

### 模块依赖

模块系统的核心是管理依赖。指定依赖的模块与周围的环境会达成一种契约。本地模块向模块系统声明一组外部模块（依赖），这些外部模块对于当前模块正常运行是必需的。模块系统检视这些依赖，进而保证这些外部模块能够被加载并在本地模块运行时初始化所有依赖。

每个模块都会与某个唯一的标识符关联，该标识符可用于检索模块。这个标识符通常是 JavaScript 文件的路径，但在某些模块系统中，这个标识符也可以是在模块本身内部声明的命名空间路径字符串。

### 模块加载

加载模块的概念派生自依赖契约。当一个外部模块被指定为依赖时，本地模块期望在执行它时，依赖已准备好并已初始化。

在浏览器中，加载模块涉及几个步骤。加载模块涉及执行其中的代码，但必须是在所有依赖都加载并执行之后。如果浏览器没有收到依赖模块的代码，则必须发送请求并等待网络返回。收到模块代码之后，浏览器必须确定刚收到的模块是否也有依赖。然后递归地评估并加载所有依赖，直到所有依赖模块都加载完成。只有整个依赖图都加载完成，才可以执行入口模块。

### 入口

相互依赖的模块必须指定一个模块作为入口（entry point），这也是代码执行的起点。这是理所当然的，因为 JavaScript 是顺序执行的，并且是单线程的，所以代码必须有执行的起点。入口模块也可能依赖其他模块，其他模块同样可能有自己的依赖。于是模块化 JavaScript 应用程序的所有模块会构成依赖图。

模块加载是“阻塞的”，这意味着前置操作必须完成才能执行后续操作。每个模块在自己的代码到达浏览器之后完成加载，此时其依赖已经加载并初始化。

### 异步依赖

因为 JavaScript 可以异步执行，所以如果能按需加载就好了。换句话说，可以让 JavaScript 通知模块系统在必要时加载新模块，并在模块加载完成后提供回调。在代码层面，可以通过下面的伪代码来实现：

```javascript
// 在模块 A 里面
load('moduleB').then(function(moduleB) {
    moduleB.doStuff();
});
```

### 动态依赖

有些模块系统要求开发者在模块开始列出所有依赖，而有些模块系统则允许开发者在程序结构中动态添加依赖。动态添加的依赖有别于模块开头列出的常规依赖，这些依赖必须在模块执行前加载完毕。

下面是动态依赖加载的例子：
```javascript
if (loadCondition) {
    require('./moduleA');
}
```

在这个模块中，是否加载 moduleA 是运行时确定的。加载 moduleA 时可能是阻塞的，也可能导致执行，且只有模块加载后才会继续。无论怎样，模块内部的代码在 moduleA 加载前都不能执行，因为moduleA 的存在是后续模块行为正确的关键。

动态依赖可以支持更复杂的依赖关系，但代价是增加了对模块进行静态分析的难度。

### 静态分析

模块中包含的发送到浏览器的 JavaScript 代码经常会被静态分析，分析工具会检查代码结构并在不实际执行代码的情况下推断其行为。对静态分析友好的模块系统可以让模块打包系统更容易将代码处理为较少的文件。它还将支持在智能编辑器里智能自动完成。

更复杂的模块行为，例如动态依赖，会导致静态分析更困难。不同的模块系统和模块加载器具有不同层次的复杂度。至于模块的依赖，额外的复杂度会导致相关工具更难预测模块在执行时到底需要哪些依赖。

### 循环依赖

要构建一个没有循环依赖的 JavaScript 应用程序几乎是不可能的，因此包括 CommonJS、AMD 和ES6 在内的所有模块系统都支持循环依赖。在包含循环依赖的应用程序中，模块加载顺序可能会出人意料。不过，只要恰当地封装模块，使它们没有副作用，加载顺序就应该不会影响应用程序的运行。

## 凑合的模块系统

ES6 之前的模块有时候会使用函数作用域和立即调用函数表达式（IIFE，Immediately Invoked Function Expression）将模块定义封装在匿名闭包中。

```javascript
(function() {
    // 私有 Foo 模块的代码
    console.log('bar');
})();

// bar
```

为了暴露公共 API，模块 IIFE 会返回一个对象，其属性就是模块命名空间中的公共成员：

```javascript
var Foo = (function() {
    return {
        bar: 'baz',
        baz: function() {
            console.log(this.bar);
        }
    };
})();
console.log(Foo.bar); // 'baz'
Foo.baz(); // 'baz'
```

类似地，还有一种模式叫作“泄露模块模式”（revealing module pattern）。这种模式只返回一个对象，其属性是私有数据和成员的引用：

```javascript
var Foo = (function() {
    var bar = 'baz';
    var baz = function() {
        console.log(bar);
    };
    return {
        bar: bar,
        baz: baz
    };
})();
console.log(Foo.bar); // 'baz'
Foo.baz(); // 'baz'
```

## ES6之前的模块加载器

在 ES6 原生支持模块之前，使用模块的 JavaScript 代码本质上是希望使用默认没有的语言特性。因此，必须按照符合某种规范的模块语法来编写代码，另外还需要单独的模块工具把这些模块语法与JavaScript 运行时连接起来。这里的模块语法和连接方式有不同的表现形式，通常需要在浏览器中额外加载库或者在构建时完成预处理。

### CommonJS

CommonJS 规范概述了**同步声明依赖的模块定义**。这个规范主要用于在**服务器端实现模块化代码组织**，但**也可用于定义在浏览器中使用的模块依赖**。CommonJS 模块语法**不能在浏览器中直接运行**。

注意：NodeJS使用了CommonJS（轻微修改，不考虑网络延迟）

指定依赖用`require()`，使用`exports`对象定义公共API:

```javascript
var moduleB = require('./moduleB');

module.exports = {
    stuff: moduleB.doStuff();
};
```

moduleA 通过使用模块定义的**相对路径**来指定自己对 moduleB 的依赖。

什么是“模块定义”，以及如何将字符串解析为模块，完全**取决于模块系统的实现**。比如在 Node.js中，模块标识符可能指向文件，也可能指向包含 index.js文件的目录。

无论一个模块在 `require()` 中被引用多少次，**模块永远是单例**。

模块**第一次加载后会被缓存**，后续加载会取得缓存的模块（如下代码所示）。模块加载顺序由依赖
图决定。

在 `CommonJS` 中，模块加载是模块系统执行的**同步操作**。

```javascript
console.log('moduleA');
if (loadCondition) {
    require('./moduleA');
}
```

### 异步模块定义（AMD）

异步模块定义（AMD，Asynchronous Module Definition）的模块定义系统则以**浏览器为目标执行环境**，这需要考虑**网络延迟**的问题。

AMD 的一般策略是让模块声明自己的依赖，而运行在浏览器中的模块系统会按需获取依赖，并在依赖加载完成后立即执行依赖它们的模块。

AMD 模块实现的核心是用**函数包装模块定义**。这样可以**防止声明全局变量**，并允许**加载器库控制何时加载模块**。包装函数也便于**模块代码的移植**，因为包装函数内部的所有模块代码使用的都是原生JavaScript 结构。包装模块的函数是全局 define 的参数，它是由 AMD 加载器库的实现定义的。

AMD 模块可以**使用字符串标识符指定自己的依赖**，而 AMD 加载器会在所有依赖模块加载完毕后立即调用模块工厂函数。

与 CommonJS 不同，AMD 支持**可选地为模块指定字符串标识符**。

```javascript
// ID 为'moduleA'的模块定义。moduleA 依赖 moduleB，
// moduleB 会异步加载
define('moduleA', ['moduleB'], function(moduleB) {
    return {
        stuff: moduleB.doStuff();
    };
});
```

### 通用模块定义（UMD）

为了统一 CommonJS 和 AMD 生态系统，通用模块定义（UMD，Universal Module Definition）规范应运而生。

本质上，UMD 定义的模块会在启动时检测要使用哪个模块系统，然后进行适当配置，并把所有逻辑包装在一个立即调用的函数表达式（IIFE）中。虽然这种组合并不完美，但在很多场景下足以实现两个生态的共存。

下面是只包含一个依赖的 UMD 模块定义的示例（来源为 GitHub 上的 UMD 仓库）：

```javascript
(function (root, factory) {
if (typeof define === 'function' && define.amd) {
    // AMD。注册为匿名模块
    define(['moduleB'], factory);
} else if (typeof module === 'object' && module.exports) {
    // Node。不支持严格 CommonJS
    // 但可以在 Node 这样支持 module.exports 的
    // 类 CommonJS 环境下使用
    module.exports = factory(require(' moduleB '));
} else {
    // 浏览器全局上下文（root 是 window）
    root.returnExports = factory(root. moduleB);
}
}(this, function (moduleB) {
    // 以某种方式使用 moduleB
    // 将返回值作为模块的导出
    // 这个例子返回了一个对象
    // 但是模块也可以返回函数作为导出值
    return {};
}));
```

此模式有支持严格 CommonJS 和浏览器全局上下文的变体。不应该期望手写这个包装函数，它应该由构建工具自动生成。开发者只需专注于模块的内由容，而不必关心这些样板代码。

### 模块加载其终将没落

随着 ECMAScript 6 模块规范得到越来越广泛的支持，本节展示的模式最终会走向没落。

CommonJS 与 AMD 之间的冲突正是我们现在享用的 ECMAScript 6 模块规范诞生的温床。

## ES6模块

ES6 最大的一个改进就是**引入了模块规范**。这个规范全方位简化了之前出现的模块加载器，原生浏览器支持意味着加载器及其他预处理都不再必要。从很多方面看，ES6 模块系统是集 AMD 和 CommonJS之大成者。

### 模块标签及定义

ECMAScript 6 模块是作为**一整块 JavaScript 代码而存在**的。带有 `type="module"` 属性的 `<script>`标签会告诉浏览器相关代码应该**作为模块执行，而不是作为传统的脚本执行**。模块可以嵌入在网页中，也可以作为外部文件引入：

```js
// <!-- 模块代码 -->
<script type="module"></script>
<script type="module" src="path/to/myModule.js"></script>
```

与传统脚本不同，所有模块都会像 `<script defer>` 加载的脚本一样按顺序执行。

解析到 `<script type="module">` 标签后会立即下载模块文件，但执行会延迟到文档解析完成。无论对嵌入的模块代码，还是引入的外部模块文件，都是这样。

 `<script type="module">` 在页面中出现的顺序就是它们执行的顺序。

 与 `<script defer>` 一样，修改模块标签的位置，无论是在 `<head>` 还是在 `<body>` 中，只会影响文件什么时候加载，而不会影响模块什么时候加载。

```javascript
// <!-- 第二个执行 -->
<script type="module"></script>
// <!-- 第三个执行 -->
<script type="module"></script>
// <!-- 第一个执行 -->
<script></script>
 ```

 也可以给模块标签添加 async 属性。这样影响就是双重的：不仅模块执行顺序不再与 `<script>` 标签在页面中的顺序绑定，模块也不会等待文档完成解析才执行。不过，入口模块仍必须等待其依赖加载完成。

同一个模块无论在一个页面中被加载多少次，也不管它是如何加载的，实际上都**只会加载一次**。

### 模块加载

ECMAScript 6 模块的独特之处在于，既可以通过浏览器原生加载，也可以与第三方加载器和构建工具一起加载。

完全支持 ECMAScript 6 模块的浏览器可以从顶级模块加载整个依赖图，且是异步完成的。

这种加载方式效率很高，也不需要外部工具，但加载大型应用程序的深度依赖图可能要花费很长时间。

### 模块行为

ECMAScript 6模块借用了 CommonJS 和 AMD 的很多优秀特性。下面简单列举一些。

- 模块代码只在加载后执行。

- 模块只能加载一次。

- 模块是单例。

- 模块可以定义公共接口，其他模块可以基于这个公共接口观察和交互。

- 模块可以请求加载其他模块。

- 支持循环依赖。

ES6 模块系统也增加了一些新行为。

- ES6 模块默认在严格模式下执行。

- ES6 模块不共享全局命名空间。

- 模块顶级 this 的值是 undefined （常规脚本中是 window ）。

- 模块中的 var 声明不会添加到 window 对象。

- ES6 模块是异步加载和执行的。

浏览器运行时在知道应该把某个文件当成模块时，会有条件地按照上述 ECMAScript 6 模块行为来施加限制。与 `<script type="module">` 关联或者通过 `import` 语句加载的 JavaScript文件会被认定为模块。

### 模块导出

export 关键字用于声明一个值为命名导出。导出语句必须在**模块顶级**，不能嵌套在某个块中：

```javascript
// 允许
export ...
// 不允许
if (condition) {
    export ...
}
 ```

导出值对模块内部 JavaScript 的执行没有直接影响，因此 export 语句与导出值的相对位置或者export 关键字在模块中出现的顺序没有限制。

```js
// 允许
const foo = 'foo';
export { foo };
// 允许
export const foo = 'foo';
// 允许，但应该避免
export { foo };
const foo = 'foo';
```

**命名导出（named export）** 就好像模块是被导出值的容器。

```js
export const foo = 'foo';
```

**变量声明跟导出可以不在一行**。可以在 export 子句中执行声明并将标识符导出到模块的其他地方：

```js
const foo = 'foo';
export { foo };
```

**导出时也可以提供别名**，别名必须在 export 子句的大括号语法中指定。

```js
const foo = 'foo';
export { foo as myFoo };
```

因为 ES6 命名导出可以将模块作为容器，所以可以**在一个模块中声明多个命名导出**。

```js
export const foo = 'foo';
export const bar = 'bar';
export const baz = 'baz';
```

ES6 模块也支持对导出声明分组，可以**同时为部分或全部导出值指定别名**：

```js
const foo = 'foo';
const bar = 'bar';
const baz = 'baz';
export { foo, bar as myBar, baz };
```

**默认导出（default export）** 就好像模块与被导出的值是一回事。

```js
const foo = 'foo';
export default foo;
```

ES6 模块系统**会识别作为别名提供的 default 关键字**

```js
const foo = 'foo';
// 等同于 export default foo;
export { foo as default };
```

因为**命名导出和默认导出不会冲突**，所以 ES6 支持在一个模块中同时定义这两种导出：

```js
const foo = 'foo';
const bar = 'bar';
export { bar };
export default foo;
```

这两个 export 语句可以组合为一行：

```js
const foo = 'foo';
const bar = 'bar';
export { foo as default, bar };
```

一般来说，声明、赋值和导出标识符最好分开。这样就不容易搞错了，同时也可以让 export 语句集中在一块。

```js
// 命名行内导出
export const baz = 'baz';
export const foo = 'foo', bar = 'bar';
export function foo() {}
export function* foo() {}
export class Foo {}

// 命名子句导出
export { foo };
export { foo, bar };
export { foo as myFoo, bar };

// 默认导出
export default 'foo';
export default 123;
export default /[a-z]*/;
export default { foo: 'foo' };
export { foo, bar as default };
export default foo
export default function() {}
export default function foo() {}
export default function*() {}
export default class {}

// 会导致错误的不同形式：

// 行内默认导出中不能出现变量声明
export default const foo = 'bar';

// 只有标识符可以出现在 export 子句中
export { 123 as foo }

// 别名只能在 export 子句中出现
export const foo = 'foo' as myFoo;
```

### 模块导入

模块可以通过使用 import 关键字使用其他模块导出的值。与 export 类似， import 必须出现在**模块的顶级**：

```js
// 允许
import ...
// 不允许
if (condition) {
    import ...
}
```

import 语句被提升到模块顶部。因此，与 export 关键字类似， import 语句与使用导入值的语句的相对位置并不重要。

```js
// 允许
import { foo } from './fooModule.js';
console.log(foo); // 'foo'

// 允许，但应该避免
console.log(foo); // 'foo'
import { foo } from './fooModule.js';
```

**模块标识符可以是相对于当前模块的相对路径**，也可以是**指向模块文件的绝对路径**。它必须**是纯字符串，不能是动态计算的结果**。例如，不能是拼接的字符串。

如果在**浏览器中通过标识符原生加载模块，则文件必须带有.js 扩展名**，不然可能无法正确解析。不过，如果是通过构建工具或第三方模块加载器打包或解析的 ES6 模块，则可能不需要包含文件扩展名。

不是必须通过导出的成员才能导入模块。如果不需要模块的特定导出，但仍想加载和执行模块以利用其副作用，可以只通过路径加载它：

```js
import './foo.js';
```

**导入对模块而言是只读的，实际上相当于 const 声明的变量**。在使用 * 执行批量导入时，赋值给别名的命名导出就好像使用 `Object.freeze()` 冻结过一样。直接修改导出的值是不可能的，但**可以修改导出对象的属性**。同样，也不能给导出的集合添加或删除导出的属性。要修改导出的值，必须使用有内部变量和属性访问权限的导出方法。

```js
import foo, * as Foo './foo.js';
foo = 'foo'; // 错误
Foo.foo = 'foo'; // 错误
foo.bar = 'bar'; // 允许
```

命名导出和默认导出的区别也反映在它们的导入上。命名导出可以使用 * 批量获取并赋值给保存导
出集合的别名，而无须列出每个标识符：

```js
const foo = 'foo', bar = 'bar', baz = 'baz';
export { foo, bar, baz }
import * as Foo from './foo.js';
console.log(Foo.foo); // foo
console.log(Foo.bar); // bar
console.log(Foo.baz); // baz
```

**要指名导入，需要把标识符放在 import 子句中。** 使用 import 子句可以为导入的值指定别名：

```js
import { foo, bar, baz as myBaz } from './foo.js';
console.log(foo); // foo
console.log(bar); // bar
console.log(myBaz); // baz
```

**默认导出就好像整个模块就是导出的值一样。** 可以使用 default 关键字并提供别名来导入。也可以不使用大括号，此时指定的标识符就是默认导出的别名：

```js
// 等效
import { default as foo } from './foo.js';
import foo from './foo.js';
```

如果模块**同时导出了命名导出和默认导出，则可以在 import 语句中同时取得它们**。可以依次列出特定导出的标识符来取得，也可以使用 * 来取得：

```js
import foo, { bar, baz } from './foo.js';
import { default as foo, bar, baz } from './foo.js';
import foo, * as Foo from './foo.js';
```

### 模块转移导出

模块导入的值可以直接通过管道转移到导出。

```js
// foo.js
export const baz = 'origin:foo';

// bar.js
export * from './foo.js';
export const baz = 'origin:bar';

// main.js
import { baz } from './bar.js';
console.log(baz); // origin:bar
```
此外也可以明确列出要从外部模块转移本地导出的值。该语法支持使用别名：

```js
export { foo, bar as myBar } from './foo.js';
```

类似地，外部模块的默认导出可以重用为当前模块的默认导出：

```js
export { default } from './foo.js';
```

这样不会复制导出的值，只是把导入的引用传给了原始模块。在原始模块中，导入的值仍然是可用的，与修改导入相关的限制也适用于再次导出的导入。在重新导出时，还可以在导入模块修改命名或默认导出的角色。比如，可以像下面这样将命名导出指定为默认导出：

```js
export { foo as default } from './foo.js';
```

### 工作者模块

ECMAScript 6 模块与 Worker 实例完全兼容。在实例化时，可以给工作者传入一个指向模块文件的路径，与传入常规脚本文件一样。 Worker 构造函数接收第二个参数，用于说明传入的是模块文件。

下面是两种类型的 Worker 的实例化行为：

```js
// 第二个参数默认为{ type: 'classic' }
const scriptWorker = new Worker('scriptWorker.js');
const moduleWorker = new Worker('moduleWorker.js', { type: 'module' });
```

在基于模块的工作者内部， self.importScripts() 方法通常用于在基于脚本的工作者中加载外部脚本，调用它会抛出错误。这是因为模块的 import 行为包含了 importScripts() 。

### 向后兼容

ECMAScript 模块的兼容是个渐进的过程，能够同时兼容支持和不支持的浏览器对早期采用者是有价值的。

```js
// 支持模块的浏览器会执行这段脚本
// 不支持模块的浏览器不会执行这段脚本
<script type="module" src="module.js"></script>

// 支持模块的浏览器不会执行这段脚本
// 不支持模块的浏览器会执行这段脚本
<script nomodule src="script.js"></script>
```
