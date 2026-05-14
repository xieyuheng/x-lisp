---
title: metadata in basic-lisp
date: 2025-11-29
---

需要在 basic-lisp 中增加 metadata 功能，
使得编译器可以传递信息到 runtime。

通过 `define-metadata` 关键词定义 metadata：

- metadata 是 sexp 的子集，
  其中 symbol 代表 variable。
  variable 指向另外的 metadata（或 function）。

- metadata 会被翻译成 machine-lisp 的 `define-data`，
  相当于为 untagged sexp 设计了一套在 memory 中的 layout。

- 为了方便，要求 `define-metadata` 所定义的，
  顶层 metadata 是 RecordMetadata。
  因为这是最常用的情形。

- metadata 是 untagged。
  当传递给 runtime 的 C 代码时，
  C 代码应该知道 metadata 的类型与 layout。

- 上面这种 tagged 与 untagged 的区分，
  体现在 basic-lisp 的解释器中就是：
  primitive-function 拿到指向 metadata 的 address 时，
  可以解析出来 `Metadata` 类型的数据，
  而不是 `Value` 类型的数据。
