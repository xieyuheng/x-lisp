# 简介

meta-lisp 是静态类型的 lisp 方言，
遵循 scheme 的极简主义语法设计。

改良了部分 scheme 语法，比如：

- 用 `(@list 1 2 3)` 而不是 `(list 1 2 3)` 来写列表，
  从而避免占用 `list` 这个变量名。
- 在带有多个表达式的函数体中，可以用 `(= <name> <exp>)` 来代替嵌套的 `(let)`。
- 给 `(define-record-type)` 增加了 field 的类型声明，
  并且在类似的语法设计方向上，增加了 `(define-algebraic-type)` 的语法。

## 代码示例

```scheme
(module examples)

(claim factorial (-> int-t int-t))

(define (factorial n)
  (if (int-less-or-equal? n 1)
    1
    (imul (factorial (isub n 1)) n)))

(define-test factorial-test
  (assert-equal 120 (factorial 5)))
```

## 核心特性

- Hindley-Milner 类型系统。
- 没有子类型关系，不支持传统的面向对象编程范式。
- 尾递归优化（没有 `for`/`while` 循环相关的语法）。
- 支持代数数据类型与模式匹配。
- 与文件系统解耦的的模块系统。
- 内置测试框架。
