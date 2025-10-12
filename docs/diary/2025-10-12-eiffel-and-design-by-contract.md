---
title: eiffel and design by contract
date: 2025-10-12
---

因为运行时的 schema（规范） 检查，
其实与 design by contract 非常类似，
所以学习了两个 eiffel 语言的培训课程：

- [Design by Contract part 1](https://www.youtube.com/watch?v=v1phSCx_Vvg)
- [Design by Contract part 2](https://www.youtube.com/watch?v=8XV0khSeKaw)

尝试在 lisp 中模仿 eiffel 的 design by contract。

# 方案 A：扩展 function schema

```scheme
(forall ((x ...)
         (y ...))
  (require (... x ... y ...)
    (ensure (... x ... y ...)
       <retrun-schema>)))
```

注意，除了 `require` 和 `ensure`，
eiffel 还有关于 class 的 `invariant`，
由于我们没有 class 所以不用。

其中 `require` 类似于用已有的语法关键词所写的：

```scheme
(forall ((x ...)
         (y ...))
  (begin
    (assert (... x ... y ...))
    <retrun-schema>))
```

但是 `ensure` 是写不出来的。
`ensure` 可以被用作带有副作用的函数，
来表达对参数的副作用之效果。

为了只用这种语法，
只要要求调用函数之前，
先拿到函数的返回类型（返回规范 schema），
就可以了。

注意，在 eiffel 中，可以给 contract 命名，
所以也许可以这样设计：

```scheme
(forall ((x ...)
         (y ...))
  (require
    :contract-name (... x ... y ...)
    :contract-name (... x ... y ...)
    (ensure
       :contract-name (... x ... y ...)
       :contract-name (... x ... y ...)
       <retrun-schema>)))
```

# 方案 B：设计 claim 之外的新语法 contract

```scheme
(require (f x y)
  (contract
    :contract-name ...
    :contract-name ...))

(ensure (f x y result)
  (contract
    :contract-name ...
    :contract-name ...))
```

这样的设计可能更为合理，
但是需要占用两个新的语法关键词。

contract 可以设 claim 配合使用，
使得 contract 不用表达参数类型和返回类型：

```scheme
(claim f (-> ... ...))

(require (f x y)
  (contract
   :contract-name ...
   :contract-name ...))

(ensure (f x y result)
  (contract
   :contract-name ...
   :contract-name ...))
```

如果不想让 contract 成为一个 value，
也可以直接：

```scheme
(require (f x y)
  :contract-name ...
  :contract-name ...)

(ensure (f x y result)
  :contract-name ...
  :contract-name ...)
```

这就十分接近 eiffel 的优雅程度了。

但是这样的缺点是，没有了 contract value 这一层 wrap，
上面的代码没法与 lambda 等价：

```scheme
(require f
  (lambda (x y)
    :contract-name ...
    :contract-name ...))

(ensure f
  (lambda (x y result)
    :contract-name ...
    :contract-name ...))
```

除非我们扩展 lambda 的语法，
使得 lambda 可以直接返回 record！

这也许太复杂了，因为如果对 lambda 的 body 增加了这个功能，
那么 lambda 中的 `if` 之类的 sub expression 怎么办？
不能都支持，因此只能在 lambda body 的 top-level 支持。
感觉不太对。
还是要 wrap 一个 `contract`。

或者可以用带有名字的 `aseert`：

```scheme
(require (f x y)
  (assert "contract-name" ...)
  (assert "contract-name" ...))

(ensure (f x y result)
  (assert "contract-name" ...)
  (assert "contract-name" ...))
```

但是这样可能不利于报错。
因为直接运行 `assert`，
获得的就是 `assert` 的报错了。
但是由于有 report in context，
所以可能也没有关系。

这可能是最简单的最好的设计。

# 学习 eiffel 的感受

## 1

Eiffel 语言设计的非常不错，
语法设计和命名惯例都具有很强的一致性：

- 比如用纯大写做类型名。

- 又比如在 and 和 or 之外，
  还有 imply (implies) 语法关键词，
  用来更方便地写 predicate。
  这是我第一次在一个语言中见到。

## 2

Eiffel 的课程中，有通过继承 class 来 reuse code 的例子，
这让我再次确定，object 就应该是纯粹的数据，而不应该带有任何 method。
所有的 method 都应该用 function 实现。

而带有 method 的 class，以及 class 和 object
所引入的 this 或者 self 等等复杂性，
都是本质上错误的。

function 做不到，而 method 可以做到的事情：

- 在通过继承扩展 class 之后，
  给 class 增加 attributes，
  然后要求以这个 class 为返回值的函数，
  其返回值的类型依然是扩展后的 class。

- open recursion，即如果出现了 override，
  要求递归调用的 method 是 subclass 的 method。

用 function 时，如何解决上面的问题？

- 增加 attributes 就是新的数据类型，不要 code reuse。
  保持不同类型之间相互独立，
  反而有利于独立去理解每一模块的代码。
  在未来修改代码的过程中，
  两个模块也可能有不同的演化方向，
  只有相互独立才能有不同的演化方向。

- 直接修改代码来增加功能，
  而不是不修改代码，通过继承代码来增加功能。
  这样读者可以独立地理解一个代码模块，
  而不用顺着继承链查询很多模块，才能理解一个模块。

这种对 class 的批判是否也适用于抽象数学结构？
不适用，因为抽象数学结构只是简单的 record type，
而 record type 不包含任何有待被 reuse 或者 override 的 method。

## 3

课程的最后，老师有一个有趣的结论：

- OOP 中 class 之间有两种依赖关系 -- client 和 heir。

- 一般的 OOP 鼓励 composition，也就是 client 而不鼓励继承。
  证据是 java 的 `final` 和 c# `sealed` 关键词，
  阻止别人继承 class。

- 之所以不鼓励继承，是因为 subclass 可能会违反 class invariant，
  override method 也可能会违反 method 的 contract。

- 因此 eiffel 鼓励继承，因为 eiffel 中，
  class invariant 是以清晰地方式表示出来的，
  并且可以有很好的报错信息。

假设我们对 class 的批判成立，
那么老师这其实就是在用正确的推理，
在错误的道路上越走越远。

## 4

design by contract 作为一个新的功能，
可以很自然地增加到流行的语言中，
比如 c 类语言或者 oop 语言。

为什么没有人加呢？

因为需要扩展语法，而一般的语言没法自然地扩展语法。

只有 lisp 可以。
