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
