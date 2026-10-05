---
title: indentation based lisp syntex
author: xieyuheng
date: 2026-10-05
---

在 [calcit](https://github.com/calcit-lang/calcit) 语言中，
设计出了一种很好的基于缩进的 lisp 语法。

规则只有两条：

- 「换行 + 缩进」表示「向下嵌套一层列表，更深的行是上一行尾部的子表达式」；
- `$` 在行内起到同样的作用，等价于「开括号并把后续内容放到下一层」。

例如：

```calcit-lang
defn fib (n)
  if (< n 2) 1 $ +
    fib $ - n 1
    fib $ - n 2
```

等价于：

```calcit-lang
defn fib (n)
  if (< n 2)
    1
    +
      fib $ - n 1
      fib $ - n 2
```

等价于：

```meta-lisp
(defn fib (n)
  (if (< n 2)
    1
    (+
      (fib (- n 1))
      (fib (- n 2)))))
```
