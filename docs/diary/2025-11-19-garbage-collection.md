---
title: garbage collection
date: 2025-11-19
---

马上就要实现 garbage collection 了，总结一下所选的方案。

方案：

- 由于目的之一是可以方便用 c 扩展，
  所以使用最简单的 mark-sweep gc。

  每个 c 所扩展的 object pointer 都记录在 gc space 中。
  可以是一个简单的 pointer 的 array，
  因为有一层间接，所以 object pointer 本身的地址是稳定的。

  - 每个 object pointer 都应该有一个到 gc space 中的 pointer，
    记录自己在 space 中的位置，也就是双向连接。
    space 的位置中，pointer 还保存 mark-sweep 所用到的 mark。

  - 可以让每个 object 都双向连接到一个 slot，
    gc space 中通过保存 slot 来简洁保存 object，
    这样 gc space 中的 slot 就是可以移动的了。

- 使用 shadow stack。
  每次 spill local variable 的时候，都放到 shadow stack 中。
  shadow stack 就是 GC 的 root stack。

  前提：是所有 value 都有 tag。

  对于 spilled local variable，
  shadow stack 就足以找到所有的 root object 了。
  但是对于 register local variable 不行

- 调用 gc 函数之前，callee saved register 中可能有 root object。
  需要保存所有 register 到 shadow stack 中。

  拆分判断 gc 的函数和进行 gc 的函数，
  然后在生成汇编代码时，先判断是否需要 gc：

  - 如果不需要，就是 fast path。
  - 如果需要，就是 slow path，
    此时需要保存 callee saved register 到 shadow stack 中，
    然后调用 gc。

  这里有一个重要的限制：
  只有在 call stack 中没有 primitive function 时，
  GC 才是安全的。

  因为我们必须保证 callee saved register 中的变量都是带有 tag 的。
  而 primitive function 使用 register 的方式是任意的。

  这个限制导致：

  - primitive function 不能调用 x-lisp function。
  - 我们需要在汇编中调用 gc，而不是在 primitive function 中调用 gc。

  注意，按照现在的实现方式 apply 就是，
  有可能调用 x-lisp function 的 primitive function！

  - 要么把 apply 完全 inline 到 assembly。

  - 要么把 apply 拆解成两部分，
    在 C 中找到 function address，
    并且准备好参数（可以用一个 stack）。
    然后在 assembly 中 call function。

    - 这个方案的另一个好处是，
      可以避免在 C 中出现 cast function pointer
      这种 undefined behavior。

- 有 gc safepoint 的概念，在编译时插入 safepoint。

  只在 x-lisp function 中插入 safepoint，
  并且要求 primitive function 不能调用 x-lisp function，
  这样就能保证在遇到 safepoint 时，
  call stack 中没有 primitive function。

  可以插入在 data constructor 一类的 primitive function 之前，
  比如 `make-curry` 和 `make-tael`。
