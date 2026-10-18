---
title: system-lisp
author: xieyuheng
date: 2025-11-23
---

为什么需要 system-lisp？

- 因为 C 对 stack 的使用没有规定。
- 并且 C 对 struct 的使用没有 pack 要求。
- C 函数不能 jump 到函数。
- C 函数和 void * 之间不能 cast。

# [2026-07-22]

C 的这些限制，都是为了跨平台而必须的：

- 不同构架对 stack 的用法不可能一样。
- arm 和 risc-v 中要求指针 8 byte 对齐，
  因此不能使用 packed struct。
- 可以 jump 到函数，甚至还可以 jump 到 mmap 的函数。
- 可以 cast。
