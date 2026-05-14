---
title: 类型系统
---

meta-lisp 有类似 Haskell 和 ML 的 Hindley-Milner 类型系统。

**核心原则：**
- 没有 union 和 intersection 类型
- 没有子类型关系（structural 子类型、行多态均已移除）
- 所有类型在编译时确定

# 基础类型

| 类型        | 含义                 | 字面量示例     |
|-------------|----------------------|----------------|
| `int-t`     | 整数                 | `42` `-1` `0`  |
| `float-t`   | 浮点数               | `3.14` `-2.5`  |
| `string-t`  | 字符串               | `"hello"`      |
| `symbol-t`  | 符号                 | `'foo`         |
| `keyword-t` | 关键字               | `:key`         |
| `bool-t`    | 布尔值               | `true` `false` |
| `void-t`    | 空值（函数无返回值） | —             |
| `type-t`    | 类型的类型           | —             |

```scheme
(claim x int-t)
(define x 42)

(claim name string-t)
(define name "alice")

(claim flag bool-t)
(define flag true)
```

# 复合类型

| 类型 | 含义 | 示例 |
|---|---|---|
| `(list-t E)` | 元素类型为 E 的列表 | `(list-t int-t)` |
| `(set-t E)` | 元素类型为 E 的集合 | `(set-t string-t)` |
| `(hash-t K V)` | 键类型为 K，值类型为 V 的 Hash 表 | `(hash-t string-t int-t)` |

```scheme
(claim numbers (list-t int-t))
(define numbers (list 1 2 3))

(claim scores (hash-t string-t int-t))
(define scores (hash ("alice" 95) ("bob" 87)))
```

# 函数类型

函数类型使用 `(-> arg-type ... ret-type)` 语法：

```scheme
(-> int-t int-t)           ;; 接收一个 int，返回一个 int
(-> int-t int-t int-t)     ;; 接收两个 int，返回一个 int
(-> string-t bool-t)       ;; 接收一个 string，返回一个 bool
(->)                       ;; 无参数，返回 void（很少用）
```

示例：

```scheme
(claim add1 (-> int-t int-t))
(define (add1 x) (iadd x 1))

(claim add (-> int-t int-t int-t))
(define (add a b) (iadd a b))
```

# 多态（Polymorphism）

使用 `(polymorphic (A B ...) type)` 声明通用类型：

```scheme
(claim identity
  (polymorphic (A) (-> A A)))

(define (identity x) x)
```

`identity` 可以作用于任何类型：

```scheme
(identity 42)        ;; => 42
(identity "hello")   ;; => "hello"
(identity true)      ;; => true
```

多个类型参数：

```scheme
(claim pair
  (polymorphic (A B) (-> A B (list-t A))))

(define (pair a b) (list a))
```

类型参数在 `(polymorphic (A B ...) ...)` 中声明，在类型体中引用。

## 多态数据类型

自定义数据类型也可以带多态参数：

```scheme
(define-enum (my-list-t E)
  (nil)
  (li (head E) (tail (my-list-t E))))
```

类型参数 `E` 在类型名后的括号中声明，类似于 Haskell 的 `data MyList a = Nil | Li a (MyList a)`。

# 类型标注

可以用 `(the type exp)` 显式标注表达式的类型：

```scheme
(the int-t 42)
(the (-> int-t int-t) (lambda (x) (iadd x 1)))
```

这对于帮助类型推断或澄清代码意图很有用。
