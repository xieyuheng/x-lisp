---
title: REPL prompt
date: 2025-10-06
---

REPL 的：

- prompt -- `>> `
- result prompt -- `=> `

这样，如果一个表达式带有标准输出上的副作用，
就可以和表达式最后的 result 的 print 区分开：

```scheme
>> (begin (print "hello") (write "\n") 123)
"hello"
=> 123
```

另外 `=>` 也遵循了 lisp/scheme 中，
人们习惯用 `=>` 表示求值结果的传统：

```scheme
(+ 1 2) => 3
```
