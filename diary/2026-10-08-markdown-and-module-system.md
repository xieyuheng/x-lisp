---
title: markdown and module system
author: xieyuheng
date: 2026-10-08
---

# 当前模块系统的设计

支持 markdown 之后，需要重新思考模块系统。

首先回顾当前的模块系统设计。

当前的设计是模块系统与文件系统解耦，
一个文件只是一个模块的片段（fragment）。

这样的设计可以让人灵活地，
通过拆分文件来拆分一个模块中的代码。
拆分的目的是为了，在浏览代码时，只看到自己当前关心的代码。

由于每个文件都可能被独立浏览，
所以 import 一类的依赖声明语句，
是就每个 fragment 而言的，
而不是就整个模块而言的。

但是一个模块内的名字可以不加声明地，
在 fragment 之间相互依赖，甚至相互递归。
这意味着，一个模块对外部的依赖声明是就 fragment 而言，
看一个 fragment 文件就能看到这个 fragment 的外部依赖。
但是模块对内部的依赖是没有声明的，
我们假设了模块的作者熟悉自己所修改的模块，
熟悉模块的 fragment 划分方式，等等。

# markdown 与模块系统的关系

引入 markdown 之后，与模块系统的关系有两种设计方式

一、一个 markdown 文件是一个 fragment。

- 这假了人们经常把一个 .meta 文件转化为 .md 文件，来增添大量注释。

二、一个 markdown 文件中的一个 code block 是一个 fragment。

- 这假设了有人可能想要把一个 package 中的多个模块的代码，
  用一个 markdown 文件管理。

  但是这可能是不合理的。
  因为就算是用 markdown 写文档，也是要分章节的。
  而不同的章节最好写在不同的 markdown 文件中。

# 可否完全避免 import 语句？

目前我们模块系统所管理的名字有三层：
`<package-name>/<module-name>/<name>`。

否完全避免使用 import 来修改引用方式？
接使用 qualified name？

但是人可能想要把 `meta/` 前缀改为 `m/`。

一个 package 可能只有一个模块，
比如 `meta-math/math`，
这时引用可能要简化前缀为 `math/`。

package 和 module 和 file 之间的关系，
看来还是有待讨论的。
