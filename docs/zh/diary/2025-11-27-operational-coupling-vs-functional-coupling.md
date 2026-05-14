---
title: operational coupling vs functional coupling
date: 2025-11-27
---

coupling 有多种，其中重要的两种是：

- operational coupling -- 运行时的依赖关系
- functional coupling -- 责任和功能上的重叠

basic-lisp 和 machine-lisp 可以独立运行。
x-lisp 同时依赖 basic-lisp 和 machine-lisp 来写 pass。

目前的责任划分：

- x-lisp -- 语言功能
- basic-lisp -- 优化
- machine-lisp -- 代码生成

但是有 functional coupling：

- x-lisp 与 basic-lisp 都实现了 module 功能，几乎是直接翻译过去。

  这个可以通过把 bundling 在 x-lisp 中实现来解决。
  但是这会导致我们没法把单独的 x-lisp 文件独立编译到 basic-lisp 文件。

- basic-lisp 与 machine-lisp 都实现了 data layout 功能，也是几乎直接翻译过去。

  这个可以通过 extract data layout 功能出来成一个新的模块。
  但是如何把语言的功能 extract 出来成为 shared 模块？

  这好像也不对，因为 basic-lisp 需要被 execute，
  而 machine-lisp 需要被 transpile。
