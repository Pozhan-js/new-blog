---
category: JS
cover: https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg
---

# JS 基础知识

## 作用域与作用域

### 词法作用域

词法作用域（lexical scoping）是由你在写代码时把变量和块作用域写在哪里来决定的，因此，词法作用域是由你写代码时嵌套函数的位置来决定的。

词法作用域是静态的作用域，由写代码时函数声明的位置来决定。

词法作用域在 JavaScript 中有广泛的应用场景，包括：

- 变量访问控制：词法作用域使得我们可以控制变量的可见性和访问权限，避免命名冲突和变量污染。
- 模块化开发：通过使用函数和闭包，可以实现模块化的代码组织，将变量和函数封装在私有作用域中，提供了良好的封装性和代码组织性。
- 函数嵌套：函数嵌套是 JavaScript 中常见的编程模式，词法作用域确保了内部函数可以访问外部函数的变量，实现了信息的隐藏和封装。

### 动态作用域

动态作用域（dynamic scoping）是在运行时根据函数调用栈来决定的。

动态作用域是动态的作用域，由调用函数的位置来决定。

```ts
var value = 1;

function foo() {
  console.log(value);
}

function bar() {
  var value = 2;
  foo();
}

bar(); // 输出 1
```

### 作用域链

作用域链是 JavaScript 中用于查找变量的一种机制。它由当前作用域和所有父级作用域的变量对象组成。当访问一个变量时，JavaScript 引擎会首先在当前作用域的变量对象中查找，如果找不到，则沿着作用域链向上查找，直到找到变量或者到达全局作用域。

作用域链的构建顺序是：

- 函数声明：函数声明会被添加到当前作用域的变量对象中。
- 变量声明：变量声明会被添加到当前作用域的变量对象中，如果变量名已经存在，则不会覆盖原有的值。

作用域链的查找顺序是：

- 当前作用域的变量对象。
- 父级作用域的变量对象。
- 全局作用域的变量对象。

```ts
     Global Execution Context
     |
     +-- Function Execution Context 1
     |      |
     |      +-- Function Execution Context 2
     |             |
     |             +-- Function Execution Context 3
     |
     +-- Function Execution Context 4
```

示例:

```ts
var globalVariable = "Global";

function outer() {
  var outerVariable = "Hello";

  function inner() {
    var innerVariable = "World";
    console.log(globalVariable + " " + outerVariable + " " + innerVariable);
  }

  inner();
}

outer(); // 输出: Global Hello World
```

### 闭包

闭包（closure）是 JavaScript 中的一种特殊用法，它使得函数可以访问并操作外部函数的变量。闭包的实现原理是，在函数内部定义一个函数，该内部函数可以访问外部函数的变量，并且返回该内部函数。这样，外部函数的变量就变成了一个闭包，可以在内部函数中被访问和操作。

闭包的优点：

- 可以在函数外部访问函数内部的变量，实现数据的缓存和封装。
- 可以在函数外部修改函数内部的变量，实现对函数内部状态的控制。

闭包的缺点：

- 闭包会使得函数中的变量无法被垃圾回收机制回收，会占用更多的内存空间。
- 滥用闭包可能会导致性能问题，影响代码的执行效率。

示例:

```ts
function createCounter() {
  var count = 0;
  return function () {
    count++;
    console.log(count);
  };
}

var counter = createCounter();
counter(); // 输出: 1
counter(); // 输出: 2
counter(); // 输出: 3
```

### 总结

作用域、作用域链和闭包是 JavaScript 中重要的概念，它们相互关联，共同构建了 JavaScript 的变量访问和代码组织机制。理解这些概念的原理和应用场景对于编写高质量的 JavaScript 代码至关重要。

通过词法作用域，我们可以控制变量的可见性和访问权限，实现模块化的代码组织，避免命名冲突和变量污染。

作用域链决定了变量的查找顺序，使得 JavaScript 可以正确地找到并访问变量。同时，作用域链的特性也为闭包的创建提供了基础，通过闭包，我们可以创建私有变量，实现模块化的代码组织以及延迟执行函数等。

深入理解作用域、作用域链和闭包，能够帮助我们更好地编写可维护、高效的 JavaScript 代码。

## 执行上下文与闭包

在 JavaScript 中，执行上下文（execution context）是一个关键概念，与闭包（closure）密切相关。理解执行上下文如何与闭包交互可以帮助我们深入理解闭包的工作原理和行为。

