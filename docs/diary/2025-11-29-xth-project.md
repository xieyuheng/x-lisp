---
title: xth project
date: 2025-11-29
---

设置 xth 这个新项目，用来探索栈虚拟机。

- 所有 value 带有 tag。

  可以和未来的编译器 runtime 重用一部分代码：

  - value encoding
  - primitive-function
  - GC

- 为作为动态语言的编译器后端而设计。

  与 basic-lisp 的生态位相同，但是不强调优化。

- 学习 uxn/tal，用汇编器的形式来实现类 forth 语言。

  ```ruby
  main:
    @lit 2 square @lit 4 @eq @ok
    @lit 3 square @lit 9 @eq @ok

    @lit 2 @call &square @lit 4 @eq @ok
    @lit 3 @call &square @lit 9 @eq @ok

    @lit 2 @lit &square @apply @lit 4 @eq @ok
    @lit 3 @lit &square @apply @lit 9 @eq @ok

    @ret

  square: @dup @mul @ret
  ```

- 变长指令集架构。

  所以可以用特殊的 op code 来处理 string literal，
  比如 `@string "..."`，其中 `"..."` 就是 byte array end with null。

- 结构化的 label，这样 label 可以带有 metadata。

  比如 `f:` 可以带有 `f/arity:` 或者 `f/metadata:`。
  metadata 具体实现方式待定。
