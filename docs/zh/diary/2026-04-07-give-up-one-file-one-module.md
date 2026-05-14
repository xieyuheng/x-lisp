---
title: give up one file one module
date: 2026-04-07
---

# 新设计

放弃 one file one module 的想法，
这个想法虽然看起来简单，
但是实现循环引用时很不方便。

对于模块系统，实际的需求是：

- 能够把相互递归函数分文件来编写。
- 避免大量 import。

现在改为文件系统与模块系统解耦的设计：

- 在文件内声明当前文件所属的模块，
  一个模块中的定义可以来自多个文件。
  同一个模块内的定义，自然可以相互递归。

- 模块之间不允许循环引用。
  因为需要循环引用是为了相互递归函数，
  而与文件系统分离的设计，已经够相互递归函数使用了。

- 不允许 import all，必须 import name。
  为了避免大量 import name，可以使用 import as。

# 关于 basic-lisp

现在 basic-lisp 和 meta-lisp 的模块系统需要一起改，这是不合理的。
应该只在 meta-lisp 中实现模块系统，避免重复实现。
