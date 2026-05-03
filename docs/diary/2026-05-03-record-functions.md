---
title: record functions
date: 2026-05-03
---

记录一下当前处理 record functions 的方式。
这个处理方式不太令人满意，有待改善。

关于 record 的语法比如 `(extend)` 和 `(update!)`，
会生成对 `record-put` 和 `record-put!` 的函数调用。

但是其实这些函数的类型，是没法再当前的类型系统中表达出来的，
因此实现了特殊的语法关键词，以及相关的特殊类型检查规则。

目前的处理方式是：

```scheme
(module builtin)

(exempt
  make-record
  record-get
  record-put
  record-put!)

(declare-primitive-function make-record 0)
(declare-primitive-function record-get 2)
(declare-primitive-function record-put 3)
(declare-primitive-function record-put! 3)
```

`(exempt)` 会标记这些定义，使得类型检查略过它们。
但是它们还是会占用 builtin 的保留 name，
用户可以引用到这些函数，但是不能通过类型检查。

方案 A：

- 保持现在的 `(exempt)` 机制。
- 把这些函数名字加上 `internal-` 前缀以避免占用保留 name。

方案 B：

- 把 `(exempt)` 的生命机制改成 `(internal)` 的声明机制，
  专门用来处理不能被用户调用，但是需要被编译器生成的函数调用。
- `ImportPass` 在 import builtin 的时候会掠过这些 internal 名字。

方案 C：

- 设计一个一般的 `(private)` 机制，private name 不能被 import。
  由于 builtin 是用 `(import-all)` 实现的，
  所以这个机制可以用来隐藏 builtin functions。
- 此时需要保留 `(exempt)` 机制，因为这些函数没有类型声明。
