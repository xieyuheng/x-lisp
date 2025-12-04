---
title: x-lisp-forth
date: 2025-12-04
---

# 更改计划

更改计划，还是使用 VM 的方式实现语言。

在实现动态类型语言 x-lisp 的编译器之前，
应该先实现 system-lisp 的编译器，
此时 basic-lisp 的设计将是带有类型系统的。
之后将 basic-lisp 扩展成能处理 tagged value，
从而作为 x-lisp 的中间语言。

# 计划

- x-forth.c

  - stack machine
  - tagged value (64 bits)
  - extensible by c
  - 用类 forth 的方式实现，而不是用汇编器的方式。
    - 方便定义 metadata。
    - 函数内使用 变长指令集。

- x-lisp-forth.js

  - compile to x-forth
