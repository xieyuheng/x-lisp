---
title: system-lisp
---

# pass-by-reference

除了 int 和 float 之类的 primitive 类型，
所有 object 作为参数都是 pass-by-reference。

没有 implicit 的 stack copy，
如果需要可以以显式把 object 分配在 stack 上。

向 stack 中返回 object 的函数，
可以接受分配在 stack 中的 object 的 pointer，
然后通过副作用返回。

- 如果实现 pass-by-copy 的编译器，
  也是要以这种方式实现的。

对于不是 pointer 的 object，
设计 inline object 或者 local object 的特殊语法。

- 比如 array 中可以保存 inline object。
  来避免对每个 object 都额外分配内存。
  或者首，这根本就不是 array，
  而是 inline object allocator。

# dynamic scoped allocator

构造 object 的函数，
以 dynamic scope 的方式使用 allocator，
可以临时改变 allocator。

处理 object 的函数，完全不用在乎 object 是用哪个 allocator 构造的。
object 本身可以记录 allocator 和对应的 free 函数。

# lambda

可以支持 lambda，但是不能返回 lambda 也不能支持 curry。

# null pointer

不用 optional 类型，使用 null pointer。
每个 object 类型都可能是 null pointer。

只有这样初始化 object 的函数才比较灵活。
可以随便定义函数来初始化 object。

使用 object 的函数需要自己检查 null pointer 的情况。
