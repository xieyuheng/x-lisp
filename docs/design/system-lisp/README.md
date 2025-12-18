# system-lisp

所有参数都是 pass-by-reference，
没有 implicit 的 stack copy，
如果需要可以以显式把 object 分配在 stack 上。

向 stack 中返回 struct 的函数，
可以接受分配在 stack 中的 struct 的 pointer，
然后通过副作用返回。

- 如果实现 pass-by-copy 的编译器，
  也是要以这种方式实现的。

构造 object 的函数，
以 dynamic scope 的方式使用 allocator，
可以临时改变 allocator。

处理 object 的函数，完全不用在乎 object 是用哪个 allocator 构造的。
object 本身可以记录 allocator 和对应的 free 函数。

可以支持 lambda，但是不能返回 lambda 也不能支持 curry。
