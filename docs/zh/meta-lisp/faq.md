---
title: 常见问题（FAQ）
---

# 有 for/while 循环吗？

没有。用**尾递归函数**代替：

```meta-lisp
(define (list-sum xs)
  (list-sum-loop xs 0))

(define (list-sum-loop remaining result)
  (match remaining
    ((nil) result)
    ((li head tail) (list-sum-loop tail (iadd result head)))))
```

编译器会正确处理尾部调用，不消耗栈空间。

# 如何比较两个值？

```meta-lisp
(equal? a b)     ;; 结构相等
(same? a b)      ;; 引用相同，或原子数据相同
```

# 如何输出调试信息？

```meta-lisp
(print x)        ;; 打印值
(println x)      ;; 打印值并换行
(write x)        ;; 打印字符串
(writeln x)      ;; 打印字符串并换行
(newline)        ;; 打印换行
(format x)       ;; 将值格式化为字符串
```

# 和 Scheme 有什么区别？

meta-lisp 只是在语法设计上遵从了 scheme 的极简主义哲学，
但是 meta-lisp 与 scheme 是完全不同的语言。

在很多语法设计上对 scheme 有所改良，
没有实现 scheme 的标准，不是 scheme 方言。

最重要的差异是：meta-lisp 是静态类型语言，而 scheme 是动态类型语言。

# 类型系统有什么特点？

meta-lisp 有类似 Haskell 和 ML 的 Hindley-Milner 类型系统。

非常简单的类型系统：

- 没有子类型关系。
- 没有行多态。
- 没有 union 和 intersection 类型。
- 没有 typeclass。

# 和 Haskell 有什么区别？

| Haskell                            | meta-lisp                                              |
|------------------------------------|--------------------------------------------------------|
| `Int -> Int`                       | `(-> int-t int-t)`                                     |
| `forall a. a -> a`                 | `(polymorphic (A) (-> A A))`                           |
| 类型类（Typeclass）                | ❌ 不支持                                              |
| `data Maybe a = Nothing \| Just a` | `(define-enum (maybe-t A) (just (value A)) (nothing))` |
| 代数数据类型                       | ✅ `define-enum`                                       |
| 模式匹配                           | ✅ `match`                                             |
| 惰性求值                           | ❌ 严格求值（call-by-value）                           |
| 纯函数式（无副作用）               | ❌ 允许副作用（I/O、打印等）                           |

# 和 SML 有什么区别？

| SML                                       | meta-lisp                                            |
|-------------------------------------------|------------------------------------------------------|
| `int -> int`                              | `(-> int-t int-t)`                                   |
| `'a -> 'a`                                | `(polymorphic (A) (-> A A))`                         |
| 函子（Functor）                           | ❌ 不支持                                            |
| `datatype 'a option = NONE \| SOME of 'a` | `(define-enum (option-t A) (some (value A)) (none))` |
| 模式匹配（`case`）                        | ✅ `match`                                           |
| 严格求值                                  | ✅ 严格求值（call-by-value）                         |
| 允许副作用                                | ✅ 允许副作用（I/O、打印等）                         |

# 和 OCaml 有什么区别？

| OCaml                                 | meta-lisp                                            |
|---------------------------------------|------------------------------------------------------|
| `int -> int`                          | `(-> int-t int-t)`                                   |
| `'a -> 'a`                            | `(polymorphic (A) (-> A A))`                         |
| 模块系统（Module / Functor）          | ❌ 不支持                                            |
| `type 'a option = None \| Some of 'a` | `(define-enum (option-t A) (some (value A)) (none))` |
| 模式匹配（`match`）                   | ✅ `match`                                           |
| 严格求值                              | ✅ 严格求值（call-by-value）                         |
| 允许副作用                            | ✅ 允许副作用（I/O、打印等）                         |

# 和 Clojure 有什么区别？

| Clojure                                   | meta-lisp                                              |
|-------------------------------------------|--------------------------------------------------------|
| `(defn f [x] ...)`                        | `(define (f x) ...)`                                   |
| `int -> int`                              | `(-> int-t int-t)`                                     |
| 动态类型                                  | ✅ 静态类型（Hindley-Milner）                           |
| 默认不可变数据                            | 默认可变数据                                            |
| 运行在 JVM / CLR / JS 上                  | 独立的编译器（bootstrap + self-hosting）               |
| STM 并发                                  | ❌ 不支持                                              |
| 惰性序列                                  | ❌ 严格求值（call-by-value）                           |

# 和 Common Lisp 有什么区别？

| Common Lisp                               | meta-lisp                                              |
|-------------------------------------------|--------------------------------------------------------|
| `(defun f (x) ...)`                       | `(define (f x) ...)`                                   |
| `(function (int) int)`                    | `(-> int-t int-t)`                                     |
| 动态类型                                  | ✅ 静态类型（Hindley-Milner）                           |
| CLOS（Common Lisp Object System）         | ❌ 不支持（用 define-struct / define-enum）            |
| 多返回值                                  | ❌ 不支持                                              |
| 重启/条件系统（restart / condition）      | ❌ 不支持                                              |
| 严格求值                                  | ✅ 严格求值（call-by-value）                           |

# 和 TypeScript 有什么区别？

| TypeScript                    | meta-lisp                  |
|-------------------------------|----------------------------|
| union 类型                    | ❌ 不支持                  |
| intersection 类型             | ❌ 不支持                  |
| 子类型（interface extends）   | ❌ 不支持                  |
| 泛型 `<T>`                    | ✅ `(polymorphic (A) ...)` |
| `any` / `unknown`             | ❌ 不支持                  |
| 结构类型（structural typing） | ❌ 仅有 nominal 类型       |

# 如何使用自定义构造器名？

`(define-struct)` 默认的构造器名字为 `make-<base-name>`：

```meta-lisp
(define-struct point-t
  (x int-t)
  (y int-t))
```
可以用 `(define-struct*)` 指定构造器名字：

```meta-lisp
(define-struct* point-t
  (cons-point
   (x int-t)
   (y int-t)))
```

# 为什么类型名必须用 `-t` 结尾？

这是命名约定。

`(define-struct)` 会利用类型名 `<base-name>-t`，
来生成构造器名 `make-<base-name>`。
比如 `point-t` → `make-point`。

如果不想用这个约定，
可以用更显式的语法 `(define-struct*)`，
或 `(define-record-type)`。
