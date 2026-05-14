---
title: test framework
date: 2026-04-09
---

在使用与文件系统解耦的模块系统之后，
测试框架不能再依赖于文件后缀了。

因此需要设计新的测试框架：

- 用 `(define-test <name> <exp> ...)` 定义有名字的测试。

- 运行测试的过程中，标准输出可以被 snapshot 到一个文件中。
  文件所在的路径就是 module 名，文件名就是 test 名。

但是对 type error 和 syntax error 的 snapshot testing，
并不在一般项目的测试流程之内，不能用这种方式来写。
