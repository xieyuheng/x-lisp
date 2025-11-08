---
title: the concept of project
date: 2025-11-08
---

# 动机

带有模块的 x-lisp 文件，
编译出来的 basic-lisp 文件，
需要保持路径的树状结构，
才能用到 basic-lisp 的模块和 bundle 功能。

这个需求类似 typescript 编译 javascript 时，需要保持路径的结构。

为了在 x-lisp 源代码文件旁边生成大量的中间文件，
我就需要专门的 build 路径，来保存中间文件。

也就是说，有了模块系统之后，
编译的对象不再是单独的文件，
而是多个模块所组成的项目。

这就需要引入「项目」的概念。

# 需求

- 以项目为对象完成编译。

- 支持现有的测试约定：

  - .test.lisp
  - .snapshot.lisp
  - .error.lisp

- 保持可扩展。

  - 之后要能描述项目所依赖的外部文件。
  - 之后还可能要支持包管理。

# 方案

- 用 project.json 配置文件作为项目标识。

- project.json 的配置项：

  - build-directory -- 默认为 "build"。
  - root-directory -- 默认 project.json 所在路径。

- TODO

