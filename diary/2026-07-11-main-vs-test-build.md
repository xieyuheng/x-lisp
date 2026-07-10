---
title: main vs test build
author: xieyuheng
date: 2026-07-11
---

可以通过完全分离 main 和 test build 来实现 meta-lisp 的测试框架。

因为这样可以简化 runtime loader，
loader 的职责只是运行 executable 中的入口函数。

这样可以在未来兼容 ELF 格式。
