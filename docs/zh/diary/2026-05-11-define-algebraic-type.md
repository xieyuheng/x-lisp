---
title: define-algebraic-type
author: xieyuheng
date: 2026-05-11
---

# (define-data)

之前设计了 `(define-data)` 之后：

```scheme
(define-data (my-list-t E)
  (nil)
  (li (head E) (tail (my-list-t E))))

;; nil
;; nil?
;; ll
;; li?
;; li-head
;; li-put-head!
;; li-tail
;; li-put-tail!
```

我一直想不通只带有单个 data constructor 的情况应该如何处理。

```scheme
(define-data (pair-t A B)
  (cons-pair (first A) (second B)))

;; cons-pair?
;; cons-pair-first
;; cons-pair-second
;; cons-pair-put-first!
;; cons-pair-put-second!

(define make-pair cons-pair)
(define pair? cons-pair?)
(define pair-first cons-pair-first)
(define pair-second cons-pair-second)
(define pair-put-first! cons-pair-put-first!)
(define pair-put-second! cons-pair-put-second!)
```

这显然太啰嗦了。

# (define-interface)

为此我才想到用作为 record type 的 interface 来实现 `pair-t`：

```scheme
(define-interface (pair-t A B)
  :first A
  :second B)

(define (make-pair first second)
  {:first first :second second})

(define (pair-first pair) (:first pair))
(define (pair-second pair) (:second pair))

(define (pair-put-first first pair) (update pair :first first))
(define (pair-put-second second pair) (update pair :second second))

(define (pair-put-first! first pair) (update! pair :first first))
(define (pair-put-second! second pair) (update! pair :second second))
```

其实这还是啰嗦，但是对于 record type，
可以用一般的 accessor 和 modifier 语法。

# (define-record-type)

其实 scheme 经典的 `(define-record-type)` 就是解决方案。
但是只不过 `(define-record-type)` 是对动态型语言定义的，
我没马上看到增加类型的方案。

`(define-record-type)` 的结构是：

```scheme
(define-record-type <type-name>
  (<constructor-name> <field-name> ...)
  <predicate-name>
  (<field-name> <accessor-name> <modifier-name>)
  ...)
```

比如：

```scheme
(define-record-type point-t
  (make-point x y)
  point?
  (x point-x point-put-x!)
  (y point-y point-put-y!))
```

看似复杂，其实 `<field-name>` 是不暴露给用户的，
类似 parameter，但是这里的设计使得它的作用也类似 entity id，
使得后续可以定义对应的 field 的 accessor 和 modifier。

其实增加类型的方案很简单，只要给 constructor 加上类型就好了。
和 `(define-data)` 中 data constructor 的 typed field 定义一样。

```scheme
(define-record-type point-t
  (make-point (x float-t) (y float-t))
  point?
  (x point-x point-put-x!)
  (y point-y point-put-y!))
```

比如上面的 `pair-t` 的定义问题：

```scheme
(define-record-type (pair-t A B)
  (make-pair (first A) (second B))
  pair?
  (first pair-first pair-put-first!)
  (second pair-second pair-put-second!))
```

# (define-algebraic-type)

这样看来，显然在 `(define-data)` 之外，

```scheme
(define-data (my-list-t E)
  (nil)
  (li (head E) (tail (my-list-t E))))
```

应该有一个类似 `(define-record-type)` 的，
所生成的名字更 explicit 的语法：

```scheme
(define-algebraic-type (my-list-t E)
  ((nil)
   nil?)
  ((li (head E) (tail (my-list-t E)))
   li?
   (head li-head li-put-head!)
   (tail li-tail li-put-tail!)))
```

显然可以省略 predicate、accessor 和 modifier，来使用默认的生成名字的方式。
并且把 `(define-data)` 作为 `(define-algebraic-type)` 的 sugar。

# keyword argument

关于 keyword argument 的语法设计，
也可以跳出 `:key value` 语法的设计思路，
模仿 `(define-record-type)`。

```scheme
(define-keyword (<function-name> (<parameter> <default-arg>) ...) ...)
(call/keyword <function-name> (<keyword> <value>) ...)
```

在 `define-keyword` 中 `<parameter>` 起到 keyword 的作用，
parameter 名字是暴露给用户的 API 的一部分。

但是还需要让 `(->)` 支持 keyword。
假设有 `arrow/keyword` 语法关键词，缩写为 `->/kw`。
模仿 `(let)` 的语法：

```scheme
(->/kw ((depth int-t)
        (width int-t)
        (bg string-t))
  window-t)
```

这也许启示我们应该用 `:` 做 module prefix 的分隔符，
把 `/` 保留为可用的 symbol。

