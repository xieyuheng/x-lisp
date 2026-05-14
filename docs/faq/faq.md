---
title: 常见问题（FAQ）
---

# 有 for/while 循环吗？

没有。用**尾递归函数**代替：

```scheme
(define (sum-list xs)
  (define (iter xs acc)
    (match xs
      ((nil) acc)
      ((li head tail) (iter tail (iadd acc head)))))
  (iter xs 0))
```

编译器会正确处理尾部调用，不消耗栈空间。

# 如何比较两个值？

```scheme
(equal? a b)     ;; 结构相等
(same? a b)      ;; 引用相同，或原子数据相同
```

# 如何输出调试信息？

```scheme
(print x)        ;; 打印值
(println x)      ;; 打印值并换行
(write s)        ;; 打印字符串
(writeln s)      ;; 打印字符串并换行
(newline)        ;; 打印换行
(format x)       ;; 将值格式化为字符串
```

# 和 Scheme 有什么区别？

meta-lisp 只是在语法设计上遵从了 scheme 的极简主义哲学，
但是 meta-lisp 与 scheme 是完全不同的语言。

在很多语法设计上对 scheme 有所改良，
没有实现 scheme 的标准，不是 scheme 方言。

最重要的差异是：meta-lisp 是静态类型语言，而 scheme 是动态类型语言。

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

| SML                                   | meta-lisp                                              |
|---------------------------------------|--------------------------------------------------------|
| `int -> int`                          | `(-> int-t int-t)`                                     |
| `'a -> 'a`                            | `(polymorphic (A) (-> A A))`                           |
| 函子（Functor）                       | ❌ 不支持                                              |
| `datatype 'a option = NONE \| SOME of 'a` | `(define-enum (option-t A) (some (value A)) (none))` |
| 模式匹配（`case`）                    | ✅ `match`                                             |
| 严格求值                             | ✅ 严格求值（call-by-value）                           |
| 允许副作用                           | ✅ 允许副作用（I/O、打印等）                           |

# 和 OCaml 有什么区别？

| OCaml                                  | meta-lisp                                              |
|----------------------------------------|--------------------------------------------------------|
| `int -> int`                           | `(-> int-t int-t)`                                     |
| `'a -> 'a`                             | `(polymorphic (A) (-> A A))`                           |
| 模块系统（Module / Functor）           | ❌ 不支持                                              |
| `type 'a option = None \| Some of 'a`  | `(define-enum (option-t A) (some (value A)) (none))` |
| 模式匹配（`match`）                    | ✅ `match`                                             |
| 严格求值                              | ✅ 严格求值（call-by-value）                           |
| 允许副作用                            | ✅ 允许副作用（I/O、打印等）                           |

# 和 TypeScript 有什么区别？

| TypeScript                    | meta-lisp                  |
|-------------------------------|----------------------------|
| union 类型                    | ❌ 不支持                  |
| intersection 类型             | ❌ 不支持                  |
| 子类型（interface extends）   | ❌ 不支持                  |
| 泛型 `<T>`                    | ✅ `(polymorphic (A) ...)` |
| `any` / `unknown`             | ❌ 不支持                  |
| 结构类型（structural typing） | ❌ 仅有 nominal 类型       |

# 类型系统有什么特点？

meta-lisp 有类似 Haskell 和 ML 的 Hindley-Milner 类型系统。

**核心原则：**
- 没有 union 和 intersection 类型
- 没有子类型关系（structural 子类型、行多态均已移除）
- 所有类型在编译时确定

# (claim) 和 (define) 的规则？

所有函数和变量必须先声明类型再定义：

```scheme
(claim add1 (-> int-t int-t))
(define (add1 x) (iadd x 1))
```

测试（`define-test`）不需要 `claim`。

# 自定义构造器名？

单构造器时用 `define-struct*`：

```scheme
(define-struct* point-t (cons-point (x int-t) (y int-t)))
(cons-point 1 2)
```

多构造器时每个构造器名就是其名字。

# 为什么类型名必须用 `-t` 结尾？

这是命名约定。`define-struct` 会自动将类型名末尾的 `-t` 替换为 `make-` 来生成构造器名（如 `point-t` → `make-point`）。如果不想用这个约定，用 `define-struct*` 或 `define-algebraic-type`。

# 类型错误看不懂怎么办？

启用 verbose 模式获取更多信息：

```bash
./meta-lisp.js check --verbose
```

常见的类型错误：

```
Type mismatch: expected int-t, got string-t    ← 参数类型不对
Expected function type, got int-t               ← 把非函数当函数作用了
Unbound variable: foo                           ← 变量未定义或未导入
```
