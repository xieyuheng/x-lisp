---
title: 语法
---

# 前言

meta-lisp 使用**符号表达式**（S-expression）语法。

- 模块顶层由**语句**（statement）组成。
- 语句内由**表达式**（expression）组成。

下面分组介绍 meta-lisp 的所有语法。

# 目录

- [前言](#前言)
- [目录](#目录)
- [注释](#注释)
  - [行注释](#行注释)
  - [(@comment)](#comment)
- [字面量](#字面量)
  - [原子](#原子)
  - [(@list)](#list)
  - [(@set)](#set)
  - [(@hash)](#hash)
  - [(@string)](#string)
  - [(@quote)](#quote)
  - [(@sexp)](#sexp)
- [变量](#变量)
  - [(define)](#define)
  - [变量](#变量-1)
  - [限定变量](#限定变量)
- [函数](#函数)
  - [函数作用](#函数作用)
  - [(lambda)](#lambda)
  - [(define)](#define-1)
- [类型](#类型)
  - [原子类型](#原子类型)
  - [容器类型](#容器类型)
  - [(->)](#-)
  - [(claim)](#claim)
  - [(admit)](#admit)
  - [(the)](#the)
  - [(polymorphic)](#polymorphic)
- [条件](#条件)
  - [(if)](#if)
  - [(when)](#when)
  - [(unless)](#unless)
  - [(cond)](#cond)
  - [(and)](#and)
  - [(or)](#or)
- [顺序与绑定](#顺序与绑定)
  - [(begin)](#begin)
  - [(let)](#let)
  - [(letrec)](#letrec)
  - [local (define)](#local-define)
- [函数组合](#函数组合)
  - [(pipe)](#pipe)
  - [(chain)](#chain)
  - [(compose)](#compose)
- [代数数据类型](#代数数据类型)
  - [(define-algebraic-type)](#define-algebraic-type)
  - [(define-record-type)](#define-record-type)
  - [(define-enum)](#define-enum)
  - [(define-struct)](#define-struct)
  - [(define-struct*)](#define-struct-star)
  - [(match)](#match)
- [不透明类型](#不透明类型)
  - [(define-opaque-type)](#define-opaque-type)
- [模块](#模块)
  - [(module)](#module)
  - [(import)](#import)
  - [(import-as)](#import-as)
  - [(import-all)](#import-all)
  - [(private)](#private)
- [测试](#测试)
  - [(define-test)](#define-test)

# 注释

## 行注释

注释以 `;` 开头，直到行尾。

在写行注释的时候 lisp 程序员通常写两个 `;;`。

```meta-lisp
;; 这是一条注释
(define x 42) ;; 行尾注释
```

## (@comment)

```meta-lisp
(@comment <sexp> ...)
```

`(@comment)` 在编译时被忽略，其表达式求值为 `void`。

```meta-lisp
(@comment (lambda (<parameter> ...)
            <body>))
(@comment (if <condition> <consequent> <alternative>))
(@comment foo bar)
```

`@comment` 被解析器识别为语法关键字，其内容是字面 S 表达式，不会被求值。

# 字面量

## 原子

整数由数字组成，可选负号。

```meta-lisp
42
-1
0
```

浮点数带小数点。

```meta-lisp
3.14
-2.5
```

字符串用双引号包裹。

```meta-lisp
"hello"
""
```

符号用单引号开头，后面跟名字。

```meta-lisp
'foo
'bar
```

关键字用冒号开头。

```meta-lisp
:key
:name
```

布尔值用 `true` 和 `false`，它们不是字面量，而是绑定了布尔值的变量。

空值用 `void`，它也不是字面量，而是绑定了空值的变量。

## (@list)

```meta-lisp
[<exp> ...]
(@list <exp> ...)
```

创建列表。

```meta-lisp
[1 2 3]
["a" "b" "c"]
```

方括号 `[...]` 是 `(@list ...)` 的语法糖。

上面的例子等价于：

```meta-lisp
(@list 1 2 3)
(@list "a" "b" "c")
```

增加 `@` 前缀，是为了避免占用 `list` 这个变量名。

## (@set)

```meta-lisp
(@set <exp> ...)
```

创建集合。

```meta-lisp
(@set 1 2 3)
```

## (@hash)

```meta-lisp
(@hash <key> <value> ...)
```

创建哈希表。

```meta-lisp
(@hash :a 1 :b 2)
(@hash "a" 1 "b" 2)
```

## (@string)

```meta-lisp
(@string <exp> ...)
```

将多个字符串表达式拼接成一个字符串。

```meta-lisp
(@string "hello" " " "world")
(@string "(" x ")")
(@string)
```

上面的例子等价于：

```meta-lisp
(string-concat ["hello" " " "world"])
(string-concat ["(" x ")"])
(string-concat [])
```

## (@quote)

```meta-lisp
'<sexp>
(@quote <sexp>)
```

创建符号或原子列表。

```meta-lisp
'(a b c)         ;; => ['a 'b 'c]
'(1 2 3)         ;; => [1 2 3]
```

等价于：

```meta-lisp
(@quote (a b c))  ;; => ['a 'b 'c]
(@quote (1 2 3))  ;; => [1 2 3]
```

## (@sexp)

```meta-lisp
(@sexp <sexp>)
```

将 s-expression 转化为 `sexp-t` 类型的值，保留每个子节点的源代码位置信息。

`sexp-t` 类型的定义：

```meta-lisp
(define-enum sexp-t
  (symbol-sexp (content symbol-t) (location source-location-t))
  (keyword-sexp (content keyword-t) (location source-location-t))
  (string-sexp (content string-t) (location source-location-t))
  (int-sexp (content int-t) (location source-location-t))
  (float-sexp (content float-t) (location source-location-t))
  (list-sexp (elements (list-t sexp-t)) (location source-location-t)))
```

使用示例：

```meta-lisp
(@sexp foo)           ;; => (symbol-sexp 'foo <location>)
(@sexp (a b c))       ;; => (list-sexp
                      ;;      (list (symbol-sexp 'a) (symbol-sexp 'b) (symbol-sexp 'c))
                      ;;      <location>)
```

# 变量

## (define)

```meta-lisp
(define <name> <exp>)
```

定义模块级变量。

```meta-lisp
(define answer 42)
(define greeting "hello")
```

## 变量

变量引用一个已绑定的名字。

名字由字母、数字和 `-` 等字符组成。

```meta-lisp
x
factorial
list-length
list-empty?
```

## 限定变量

`<module-name>/<name>` 引用其他模块中的名字。

```meta-lisp
builtin/list-length
builtin/list-empty?
```

限定名不需要先 `(import)`，可以直接使用。
`(import)` 是专门用来取消 `<module-name>` 前缀的。


# 函数

## 函数作用

```meta-lisp
(<target> <arg> ...)
```

函数作用是最重要的语法。

如果符号表达式的第一个位置不是语法关键词，就被认为是函数作用。

第一个位置是函数，其余是参数。

先求值函数位置的表达式，
然后求值所有参数位置的表达式，
然后进行函数作用。

```meta-lisp
(iadd 1 2)
(println "hello")
((lambda (x) x) 1)
```

当函数作用的参数个数不足时，会形成部分作用（通过**柯里化**实现）。

```meta-lisp
((iadd 1) 2)
```

等价于：

```meta-lisp
(iadd 1 2)
```

并且 `(iadd 1)` 可以作为值传递给函数，或者作为结果返回。

```meta-lisp
(define add1
  (iadd 1))
```

等价于：

```meta-lisp
(define (add1 x)
  (iadd 1 x))
```

## (lambda)

```meta-lisp
(lambda (<parameter> ...)
  <body>)
```

创建匿名函数。

`(<parameter> ...)` 是形式参数列表，
`<body>` 是一个或多个表达式。
当函数被作用时，实际参数被绑定到形式参数，然后求值 `<body>`。

```meta-lisp
(lambda (x) (iadd x 1))
((lambda (x) (iadd x 1)) 2)  ;; => 3
```

多个参数：

```meta-lisp
(lambda (x y)
  (iadd x y))
```

等价于：

```meta-lisp
(lambda (x)
  (lambda (y)
    (iadd x y)))
```

## (define)

```meta-lisp
(define (<name> <parameter> ...)
  <body>)
```

定义函数。

定义函数等价于定义值为 lambda 的变量。

```meta-lisp
(define (add1 x)
  (iadd 1 x))
```

等价于：

```meta-lisp
(define add1
  (lambda (x)
    (iadd 1 x)))
```

函数体 `<body>` 可以是多个表达式：

```meta-lisp
(define (f x)
  (let ((y (iadd x 1)))
    (imul y 2)))
```

# 类型

## 原子类型

| 类型        | 说明   | 例子                          |
|-------------|--------|-------------------------------|
| `int-t`     | 整数   | `42` `-1`                     |
| `float-t`   | 浮点数 | `3.14` `-2.5`                 |
| `string-t`  | 字符串 | `"hello"`                     |
| `symbol-t`  | 符号   | `'foo`                        |
| `keyword-t` | 关键字 | `:key`                        |
| `bool-t`    | 布尔值 | `true` `false`                |
| `void-t`    | 空值   | `void`                        |
| `file-t`    | 文件   | `(open-input-file "abc.txt")` |

## 容器类型

| 类型           | 说明                       |
|----------------|----------------------------|
| `(list-t E)`   | 元素类型为 `E` 的列表      |
| `(set-t E)`    | 元素类型为 `E` 的集合      |
| `(hash-t K V)` | 键为 `K` 值为 `V` 的哈希表 |

## (->)

```meta-lisp
(-> <arg-type> ... <ret-type>)
```

函数类型。

接收 `<arg-type>` 参数，返回 `<ret-type>`。

例如：

```meta-lisp
(-> int-t int-t)
(-> int-t int-t int-t)
(-> string-t bool-t)
```

## (claim)

```meta-lisp
(claim <name> <type>)
```

声称一个名字的类型。

编译器会从 `(define)` 的 `<body>` 推导出类型，
然后检查是否与 `(claim)` 的类型一致。

```meta-lisp
(claim add1 (-> int-t int-t))
(define (add1 x) (iadd x 1))

(claim answer int-t)
(define answer 42)
```

## (admit)

```meta-lisp
(admit <name> <type>)
```

承认名字的类型。

与 `(claim)` 类似，但是编译器不会检查 `(define)` 的 `<body>`。

```meta-lisp
(admit make-point (-> float-t float-t point-t))
(define (make-point x y)
  (@list 'make-point x y))
```

## (the)

```meta-lisp
(the <type> <exp>)
```

显式标注 `<exp>` 的类型。

编译器会检查 `<exp>` 的实际类型是否匹配。可用于澄清代码意图或帮助类型推断。

```meta-lisp
(the int-t 42)
(the (-> int-t int-t)
  (lambda (x)
    (iadd x 1)))
```

## (polymorphic)

```meta-lisp
(polymorphic (<type-parameter> ...)
  <type>)
```

包含类型变量的类型。

类型变量通常用单个大写字母表示，在 `<type>` 中可以被引用。
用于 `claim` 中声称多态函数。

```meta-lisp
(claim identity (polymorphic (A) (-> A A)))

(claim car (polymorphic (E) (-> (list-t E) E)))
(claim cdr (polymorphic (E) (-> (list-t E) (list-t E))))
(claim cons (polymorphic (E) (-> E (list-t E) (list-t E))))
```


# 条件

## (if)

```meta-lisp
(if <condition>
  <consequent>
  <alternative>)
```

条件分支。

`<condition>` 被求值。
如果为真，求值 `<consequent>` 并返回。
否则求值 `<alternative>` 并返回。

```meta-lisp
(define (abs x)
  (if (int-less? x 0)
    (ineg x)
    x))
```

## (when)

```meta-lisp
(when <condition>
  <body>)
```

条件为真时执行，用于副作用。

`<condition>` 为真时求值 `<body>`，否则跳过。
`<body>` 中可以写多个表达式。
`(when)` 表达式的返回值总是 `void`。

```meta-lisp
(when debug?
  (print "debug mode")
  (newline))
```

## (unless)

```meta-lisp
(unless <condition>
  <body>)
```

条件为假时执行，用于副作用。

`<condition>` 为假时求值 `<body>`，否则跳过。
`<body>` 中可以写多个表达式。
`(unless)` 表达式的返回值总是 `void`。

```meta-lisp
(unless (equal x 0)
  (print (idiv 1 x))
  (newline))
```

## (cond)

```meta-lisp
(cond
  (<question> <answer>)
  ...)
```

多分支条件。

依次求值每个 `<question>`。
第一个为真的分支的 `<answer>` 被求值并返回。
末尾的 `<question>` 可以写 `else` 作为默认分支。

```meta-lisp
(define (classify x)
  (cond
   ((int-positive? x) "positive")
   ((int-negative? x) "negative")
   (else "zero")))
```

## (and)

```meta-lisp
(and <exp> ...)
```

短路与。

从左到右求值。遇到第一个假值就停止并返回该值。全真时返回最后一个值。

```meta-lisp
(and (int? x) (int-positive? x))
```

零个参数时返回 `true`。

## (or)

```meta-lisp
(or <exp> ...)
```

短路或。

从左到右求值。遇到第一个真值就停止并返回该值。全假时返回最后一个值。

```meta-lisp
(or (equal x 0) (equal x 1))
```

零个参数时返回 `false`。

# 顺序与绑定

## (begin)

```meta-lisp
(begin <body>)
```

顺序执行。

`<body>` 可以是多个表达式 `<exp> ...`，
依次求值，返回最后一个表达式的值。
前面的表达式通常是为了副作用。

```meta-lisp
(begin
  (println "step 1")
  (println "step 2")
  42)  ;; => 42
```

`(lambda)` 和 `(define)` 中的 `<body>` 函数体，
都类似于 `(begin)` 的 `<body>`。

```meta-lisp
(define (f x)
  (let ((y (iadd x 1)))
    (imul y 2)))
```

## (let)

```meta-lisp
(let ((<name> <exp>)
      ...)
  <body>)
```

顺序局部变量绑定。

每个 `<exp>` 可以引用前面绑定的名字。

```meta-lisp
(let ((x 1))
  (iadd x 1))  ;; => 2

(let ((x 1)
      (y 2))
  (iadd x y))  ;; => 3

(let ((x 1)
      (y (iadd x 1)))
  (iadd x y))  ;; => 3
```

## (letrec)

```meta-lisp
(letrec ((<name> <exp>)
         ...)
  <body>)
```

类似 `(let)`，但是允许递归与互相递归。

所有 `<exp>` 可以引用所有 `<name>`。

互相递归的例子：

```meta-lisp
(letrec ((is-even
          (lambda (n)
            (if (equal n 0)
              true
              (is-odd (isub n 1)))))
         (is-odd
          (lambda (n)
            (if (equal n 0)
              false
              (is-even (isub n 1))))))
  (assert (is-even 4)))
```

顺序依赖的例子：

```meta-lisp
(letrec ((a 1)
         (b (iadd a 1)))
  b)  ;; => 2
```

## local (define)

```meta-lisp
(define (<name> <parameter> ...) <body>)
(define <name> <exp>)
```

`<body>` 中的局部可递归变量绑定。

允许 `(define)` 在 `<body>` 中使用。
用来代替嵌套的 `(letrec)`，以减少缩进。

互相递归的例子（与 `(letrec)` 的例子等价）：

```meta-lisp
(begin
  (define (is-even n)
    (if (equal n 0)
      true
      (is-odd (isub n 1))))
  (define (is-odd n)
    (if (equal n 0)
      false
      (is-even (isub n 1))))
  (is-even 4))
```

顺序依赖的例子：

```meta-lisp
(begin
  (define a 1)
  (define b (iadd a 1))
  b)  ;; => 2
```

`(let)` 与 `(define)` 可以混合使用：

```meta-lisp
(begin
  (let ((one 1))
    (define a one)
    (define b (iadd a one))
    b))  ;; => 2
```

# 函数组合

## (pipe)

```meta-lisp
(pipe <init> <step> ...)
```

管道。

将 `<init>` 传入第一个 `<step>`，结果传入第二个 `<step>`，以此类推。

```meta-lisp
(pipe 5 add1 double)        ;; => 12
(pipe 2 add1 double square) ;; => 36
```

等价于：

```meta-lisp
(double (add1 5))           ;; => 12
(square (double (add1 2)))  ;;  => 36
```

## (chain)

```meta-lisp
(chain <step> ...)
```

管道式函数复合。

与 `(pipe)` 的区别是 `(chain)` 不传入初始值，而是返回一个函数。

```meta-lisp
(chain add1 double)
(chain add1 double square)
```

等价于：

```meta-lisp
(lambda (x) (pipe x add1 double))
(lambda (x) (pipe x add1 double square))
```

等价于：

```meta-lisp
(lambda (x) (double (add1 x)))
(lambda (x) (square (double (add1 x))))
```

## (compose)

```meta-lisp
(compose <step> ...)
```

数学式函数组合。

与 `(chain)` 的复合方向相反。

```meta-lisp
(compose add1 double)
(compose add1 double square)
```

等价于：

```meta-lisp
(lambda (x) (add1 (double x)))
(lambda (x) (add1 (double (square x))))
```

# 代数数据类型

**代数数据类型**（Algebraic data type）是 meta-lisp 的核心数据类型。

meta-lisp 提供了从**显式**（explicit）到便捷的多种语法来定义数据类型：

| 语法                      | 用途                         |
|---------------------------|------------------------------|
| `(define-algebraic-type)` | 多构造器，所有名字由你指定   |
| `(define-record-type)`    | 单构造器，所有名字由你指定   |
| `(define-struct*)`        | 单构造器，可指定构造器名字   |
| `(define-struct)`         | 单构造器，按约定生成所有名字 |
| `(define-enum)`           | 多构造器，按约定生成所有名字 |

所有便捷语法最终都展开为 `(define-algebraic-type)`。
其中最常用的是 `(define-enum)` 和 `(define-struct)`。

## (define-algebraic-type)

```meta-lisp
(define-algebraic-type <type-name>
  ((<constructor-name> (<field-name> <type>) ...)
   <predicate-name>
   (<field-name> <accessor-name> <modifier-name>)
   ...)
  ...)

(define-algebraic-type (<type-name> <type-parameter> ...)
  ((<constructor-name> (<field-name> <type>) ...)
   <predicate-name>
   (<field-name> <accessor-name> <modifier-name>)
   ...)
  ...)
```

**代数数据类型**（algebraic data type）是构建复合数据结构的核心机制。

`(define-algebraic-type)` 是最基础的语法形式，其中所有名字由你显式指定。

只有 `<modifier-name>` 是可选的。
如果不写，这个 field 的引用就是不可修改的。

例如：

```meta-lisp
(define-algebraic-type point-t
  ((make-point (x float-t) (y float-t))
   point?
   (x point-x point-put-x)
   (y point-y point-put-y)))
```

将会生成具有下列类型的函数：

```meta-lisp
(claim make-point (-> float-t float-t point-t))
(claim point? (-> point-t bool-t))
(claim point-x (-> point-t float-t))
(claim point-y (-> point-t float-t))
(claim point-put-x (-> float-t point-t point-t))
(claim point-put-y (-> float-t point-t point-t))
```

使用举例：

```meta-lisp
(define p (make-point 1.0 2.0))
(point? p)      ;; => true
(point-x p)     ;; => 1.0
(point-put-x p 3.0)
(point-x p)     ;; => 3.0
```

对于只有单一构造器的代数类型而言，
谓词 `point?` 是多余的，没有意义的。
只有代数类型有多个构造器时，
所生成的谓词才有意义。

`(define-algebraic-type)` 所定义的类型可以带有类型参数。

例如：

```meta-lisp
(define-algebraic-type (my-list-t E)
  ((nil)
   nil?)
  ((li (head E) (tail (my-list-t E)))
   li?
   (head li-head li-put-head)
   (tail li-tail li-put-tail)))
```

将会生成具有下列类型的函数：

```meta-lisp
(claim nil (polymorphic (E) (-> (my-list-t E))))
(claim nil? (polymorphic (E) (-> (my-list-t E) bool-t)))
(claim li (polymorphic (E) (-> E (my-list-t E) (my-list-t E))))
(claim li? (polymorphic (E) (-> (my-list-t E) bool-t)))
(claim li-head (polymorphic (E) (-> (my-list-t E) E)))
(claim li-tail (polymorphic (E) (-> (my-list-t E) (my-list-t E))))
(claim li-put-head (polymorphic (E) (-> E (my-list-t E) (my-list-t E))))
(claim li-put-tail (polymorphic (E) (-> (my-list-t E) (my-list-t E) (my-list-t E))))
```

## (define-record-type)

```meta-lisp
(define-record-type <type-name>
  (<constructor-name> (<field-name> <type>) ...)
  <predicate-name>
  (<field-name> <accessor-name> <modifier-name>)
  ...)

(define-record-type (<type-name> <type-parameter> ...)
  (<constructor-name> (<field-name> <type>) ...)
  <predicate-name>
  (<field-name> <accessor-name> <modifier-name>)
  ...)
```

与 `(define-algebraic-type)` 类似，但是只有一个构造器。

```meta-lisp
(define-record-type point-t
  (make-point (x float-t) (y float-t))
  point?
  (x point-x point-put-x)
  (y point-y point-put-y))
```

等价于：

```meta-lisp
(define-algebraic-type point-t
  ((make-point (x float-t) (y float-t))
   point?
   (x point-x point-put-x)
   (y point-y point-put-y)))
```

`(define-record-type)` 这个语法来自 scheme，
起源于 scheme 48 这个 scheme 方言。

我们给这个语法加上了 `<field-name>` 的类型声明，
即 `(<field-name> <type>)`。

`(define-algebraic-type)` 模仿 `(define-record-type)`，
进一步支持了多个构造器。

## (define-enum)

```meta-lisp
(define-enum <type-name>
  (<constructor-name> (<field-name> <type>) ...)
  ...)

(define-enum (<type-name> <type-parameter> ...)
  (<constructor-name> (<field-name> <type>) ...)
  ...)
```

定义多个构造器的代数数据类型。
每个构造器按照约定生成谓词、访问器和修改器的名字。

```meta-lisp
(define-enum exp-t
  (var-exp (name symbol-t))
  (apply-exp (target exp-t) (arg exp-t))
  (lambda-exp (parameter symbol-t) (body exp-t)))
```

等价于：

```meta-lisp
(define-algebraic-type exp-t
  ((var-exp (name symbol-t))
   var-exp?
   (name var-exp-name var-exp-put-name))
  ((apply-exp (target exp-t) (arg exp-t))
   apply-exp?
   (target apply-exp-target apply-exp-put-target)
   (arg apply-exp-arg apply-exp-put-arg))
  ((lambda-exp (parameter symbol-t) (body exp-t))
   lambda-exp?
   (parameter lambda-exp-parameter lambda-exp-put-parameter)
   (body lambda-exp-body lambda-exp-put-body)))
```

对于某个给定的 `<constructor-name>` 生成其名字的规则如下：

- `<predicate-name>` = `<constructor-name>?` -- `var-exp?`
- `<accessor-name>` = `<constructor-name>-<field-name>` -- `var-exp-name`
- `<modifier-name>` = `<constructor-name>-put-<field-name>` -- `var-exp-put-name`

## (define-struct)

```meta-lisp
(define-struct <type-name>
  (<field-name> <type>)
  ...)

(define-struct (<type-name> <type-parameter> ...)
  (<field-name> <type>)
  ...)
```

定义单构造器结构体。
`<type-name>` 类型名必须以 `-t` 结尾，
格式为 `<base-name>-t`。
其中 `<base-name>` 将被用于生成其他名字。

```meta-lisp
(define-struct point-t
  (x float-t)
  (y float-t))
```

等价于：

```meta-lisp
(define-algebraic-type point-t
  ((make-point (x float-t) (y float-t))
   point?
   (x point-x point-put-x)
   (y point-y point-put-y)))
```

对于某个给定的 `<type-name>` 生成其名字的规则如下：

- `<type-name>` = `<base-name>-t` -- `point-t`
- `<predicate-name>` = `<base-name>?` -- `point?`
- `<constructor-name>` = `make-<base-name>` -- `make-point`
- `<accessor-name>` = `<base-name>-<field-name>` -- `point-x`
- `<modifier-name>` = `<base-name>-put-<field-name>` -- `point-put-x`

<a name="define-struct-star"></a>
## (define-struct*)

```meta-lisp
(define-struct* <type-name>
  (<constructor-name>
   (<field-name> <type>)
   ...))

(define-struct* (<type-name> <type-parameter> ...)
  (<constructor-name>
   (<field-name> <type>)
   ...))
```


与 `(define-struct)` 类似，但是 `<constructor-name>` 由用户给出。

```meta-lisp
(define-struct* point-t
  (make-point
   (x float-t)
   (y float-t)))
```

等价于：

```meta-lisp
(define-struct point-t
  (x float-t)
  (y float-t))
```

之所以给 `(define-struct)` 增加这个变体，
是因为有时需要把 `make-<base-name>` 保留给更简单的构造器。

```meta-lisp
(define-struct* package-t
  (make-package
   (root-directory string-t)
   (config package-config-t)
   (fragments (hash-t string-t fragment-t))))

(define (empty-package root-directory config)
  (make-package root-directory config (make-hash)))
```

## (match)

```meta-lisp
(match <target>
  (<pattern> <body>)
  ...)
```

用模式匹配的方式解构代数数据类型。

```meta-lisp
(define-enum exp-t
  (var-exp (name symbol-t))
  (apply-exp (target exp-t) (arg exp-t))
  (lambda-exp (parameter symbol-t) (body exp-t)))

(define (evaluate exp env)
  (match exp
    ((var-exp name)
     (env-lookup-of-fail name env))
    ((apply-exp target arg)
     (apply (evaluate target env) (evaluate arg env)))
    ((lambda-exp parameter body)
     (closure-value env parameter body))))
```

# 不透明类型

## (define-opaque-type)

```meta-lisp
(define-opaque-type <type-name> <representation-type>
  (<interface-name> <interface-type>)
  ...)

(define-opaque-type (<type-name> <type-parameter> ...) <representation-type>
  (<interface-name> <interface-type>)
  ...)
```

定义不透明类型，隐藏内部表示。

例如 builtin 中的 `box-t`，内部表示为 `(list-t E)`：

```meta-lisp
(define-opaque-type (box-t E) (list-t E)
  (make-box (-> (box-t E)))
  (box-is-empty (-> (box-t E) bool-t))
  (box-put (-> E (box-t E) (box-t E)))
  (box-get-maybe (-> (box-t E) (maybe-t E))))
```

在实现接口函数的时候，等价于声明了：

```meta-lisp
(claim make-box (polymorphic (E) (-> (list-t E))))
(claim box-is-empty (polymorphic (E) (-> (list-t E) bool-t)))
(claim box-put (polymorphic (E) (-> E (list-t E) (list-t E))))
(claim box-get-maybe (polymorphic (E) (-> (list-t E) (maybe-t E))))
```

因此接口函数内部可以使用 list API 来实现：

```meta-lisp
(define (make-box) (make-list))

(define (box-put value box)
  (if (box-is-empty box)
    (list-push value box)
    (list-put 0 value box)))
```

在使用接口函数的时候，等价于声明了：

```meta-lisp
(claim make-box (polymorphic (E) (-> (box-t E))))
(claim box-is-empty (polymorphic (E) (-> (box-t E) bool-t)))
(claim box-put (polymorphic (E) (-> E (box-t E) (box-t E))))
(claim box-get-maybe (polymorphic (E) (-> (box-t E) (maybe-t E))))
```

外部代码只能通过接口函数来操作 `box-t`：

```meta-lisp
(claim box-get (polymorphic (E) (-> (box-t E) E)))
(define (box-get box)
  (match (box-get-maybe box)
    ((just value) value)
    ((nothing) (error "box is empty"))))
```

# 模块

一个文件夹可以被视为一个**项目**（package），
项目中的所有 `.meta` 文件，都被视为属于这个项目。

一个项目中可以有多个**模块**（module）。

模块系统与文件系统解耦，存放模块的路径和文件名并不重要。
同一模块的代码，可以拆分到不同文件中。

## (module)

```meta-lisp
(module <module-name>)
```

声明当前模块。

每个 `.meta` 文件必带有一个模块声明，一般放在开头。

在同一个项目中，可以通过 `<module-name>/<name>` 引用别的模块中的名字。

同一个模块中的函数，就算写在不同的文件中，也可以相互递归。

`even.meta`:

```meta-lisp
(module example)

(define (is-even n)
  (if (equal n 0)
    true
    (is-odd (isub n 1))))
```

`odd.meta`:

```meta-lisp
(module example)

(define (is-odd n)
  (if (equal n 0)
    false
    (is-even (isub n 1))))
```

## (import)

```meta-lisp
(import <module-name> <name> ...)
```

从其他模块导入指定名字。

导入后可以直接使用，不需要限定前缀。

```meta-lisp
(import math pi circumference)
```

之后，

```meta-lisp
math/pi
math/circumference
```

可简写为：

```meta-lisp
pi
circumference
```

## (import-as)

```meta-lisp
(import-as <module-name> <prefix>)
```

导入模块并修改前缀。

`<module-name>/<name>` 改为 `<prefix>/<name>`。

```meta-lisp
(import-as meta m)
```

之后，

```meta-lisp
meta/exp-t
```

可简写为：

```meta-lisp
m/exp-t
```

## (import-all)

```meta-lisp
(import-all <module-name>)
```

导入模块中所有名字。

使得所有名字都可以不用前缀就能引用。

如果当前模块已经有重复的名字，
就略过这个名字不导入。

因此，不带前缀的引用，还是会引用到当前模块自己的名字。
或者说本地的定义，可以覆盖 `(import-all)` 所引入的定义。

## (private)

```meta-lisp
(private <name> ...)
```

将名字标记为私有。

被标记为私有的名字不能被其他模块引用。

```meta-lisp
(module serial-number)

(private serial-number-hash)
(define serial-number-hash (make-hash))
```

# 测试

## (define-test)

```meta-lisp
(define-test <test-name> <body>)
```

定义测试。

`<body>` 中可以包含多个断言。

```meta-lisp
(claim add1 (-> int-t int-t))
(define (add1 x) (iadd x 1))

(define-test add1-test
  (assert-equal 2 (add1 1))
  (assert-equal 0 (add1 -1)))
```

支持以下断言：

- `(assert x)` -- 断言 `x` 为 `true`。
- `(assert-not x)` -- 断言 `x` 为 `false`。
- `(assert-equal lhs rhs)` -- 断言 `lhs` 与 `rhs` 相等（使用 `equal` 比较）。
- `(assert-not-equal lhs rhs)` -- 断言 `lhs` 与 `rhs` 不相等。