执行上下文是 JavaScript 代码执行时的环境。它包含了变量、函数声明、作用域链等信息，用于管理和跟踪代码的执行过程。当一个函数被调用时，就会创建一个新的执行上下文。每个执行上下文都有自己的词法环境（Lexical Environment），用于存储变量和函数的声明。

在理解闭包之前，让我们先了解一下执行上下文的创建和销毁过程。当函数被调用时，会创建一个新的执行上下文，并将其推入执行上下文栈（execution context stack）中。当函数执行完毕后，其执行上下文会从栈中弹出并销毁。

现在，让我们通过一个例子来更具体地了解执行上下文和闭包之间的关系：

```ts
function outerFunction(outerVariable) {
  function innerFunction(innerVariable) {
    console.log("outerVariable:", outerVariable);
    console.log("innerVariable:", innerVariable);
  }
  return innerFunction;
}

var newFunction = outerFunction("outside");
newFunction("inside"); // 输出: outerVariable: outside innerVariable: inside
```

在这个例子中，当调用 outerFunction 时，会创建一个新的执行上下文，其中包含了 outerVariable 参数和 innerFunction 函数声明。然后，outerFunction 返回了 innerFunction，并将其赋值给变量 newFunction。

现在让我们来看看闭包是如何形成的。当 innerFunction 被返回时，它会携带其词法环境（包含 outerVariable）一起返回。这意味着 innerFunction 保持对 outerVariable 的引用，即使 outerFunction 执行完毕并且其执行上下文已经销毁。

这就是闭包的力量所在。它允许内部函数（innerFunction）访问其词法环境中的变量（outerVariable），即使这些变量在其创建时的执行上下文已经不存在。

在这个例子中，newFunction 就是一个闭包。它引用了外部函数 outerFunction 的词法环境，其中包含了 outerVariable 变量。因此，当我们调用 newFunction 时，它可以访问并打印出 outerVariable 和 innerVariable 的值。

执行上下文和闭包的关系是密不可分的。闭包是由执行上下文中的变量引用形成的，而这些变量保留在闭包的作用域中。这使得闭包能够在函数执行完成后继续访问这些变量，实现了 JavaScript 中非常重要的特性。

理解执行上下文和闭包的交互对于编写复杂的 JavaScript 代码非常重要。它有助于我们更好地理解作用域、变量的生命周期以及如何正确使用闭包来解决问题。同时，它也帮助我们避免一些潜在的问题，如内存泄漏和不必要的资源消耗。

## 闭包应用场景

### 数据封装和私有性

闭包可以用于创建私有变量，将变量隐藏在函数作用域内部，从而实现数据的封装和私有性。通过闭包，我们可以控制变量的访问权限，只暴露需要暴露的接口。这种封装机制可以防止外部代码直接访问和修改内部数据，增加代码的安全性。

```ts
function createCounter() {
  let count = 0;
  return {
    increment: function () {
      count++;
    },
    decrement: function () {
      count--;
    },
    getCount: function () {
      return count;
    },
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.getCount()); // 输出: 2
```

在这个例子中，createCounter 函数返回一个对象，该对象包含了三个闭包函数，分别用于增加计数、减少计数和获取计数值。通过闭包，我们可以将 count 变量隐藏在函数内部，并通过闭包函数来操作和访问这个变量。

### 模块化编程

闭包可以用于实现模块化编程，将相关的变量和函数组织在一个闭包内部，形成一个模块。这样可以避免全局命名冲突，提供命名空间，并且允许模块内部的函数相互调用和共享数据。

```ts
var myModule = (function () {
  var privateVariable = "私有变量";

  function privateFunction() {
    console.log("私有函数");
  }

  return {
    publicMethod: function () {
      console.log(privateVariable);
    },
    publicFunction: function () {
      privateFunction();
    },
  };
})();

myModule.publicMethod(); // 输出: 私有变量
myModule.publicFunction(); // 输出: 私有函数
```

在这个例子中，我们使用了立即调用函数表达式（IIFE）来创建一个闭包，形成一个独立的模块。模块内部的变量和函数对外部是不可见的，只有通过公共接口才能访问。

### 回调函数和事件处理

闭包常常用于处理回调函数和事件处理，特别是在异步编程中。由于闭包的特性，它可以捕获外部函数的上下文，并在内部函数被调用时保留这个上下文，从而实现对异步操作的响应。

