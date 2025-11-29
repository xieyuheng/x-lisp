---
title: xvi project
date: 2025-11-29
---

设置 xvi 这个新的项目，用来探索 risc 指令集构架的设计。

- 学习 mmix 的简单指令集编码。

  但是改为 little-endian 和 at&t operand order。

- 以 machine-lisp 为汇编语言。

  需要把 machine-lisp 设计成完整的汇编语言。
  要嵌入一个解释器在汇编语言中，使得汇编语言可以使用变量和表达式。

- 学习 SPARC，在正常的 RISC 集之外，
  增加处理带有 tagged value 的指令。

- 探索 vector 相关的指令集。
