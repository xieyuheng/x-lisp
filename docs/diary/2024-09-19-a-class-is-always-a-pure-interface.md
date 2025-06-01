---
title: A Class is Always A Pure Interface
date: 2024-09-19
---

在目前的设计中，
一个 `define-class` 所定义的 class，
都是纯粹的 interface。

一个 class 一定是 flat 的，
可以继承一个或多个 super class，
但是 super class 没有具体的 method，
因此也没有需要 override super class 的 method 的问题。

---

但是 fulfilling 一个 class 的过程，
其实还是会生成带有具体 method 的 class。

这基本上说明了，不是实现带有具体 method 的 class 是不合理的。
如果实现带有 method 的 class，但是不能 override 看起来又是不合理的。

- 方案 A：
  fulfilling class 使用带有 value 的 class，
  但是定义 class 时不允许带有 value。

- 方案 B：
  定义 class 时允许带有 value，
  但是不支持 subclass 对 superclass 的 method 的 override。

我还不确定应该如何选择。

---

- [2025-06-01] 在读 EOC 的过程中，
  用到了带有 method 的和 override 功能的 class。
  因为要使用 open recursion 来渐进地定义语言的解释器。

  因此就应该实现正常的功能完备的 class。
  想到在 JS 中用 function + record 实现各种 OOP 功能，
  就知道实现 class 也并不难。
