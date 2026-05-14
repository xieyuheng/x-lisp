---
title: module system in basic-lisp
date: 2025-11-29
---

目前模块系统是放在 basic-lisp 中实现的，
但是 x-lisp 中也实现了一部分，造成了重复。

有必要解释为什么模块系统要放在 basic-lisp 中实现。
如果这里的解释失效了，就提到 x-lisp 中来实现。

放在 basic-lisp 中实现的好处是：

- 每个用到模块系统功能的 .lisp 文件，
  可以被独立地编译到 .basic 文件。

- 每个 .basic 文件可以在 bundle 之前，
  独立地对自己进行优化。

这些可以独立运行的任务，
都是可以并行的任务。
