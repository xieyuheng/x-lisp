---
title: what i want to express by designing this lisp
date: 2025-09-21
---

设计这个 lisp 我想要表达什么？

首先，我可以明确不是想表达什么：

- 我可以想象这个 lisp 有完全不同的 compiler target。
  或者有完全不同的 runtime，支持不同的并发模型。
  所以这些不是想要表达的。

- 我还可以想象这个 lisp 有两个版本，
  一个支持副作用，一个是完全禁止副作用的纯函数版本。
  所以是否是纯函数也不是我想要表达的。

想要表达的，其实是与具体实现方式无关的：

- 命名惯例，少用缩写。
  比如用 @list 来避免使用 list 这个变量名的时候不得不缩写。
  以及目前所带有的 built function 的命名方式
  -- `<topic>-<name>`。

- 实用的模块系统，要支持 circular dependence。
  因为如果一个语言支持 mutual recursive function，
  就也应该支持模块之间的 circular dependence。

- 支持 auto currying。

  这是看似非常小的一点，
  但是其实是哲学意义上最重要的一点。

  lisp 起初是为了 lambda calculus 而设计，
  但是 lambda calculus 的 combinator logic 一面一直被 lisp 忽视了。

  auto currying 对于 combinator logic 非常重要，
  而 combinator logic 的哲学意义就在于如何用组合子来表达 composition。

- 所基础的 structural 数据结构：
  - primitive: bool, int, float, symbol, string
  - compound: set, tael -- list with attribute

- 在运行时用谓词实现 algebraic data type 的方式，
  也就是 define-data 和 match。

  基础的数据类型给出了基础的集合，或者说「全集」，
  而 define-data 给出了向「全集」中添加新元素的方式。

  传统的 scheme 是没有添加新元素的机制的。
  只能通过约定来增加新数据类型，
  比如实现类似 define-record 的 macro 时，
  其实是翻译成 list 或 vector。

  这种设计差异是 structural vs nominal 的差异。

  - [2025-11-19] 目前的实现中，
    algebraic data type 也是纯粹 structural 的。
    也就是说，我们依旧没有方式向全集中添加新元素。
    在新的设计中，这也成了 x-lisp 的重要特点之一。

- claim 与谓词所构成的 optional runtime assertion 系统。
  包括：tau, inter, union 等等谓词构造子。

  想要强调谓词与集合之间的联系。
  因为谓词可以很方便地刻画某个集合的子集。

现在还用不到，但是未来还想要增加的核心功能：

- 用 define-generic 来定义新 generic 函数，
  用 define-handler 和参数的谓词来实现
  runtime multiple dispatching。

  这个功能是为了实现 propagator。

也就是说，想要表达的核心 idea，都是实现无关的。
因此我可以接受一个最简单的实现方式，
未来再修改实现方式。

最简单的实现方式，可能就是编译到一个
forth-like stack virtual machine。
