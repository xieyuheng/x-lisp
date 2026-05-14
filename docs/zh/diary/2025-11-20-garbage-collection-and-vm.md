---
title: garbage collection and vm
date: 2025-11-20
---

# root scanning 问题

读了很多论文之后：

- 2001-constant-time-root-scanning-for-deterministic-garbage-collection.md
- 1984-reference-count-garbage-collection.md
- 2002-accurate-garbage-collection-in-an-uncooperative-environment.md
- 2009-accurate-garbage-collection-in-uncooperative-environments-revisited.md

我发现 GC 的 root scanning 问题，
对于带有 GC 但是没有静态类型系统的语言而言，
root scanning 问题太难了。

目前所发现的解决方案都有严重的限制，比如：

- 或者要求所有的 object pointer 不能保存到寄存器中。

- 或者要求每次把一个可能是 object pointer 的 value 保存到寄存器中时，
  都要把这个值备份到 shadow stack 中。

- 或者在 safepoint 的 slow path 中，
  需要扫描整个 call stack，
  或 copy 并且 unwind 整个 call stack。

编译到 native code，而不是使用 vm，
是放弃了 vm 所带来的好的特性，来换取速度。
但是上面这些方案都会导致，换不来太多的速度。

可能的结论是：

- 如果想要为纯粹的动态类型语言实现 GC，
  还是用 vm 来实现比较好，而不是编译到 native code。

目前我的方案所引入的限制是：

- 禁止 primitive function 调用 x-lisp function。

尽管有上面的结论，我还是想尝试在这个限制下实现 native code + GC。

另外，我还可以继续调研 GC 方案。
看看还有没有别的思路。

# reference counting 作为备选方案

1984-reference-count-garbage-collection.md 是一个不错的备选。

这是一个纯粹在运行时来解决 root scanning 问题的方案。

但是这对于实现 native 编译器而言也不太对。
因为每个 assignment 都潜在地需要 reference counting：

- const instruction：
  可以根据 value 的类型决定是否需要 reference counting。

- call 和 apply instruction：
  每次返回值，都要在运行时检查是否需要 reference counting。

  - primitive function  的 call，
    有时可以确定返回值是否是 object。
