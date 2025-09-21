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

- 所基础的 structural 数据结构：
  - primitive: bool, int, float, symbol, string
  - compound: set, tael -- list with attribute

- claim 与谓词所构成的 optional runtime assertion 系统。
  包括：tau, inter, union 等等谓词构造子。

- 在运行时用谓词实现 algebraic data type 的方式，
  也就是 define-data 和 match。

现在还用不到，但是未来还想要增加的核心功能：

- 用 define-generaic 和 define-handler
  所形成的 runtime multiple dispatching。
  这个功能是为了实现 propagator。

也就是说，想要表达的核心 idea，都是实现无关的。
因此我可以接受一个最简单的实现方式，
未来再修改实现方式。

最简单的实现方式，可能就是编译到一个
forth-like stack virtual machine。
