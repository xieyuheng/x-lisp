[meta-lisp.js] add (@string) syntax

我觉得模仿 (@list) 增加一个 类似 (@string) 的语法 比价好，可以 desugar 到 string-append。
你觉得 (@string <exp> <exp> ...) 怎么样？
一个 (@string) 内可以有多个 string 表达式，会不会让人误解？

[meta-lisp.js] add (@sexp) syntax

- 下面我计划增加 (@sexp <exp>) 语法，类似 (@quote <exp>)
- desugarSexp 与 desugarQuote 类似，但是不是直接返回对应的 literal exp，
  而是利用 location 返回带有 location，属于 sexp-t 类型的表达式（meta-lisp 内的 adt）。

[meta-lisp.meta] [refactor] parse-exp

[skill] how to solve it
[skill] sandi metz oop
[skill] scalable-c