# (define-record-type) is not acceptable

尝试使用了一下 `(define-record-type)`。

如果要把：

```scheme
(define-interface source-position-t
  :index int-t
  :row int-t
  :column int-t)
```

写成：

```scheme
(define-record-type source-position-t
  (make-source-position
   (index int-t)
   (row int-t)
   (column int-t))
  source-position?
  (index source-position-index)
  (row source-position-row)
  (column source-position-column))
```

或者把：

```scheme
(define-interface mod-t
  :name symbol-t
  :stmts (list-t stmt-t)
  :admitted (set-t symbol-t)
  :definitions (hash-t symbol-t definition-t)
  :claimed (hash-t symbol-t claim-entry-t)
  :inferred-types (hash-t symbol-t value-t)
  :data-constructors (hash-t symbol-t data-constructor-t)
  :project project-t
  :is-error-module bool-t)
```

写成：

```scheme
(define-record-type mod-t
  (cons-mod
   (name symbol-t)
   (stmts (list-t stmt-t))
   (admitted (set-t symbol-t))
   (definitions (hash-t symbol-t definition-t))
   (claimed (hash-t symbol-t claim-entry-t))
   (inferred-types (hash-t symbol-t value-t))
   (data-constructors (hash-t symbol-t data-constructor-t))
   (project project-t)
   (is-error-module bool-t))
  mod?
  (name mod-name)
  (stmts mod-stmts)
  (admitted mod-admitted)
  (definitions mod-definitions)
  (claimed mod-claimed)
  (inferred-types mod-inferred-types)
  (data-constructors mod-data-constructors)
  (project mod-project)
  (is-error-module mod-is-error-module))
```

还是有点接受不了。
因为开始设计 meta-lisp 的动机之一，
就是没法接受在 typescript 中定义 algebraic data type 的时候，
一个名字要出现多次，而现在一个名字又出现了三次。

一种方案是用：

```scheme
(define-interface mod-t
  (name symbol-t)
  (stmts (list-t stmt-t))
  (admitted (set-t symbol-t))
  (definitions (hash-t symbol-t definition-t))
  (claimed (hash-t symbol-t claim-entry-t))
  (inferred-types (hash-t symbol-t value-t))
  (data-constructors (hash-t symbol-t data-constructor-t))
  (project project-t)
  (is-error-module bool-t))
```

然后根据 type 的名字，去掉 `-t` 后缀，
来生成对应的 `define-record-type`。

这样也许就不能叫 `define-interface` 了，
因为如此定义的 type 之间没有子类关系。

方案 A：

- `define-record-type` 改名为 `define-product-type`，
  避免与 python 的 dict 和 javascript 的 object 混淆。
- `define-struct` 作为 `define-product-type` 的 sugar，
  避免一个名字重复多次。

方案 B：

- 在 `define-record-type` 之外增加 `define-algebraic-type`，
  二者都是 sugar 版本。
- 另外设置 `define-detailed-algebraic-type`
  和 `define-detailed-record-type`
  作为 desugar 的版本。
  detailed 版本甚至可以完全不要缩写，使用
  `(constructor)` `(predicate)` 和 `(fields)` 来标记。
- 另外有 `define-type-alias`，用来做简单的 alias。

方案 C：

- `define-algebraic-type` 模仿带有类型信息的 `define-record-type`。
- `define-struct` 和 `define-enum` desugar 到 `define-algebraic-type`。

最终选择方案 C。

# (define-struct)

与 `(define-enum)` 不同的是，`(define-struct)` 只有一个 constructor。
不是根据 constructor 的名字，而是根据 `<type-name>` 的名字去掉后缀 `-t`，
来生成 `<predicate-name>` `<accessor-name>` `<modifier-name>`。

比如：

```scheme
(define-struct point-t
  (x float-t)
  (y float-t))
```

展开为：

```scheme
(define-algebraic-type point-t
  (make-point
   (x float-t)
   (y float-t))
  point?
  (x point-x point-put-x!)
  (y point-y point-put-y!))
```

又比如：

```scheme
(define-struct (pair-t A B)
  (first A)
  (second B))
```

展开为：

```scheme
(define-algebraic-type (pair-t A B)
  (make-pair
   (first A)
   (second B))
  pair?
  (first pair-first pair-put-first!)
  (second point-second point-put-second!))
```

给 `(define-struct)` 一个变体 `(define-struct*)`：

- `(define-struct*)` -- 用户提供 constructor-name。
- `(define-struct)` -- 根据 type-name 生成 constructor-name -- 用 make- 前缀。
