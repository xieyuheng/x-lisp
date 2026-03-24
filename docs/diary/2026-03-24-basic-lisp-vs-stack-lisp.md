---
title: basic-lisp vs stack-lisp
date: 2026-03-24
---

想过在 basic-lisp 之下再设计一个 stack-lisp，但是发现：

- basic-lisp 编译到 stack-lisp 的代码，
  即便是在 c 中写，也很简单。

- basic-lisp 可以抽象掉底层 vm 的实现方式。

所以就保持在 c 中实现 basic-lisp。

可能的简化：

- 取消 basic-lisp 的 module system，
  让 basic-lisp 只处理好 bundle 好的代码。

但是也不一定要这样做，
因为 basic-lisp 带有 module system 方便模块化的编译。

比如引用一个编译好的 library 时，不用重新编译。