```ts
function fetchData(url, callback) {
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      callback(data);
    });
}

function processData(data) {
  console.log(data);
}

fetchData("https://api.example.com/data", processData);
```

在这个例子中，fetchData 函数通过闭包捕获了 processData 函数作为回调函数。当异步操作完成时，它会调用回调函数并传递数据给它。闭包保持了回调函数的上下文，使得回调函数可以访问外部的 processData 函数。

### 缓存和记忆化

闭包还可以用于实现缓存和记忆化功能。通过闭包，我们可以在函数内部维护一个缓存，避免重复计算相同的结果，提高函数执行的性能。

```ts
function memoizedFunction() {
  var cache = {};
  return function (arg) {
    if (cache[arg]) {
      return cache[arg];
    }
    // 计算结果
    var result = // ...
      (cache[arg] = result);
    return result;
  };
}

var memoized = memoizedFunction();
console.log(memoized("value")); // 第一次计算并缓存结果
console.log(memoized("value")); // 直接从缓存中读取结果
```

在这个例子中，memoizedFunction 返回一个闭包函数，用于记忆化计算结果。闭包内部维护了一个缓存对象 cache，当输入相同的参数时，直接从缓存中读取结果，避免重复计算。

闭包在 JavaScript 中有许多其他的应用场景，如实现延迟执行、函数柯里化、实现迭代器等。了解闭包的应用场景可以帮助我们写出更加优雅、高效的代码，并利用闭包的强大能力解决问题。

### 闭包的优缺点

当谈到闭包的缺点时，主要涉及内存消耗、内存泄漏和性能影响。下面是一些代码示例，帮助我们理解这些缺点。

#### 内存消耗

闭包会导致内存占用增加，因为它们会保留对外部变量的引用，即使外部函数执行完毕。这可能会导致内存占用过高。

```ts
function createHugeArray() {
  var arr = new Array(1000000).fill("Huge Data");
  return function () {
    console.log(arr.length);
  };
}

var bigDataFunc = createHugeArray();
bigDataFunc(); // 输出: 1000000
```

在这个例子中，createHugeArray 函数返回一个闭包函数，它引用了一个巨大的数组 arr。即使 createHugeArray 执行完毕，arr 仍然被闭包引用，无法被垃圾回收机制回收，从而导致内存占用增加。

#### 内存泄漏

由于闭包会持有对外部变量的引用，如果不正确地处理闭包的使用，可能会导致内存泄漏。如果一个闭包长时间存在，但不再需要，它会一直持有对外部变量的引用，使这些变量无法被垃圾回收。

```ts
function leakMemory() {
  var data = "Sensitive Data";
  var timer = setInterval(function () {
    console.log(data);
  }, 1000);
}

leakMemory();
```

在这个例子中，leakMemory 函数创建了一个闭包，它引用了一个定时器内部的函数。即使 leakMemory 执行完毕，定时器仍然在持续执行，因此闭包会一直存在并引用 data 变量，导致 data 无法被垃圾回收。

#### 性能影响

闭包可能对性能产生一定的影响，特别是在涉及大量变量或复杂词法环境的情况下。闭包的创建和执行可能消耗更多的时间和资源。

```ts
function calculate() {
  var result = 0;
  for (var i = 0; i < 1000000; i++) {
    result += i;
  }
  return function () {
    console.log(result);
  };
}

var expensiveFunc = calculate();
expensiveFunc(); // 输出: 499999500000
```

在这个例子中，calculate 函数返回一个闭包函数，它引用了一个在循环中计算的结果。由于闭包保留了这个结果，闭包的执行可能会耗费更多的时间和资源。

为了减少闭包的缺点，我们可以采取以下措施：

优化内存使用：在闭包中避免持有大量数据或不必要的引用。确保只
保留必要的变量和引用。

及时清理闭包：在不需要使用闭包时，手动解除对闭包的引用，以便垃圾回收机制可以回收闭包相关的资源。
避免滥用闭包：只在必要的情况下使用闭包，避免在不必要的场景中使用闭包。
优化性能：在闭包的创建和使用过程中，尽量避免不必要的计算或资源消耗，以提高性能。
通过合理使用和处理闭包，我们可以最大限度地减少其缺点，同时享受闭包在 JavaScript 中带来的强大功能。
