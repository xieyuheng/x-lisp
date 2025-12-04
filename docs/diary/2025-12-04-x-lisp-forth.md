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
  - 除了模仿 ruby 的语法之外，就类似传统的 forth。
    但是不是 threaded code 而是 byte code。
  - 使用 `<name>/<n>` 语法来做 `@fn <name> n call` 的缩写。
  - 没有 closure 但是有 apply 所形成的 curry（flat closure）。
  - procedure -- quoted unnamed function
    - 这也方便编译 lambda。
      不用 lift，可以编译在当前位置。

- x-lisp-forth.js

  - compile to x-forth
