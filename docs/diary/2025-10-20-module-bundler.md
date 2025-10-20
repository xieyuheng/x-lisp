---
title: module bundler
date: 2025-10-20
---

# bundler

basic-lisp 需要支持模块系统，
因为这样可以让 frontend 不必重新实现模块系统。

对于 module 的代码生成，有两种方案：

- 方案 A：一个 module 一个 object file。
- 方案 B：把所有 module bundle 到一起，生成一个 object file。

两个方案可能都要实现，首先要实现方案 B。

# 独立于文件系统的模块系统

假设我们还是使用 one file one module 的模块系统设计。
此时 module 是没有用户所指定的名字的，
module 的名字就是 file path。

要实现 bundler 的方案 B，
就需要给每个 module 生成一个唯一的前缀。
然后把 imported name 都处理为带有前缀的唯一 name。

如果每个 module 有用户所给出的唯一的名字，
就可以避免生成前缀，可以直接用给出的名字作为前缀。

因此为了生成代码时方便，
basic-lisp 应该实现独立于文件系统的模块系统。

另外，如果 basic-lisp 实现了基于文件系统的模块系统，
那么所有的 frontend 都要实现这样的模块系统。

但是其实这应该是 frontend 的选择。
也就是说如果需要生成模块的名字，
应该由 frontend 生成。

按照这样的思路，
x-lisp 本身可应该实现独立于文件系统的模块系统。

但是我还不确定是否应该这样做，
因为看了一下 scheme 的模块系统，
其中模块名可以是任意的 sexp，
这么说来还是需要生成前缀。
