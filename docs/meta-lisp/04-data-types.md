# 数据类型

meta-lisp 提供了从便捷到 explicit 的三层语法来定义数据类型：

| 语法 | 用途 | 构造器名 |
|---|---|---|
| `define-struct` | 只有一个构造器的结构体 | 自动生成 `make-<base>` |
| `define-struct*` | 只有一个构造器，自定义名字 | 你指定 |
| `define-enum` | 多个构造器的枚举/代数数据类型 | 每个构造器名即其名字 |
| `define-algebraic-type` | 最 explicit，所有名字自己定 | 你指定 |

所有便捷语法最终都**展开为** `define-algebraic-type`。

## (define-struct)

用于只有一个构造器的数据类型。

```scheme
(define-struct point-t
  (x float-t)
  (y float-t))

;; 自动生成的名字：
;;   构造器：make-point
;;   谓词：point?
;;   访问器：point-x, point-y
;;   修改器：point-put-x!, point-put-y!

(define p (make-point 1.0 2.0))
(point-x p)  ;; => 1.0
```

`define-struct` 自动生成构造器名 `make-<base>`，其中 `<base>` 是类型名去掉 `-t` 后缀。

### 展开

```scheme
(define-struct point-t
  (x float-t)
  (y float-t))

;; 等价于：
(define-algebraic-type point-t
  ((make-point (x float-t) (y float-t))
   point?
   (x point-x point-put-x!)
   (y point-y point-put-y!)))
```

### 约束

类型名必须以 `-t` 结尾，否则报错并提示使用 `define-algebraic-type`。

## (define-struct*)

用于只有一个构造器，但想自定义构造器名。

```scheme
(define-struct* point-t (cons-point (x int-t) (y int-t)))

;; 构造器名为你指定的 cons-point，而不是 make-point
(cons-point 1 2)
```

## (define-enum)

用于多个构造器的代数数据类型（枚举/联合）。

```scheme
(define-enum exp-t
  (var-exp (name symbol-t))
  (lambda-exp (parameter symbol-t) (body exp-t)))

(match exp
  ((var-exp name) ...)
  ((lambda-exp parameter body) ...))
```

每个构造器自动生成的名字：

| 名字 | 命名规则 | 示例 |
|---|---|---|
| 构造器 | `<constructor-name>` | `var-exp` |
| 谓词 | `<constructor-name>?` | `var-exp?` |
| 访问器 | `<constructor-name>-<field>` | `var-exp-name` |
| 修改器 | `<constructor-name>-put-<field>!` | `var-exp-put-name!` |

### 展开

```scheme
(define-enum exp-t
  (var-exp (name symbol-t))
  (apply-exp (target exp-t) (arg exp-t)))

;; 等价于：
(define-algebraic-type exp-t
  ((var-exp (name symbol-t))
   var-exp?
   (name var-exp-name var-exp-put-name!))
  ((apply-exp (target exp-t) (arg exp-t))
   apply-exp?
   (target apply-exp-target apply-exp-put-target!)
   (arg apply-exp-arg apply-exp-put-arg!)))
```

## (define-algebraic-type)

用于需要对命名有完全控制时。

```scheme
(define-algebraic-type exp-t
  ((var-exp (name symbol-t))
   var-exp?
   (name var-exp-name var-exp-put-name!))
  ((apply-exp (target exp-t) (arg exp-t))
   apply-exp?
   (target apply-exp-target apply-exp-put-target!)
   (arg apply-exp-arg apply-exp-put-arg!))
  ((lambda-exp (parameter symbol-t) (body exp-t))
   lambda-exp?
   (parameter lambda-exp-parameter lambda-exp-put-parameter!)
   (body lambda-exp-body lambda-exp-put-body!)))
```

每个构造器的格式：

```
(<constructor-name> <field-spec>... <predicate> <accessor-spec>...)
```

其中：
- `<field-spec>` = `(<field-name> <field-type>)`
- `<predicate>` = `<predicate-name>`
- `<accessor-spec>` = `(<field-name> <accessor-name> <modifier-name>)`

每个构造器必须包含谓词和完整的访问器/修改器列表。

## 多态类型参数

所有四种语法都支持多态类型参数。

```scheme
(define-enum (my-list-t E)
  (nil)
  (li (head E) (tail (my-list-t E))))

;; 生成：
(claim nil        (polymorphic (E) (-> (list-t E))))
(claim li         (polymorphic (E) (-> E (list-t E) (list-t E))))
(claim nil?       (polymorphic (E) (-> (list-t E) bool-t)))
(claim li?        (polymorphic (E) (-> (list-t E) bool-t)))
(claim li-head    (polymorphic (E) (-> (list-t E) E)))
(claim li-tail    (polymorphic (E) (-> (list-t E) (list-t E))))
(claim li-put-head! (polymorphic (E) (-> E (list-t E) (list-t E))))
(claim li-put-tail! (polymorphic (E) (-> (list-t E) (list-t E) (list-t E))))
```

类型参数在类型名后的括号中声明。构造器在命名时以构造器的名字为前缀（而不是类型名）。

## 模式匹配 (match)

使用 `match` 来解构代数数据类型：

```scheme
(define-enum exp-t
  (var-exp (name symbol-t))
  (lambda-exp (parameter symbol-t) (body exp-t)))

(define (free-variables exp)
  (match exp
    ((var-exp name) (make-set name))
    ((lambda-exp parameter body)
     (set-delete (free-variables body) parameter))))
```

### (match) 语法

```scheme
(match target
  ((constructor field-pattern ...) body)
  ((constructor2 field-pattern ...) body))
```

- `target` 是要解构的值
- 每个 `constructor` 必须匹配目标值的构造器
- `field-pattern` 是变量名，会被绑定到对应字段的值
- 第一个匹配的分支执行其 body

### 多态列表上的 match

```scheme
(define (my-list-length list)
  (match list
    ((nil) 0)
    ((li head tail) (iadd 1 (my-list-length tail)))))
```

## 函数与结构体

在 meta-lisp 中，结构体没有独立的方法。对结构体进行操作的函数是普通的顶层函数：

```scheme
(define-struct point-t
  (x float-t) (y float-t))

(define (point-distance-squared point)
  (fadd (fmul (point-x point) (point-x point))
        (fmul (point-y point) (point-y point))))
```
