---
title: x-forth void
date: 2025-12-13
---

# 问题

x-forth 可以处理多个返回值和零个返回值的函数，
因此不需要 void value。

但是 x-lisp 的每个函数都必须有一个返回值。

比如 `print` 函数在 x-forth 中可以是零返回值的函数，
但是在 x-lisp 中必须返回 void。

如何处理这个差异？

# 方案 A

x-forth 为 x-lisp 服务，
`print` 也要返回 void。

这样对于 x-forth 来说不太方便。
因为直接使用 x-forth 时，
一定需要有一些多返回值或者零返回值的函数才方便。

方案 A 是最简单的。

# 方案 B

x-forth 有多份 builtin，
并且可以在文件开头指定使用哪些 builtin。

这样就可以专门为 x-lisp 准备相应的 builtin。

可能应该选择方案 B。

但是可行需要区分 builtin 和 prelude：

- builtin 必须共用，因为 `iadd` 之类的 builtin 需要被编译成 bytecode。

- prelude 可以有多份，`print` 在 prelude 中。
  注意，有些 prelude 也是 primitive function。

# 方案 C

把 print 之类返回 void 的函数排除在 builtin 之外，
通过 `@import-all "std:io"` 来引用。

这样只有完全能够被 x-lisp 和 x-forth 公用的才能被加入 builtin。
比如 forth 的 drop dup swap 都不能加入 builtin。
想要使用就要引入，比如 `@import-all "std:forth"`。

或者可以用语言包来区分目前所需要的两类 primitive 函数：

```
@import-all "x:lisp"
@import-all "x:forth"
```

# 方案 D

不要用模块系统，而是指定语言包：

```
@lang forth
@lang lisp
```

这样虽然看起来简洁，
但是可能没有模块系统灵活。

# 结论

应该选择方案 A。

并且项目的名字应该改为 x-lisp-forth。
因为 x-lisp-forth 的目的不是一个一般的供人直接使用的 forth,
而是专门作为 x-lisp 的编译对象的 forth。

毕竟，遵从 x-lisp 的参数顺序，
就已经决定了这个 forth 不适合直接使用。

也就是说解释器的 stack-based vm 这一层，
以一个类 forth 语言的形式被暴露出来了，
而不是作为内部的 API。

未来可以将中文与英文的供人直接使用的 forth 合并，
叫做 x-forth 或 cicada-forth。
