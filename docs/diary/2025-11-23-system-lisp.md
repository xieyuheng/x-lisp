---
title: system-lisp
date: 2025-11-23
---

为什么需要 system-lisp？

- 因为 C 对 stack 的使用没有规定。
- 并且 C 对 struct 的使用没有 pack 要求。
- C 函数不能 jump 到函数。
- C 函数和 void * 之间不能 cast。
