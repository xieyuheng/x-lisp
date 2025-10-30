---
title: the plan
date: 2025-07-30
---

尝试实现 structural type
加 lattice (union + intersection)
加 recursive type 的项目 lattice-lisp 失败了。

因此，在 structural type 的语言中模仿 Aziz 写编译的计划失败了。

但是还是可以退一步，避免 union + intersection 的难点，
直接实现 datatype + interface + recursive type。

此时我们已经学到的，
判断 recursive type 之间的子类型关系的技术，
在这种情况下就可以正常使用了。

用 datatype 代替 union，
用 interface 之间的继承来代替 intersection。
