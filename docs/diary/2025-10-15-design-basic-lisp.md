---
title: design basic-lisp
date: 2025-10-15
---

# block list vs. instruction list

直接描述 block list
还是描述 instruction list 再生成 block？

如果直接描述 block list 了，
那么有的 function 只有一个 block 怎么办？
另外，一般 function 的开头 block 都是没有名字的。

结论：还是使用 instruction list，
完全模仿 bril，但是改成 lisp 语法。

# 是否限制 operand 为 variable？

是否像 bril 一样，限制所有的 operand 都是 variable？
bril 这样做其实是为了方便用 json 表示。
LLVM 的 IR 是没有这样限制的。

结论：先限制。
如果发现对于后续的优化而言，
这个限制没必要，再取消。

# codegen

SSA 到 x86 的 codegen 可以简单地用 rewrite rule 实现。
由于我们有 structural 的数据类型 sexp，
所以使用 rewrite rule 很方便。

# runtime tagged value

看了 EOC 的课程才知道，通过编译时处理 tag，
可以把大量的 inject 和 project 连用的地方优化掉：

```scheme
(+ e1
   (+ e2
      e3))
=>
(inject
 (+ (project e1 Integer)
    (project (inject
              (+ (project e2 Integer)
                 (project e3 Integer))
              Integer) Integer))
 Integer)
```

显然可以被优化成：

```scheme
(inject
 (+ (project e1 Integer)
    (+ (project e2 Integer)
       (project e3 Integer)))
 Integer)
```

只有 `inject` 和 `project` 变成 instruction，
才有机会进行优化，因此 basic-lisp 的 value 是默认不带 tag 的，
带有 tag 的 value 是特殊的一种 value。
在编译时处理 tag。

这也让我们有机会在未来把 basic-lisp 用到纯静态类型语言。

这种方案的难点是 GC，
也就是 GC 不能依赖 value 都有 tag，
来发现哪些是 pointer 哪些不是。

处理 GC 问题的方案有两个：

- 方案 A：保守 GC。
  这个要非常谨慎使用，
  因为有可能内存泄漏。

- 方案 B：在编译时把变量的类型，
  以及变量所分配到的寄存器信息保存下来，
  在调用 GC 的时候使用这些信息。

  在 heap 中，每个 data 都要有 header 来保存 metadata。

# module bundler

basic-lisp 需要支持模块系统，
因为这样可以让 frontend 不必重新实现模块系统。

对于 module 的代码生成，有两种方案：

- 方案 A：一个 module 一个 object file。

- 方案 B：把所有 module bundle 到一起，生成一个 object file。

两个方案可能都要实现，首先要实现方案 B。

假设我们还是使用 one file one module 的模块系统设计。
此时 module 是没有用户所指定的名字的，
module 的名字就是 file path。

要实现方案 B，就需要给每个 module 生成一个唯一的前缀。
然后把 imported name 都处理为带有前缀的唯一 name。

- 如果每个 module 有用户所给出的唯一的名字，
  就可以避免生成前缀，可以直接用给出的名字作为前缀。
  类似 java 的模块系统，
  但是我们还是想实现简单的 one file one module。
