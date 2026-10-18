---
title: shortcoming of flexible module system
author: xieyuheng
date: 2026-08-02
---

在翻译 meta-builtin 到中文的过程中，
发现虽然灵活的，与文件系统解耦的模块系统写起来很方便，
但是灵活的模块系统也有缺点。

因为在完成的代码中，模块之间的依赖关系成为隐式的了。
所以想要完成整体的逐步迁移，就需要重新理清依赖关系。

这个问题可以在未来通过直接支持 markdown 的文学式编程来解决。
