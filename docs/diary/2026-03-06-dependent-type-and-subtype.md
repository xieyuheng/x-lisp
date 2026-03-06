---
title: dependent type and subtype
date: 2026-03-06
---

subtype 的难点在于要处理类型变量之间不等式而不是等式，
但是按照当前实现 `typeCheckByInfer` 的方式，
是先进行 `typeUnify` 然后再进行 `typeSubtype`，
后者根本不处理类型变量。

因为所有子类型关系都来自 class 的 attributes 之间的包含关系
（any type 相关的特例除外），
这样我们可以假设了所有可以形成 subtype 关系的类型，
都可以顺利通过 unificaton。

也就是说，我们可以完全避免处理类型变量之间不等式，
只判断具体的类型之间的子类型关系。
也就是不能处理类似 typescript 中的
`<T extends A>` 之类的 constraint。

在这种限制下也许 dependent type 和 subtype 是兼容的。

注意，想要实现 dependent type 必须在下一个项目中进行，
因为 dependent type 要求没有副作用的纯函数式语言。

也就是在 cicada-lisp 中进行。
cicada-lisp 和 x-lisp 的关系，
类似 ML 和 Coq 的关系。
因此 x-lisp 也许应该叫做 meta-lisp。
