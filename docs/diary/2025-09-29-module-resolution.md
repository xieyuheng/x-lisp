---
title: module resolution
date: 2025-09-29
---

# 动机

想要支持引用标准库的 module。
可以用 url 的 protocol 来区分对 std 的 import：

```scheme
(import "std:graph")
```

但是如果没有适当的 module resolution 规则，就必须写成：

```scheme
(import "std:graph/index.lisp")
```

自己写的模块感觉还好，但是对于 std 而言，感觉太啰嗦了。

另外，假设未来有了 package manager，可以用：

```scheme
(import "xpm:xieyuheng/graph")
```

不同的 protocol 可以有不同 module resolution rules。

# 部分模仿 commonjs

module resolution 的方式部分模仿 commonjs：

- 如果 path 是 directory，就补充 `/index.lisp`。
- 如果 path 不是 directory，且不带有文件名后缀，就补充 `.lisp` 后缀。
- 如果 path 不是 directory，且带有文件后缀，就直接尝试读文件。

这样设计的好处：

- 被 import 的对象可以在文件和文件夹之间切换，import 语法不变。

这样设计的坏处：

- 处理 `.test.lisp` 时，有些不一致，因为必须要完整的 path。
  不过很少有 import test 模块的情况，所以还好。

# 为什么 js 现在偏向 esmodule

注意，现在 js 之所以偏向不用 commonjs 而用 esmodule，
是因为 js 要保持 module resolution 的规则简单，
也就是机会没有规则，直接一个 http get 就可以。
否则 module 的 server 就不能是简单的文件 server 了。

我的语言不需要在浏览器里运行，也不会有这种顾虑。
