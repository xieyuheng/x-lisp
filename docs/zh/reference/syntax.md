---
title: 语法
---

meta-lisp 使用**符号表达式**（S-expression）语法。

- 模块顶层由**语句**（statement）组成。
- 语句内由**表达式**（expression）组成。

下面分组介绍 meta-lisp 的所有语法。

- [注释](#注释)
- [字面量](#字面量)
  - [原子](#原子)
  - [容器](#容器)
  - [(quote)](#quote)
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
  - [(let*)](#let-1)
  - [(=)](#)
  - [(letrec)](#letrec)
  - [(letrec*)](#letrec-1)
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
  - [(define-struct*)](#define-struct-1)
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

注释以 `;` 开头，直到行尾。

在写行注释的时候 lisp 程序员通常写两个 `;;`。

```scheme
;; 这是一条注释
(define x 42) ;; 行尾注释
```

# 字面量

## 原子

整数由数字组成，可选负号。

```scheme
42
-1
0
```

浮点数带小数点。

```scheme
3.14
-2.5
```

字符串用双引号包裹。

```scheme
"hello"
""
```

符号用单引号开头，后面跟名字。

```scheme
'foo
'bar
```

关键字用冒号开头。

```scheme
:key
:name
```

布尔值用 `true` 和 `false`，它们不是字面量，而是绑定了布尔值的变量。

空值用 `void`，它也不是字面量，而是绑定了空值的变量。

## 容器

`(@list)` 创建列表。

```scheme
(@list 1 2 3)
```

增加 `@` 前缀，是为了避免占用 `list` 这个变量名。

`(@set)` 创建集合。

```scheme
(@set 1 2 3)
```

`(@hash)` 创建哈希表。

```scheme
(@hash :a 1 :b 2)
(@hash "a" 1 "b" 2)
```

方括号 `[...]` 是 `@list` 的语法糖。

```scheme
[1 2 3]
["a" "b" "c"]
```

等价于：

```scheme
(@list 1 2 3)
(@list "a" "b" "c")
```

## (quote)

```scheme
'<exp>
(quote <exp>)
```

阻止 `exp` 被求值，通常用来创建列表数据。

```scheme
'(1 2 3)         ;; => [1 2 3]
'(a b c)         ;; => ['a 'b 'c]
'foo             ;; => 'foo
```

等价于：

```scheme
(quote (1 2 3))  ;; => [1 2 3]
(quote (a b c))  ;; => ['a 'b 'c]
(quote foo)      ;; => 'foo
```

# 变量

## (define)

```scheme
(define <name> <exp>)
```

定义模块级变量。

```scheme
(define answer 42)
(define greeting "hello")
```

## 变量

变量引用一个已绑定的名字。

名字由字母、数字和 `-` `?` `!` 等字符组成。

```scheme
x
factorial
list-length
list-empty?
```

## 限定变量

`<module-name>/<name>` 引用其他模块中的名字。

```scheme
builtin/list-length
builtin/list-empty?
```

限定名不需要先 `(import)`，可以直接使用。
`(import)` 是专门用来取消 `<module-name>` 前缀的。


# 函数

## 函数作用

```scheme
(<target> <arg> ...)
```

函数作用是最重要的语法。

如果符号表达式的第一个位置不是语法关键词，就被认为是函数作用。

第一个位置是函数，其余是参数。

先求值函数位置的表达式，
然后求值所有参数位置的表达式，
然后进行函数作用。

```scheme
(iadd 1 2)
(println "hello")
((lambda (x) x) 1)
```

当函数作用的参数个数不足时，会形成部分作用，又称作**柯里化**（currying）。

```scheme
((iadd 1) 2)
```

等价于：

```scheme
(iadd 1 2)
```

并且 `(iadd 1)` 可以作为值传递给函数，或者作为结果返回。

```scheme
(define add1
  (iadd 1))
```

等价于：

```scheme
(define (add1 x)
  (iadd 1 x))
```

## (lambda)

```scheme
(lambda (<parameter> ...)
  <body>)
```

创建匿名函数。

`(<parameter> ...)` 是形式参数列表，
`<body>` 是一个或多个表达式。
当函数被作用时，实际参数被绑定到形式参数，然后求值 `<body>`。

```scheme
(lambda (x) (iadd x 1))
((lambda (x) (iadd x 1)) 2)  ;; => 3
```

多个参数：

```scheme
(lambda (x y)
  (iadd x y))
```

等价于：

```scheme
(lambda (x)
  (lambda (y)
    (iadd x y)))
```

## (define)

```scheme
(define (<name> <parameter> ...)
  <body>)
```

定义函数。

定义函数等价于定义值为 lambda 的变量。

```scheme
(define (add1 x)
  (iadd 1 x))
```

等价于：

```scheme
(define add1
  (lambda (x)
    (iadd 1 x)))
```

函数体 `<body>` 可以是多个表达式：

```scheme
(define (f x)
  (= y (iadd x 1))
  (imul y 2))
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

```scheme
(-> <arg-type> ... <ret-type>)
```

函数类型。

接收 `<arg-type>` 参数，返回 `<ret-type>`。

例如：

```scheme
(-> int-t int-t)
(-> int-t int-t int-t)
(-> string-t bool-t)
```

## (claim)

```scheme
(claim <name> <type>)
```

声称一个名字的类型。

编译器会从 `(define)` 的 `<body>` 推导出类型，
然后检查是否与 `(claim)` 的类型一致。

```scheme
(claim add1 (-> int-t int-t))
(define (add1 x) (iadd x 1))

(claim answer int-t)
(define answer 42)
```

## (admit)

```scheme
(admit <name> <type>)
```

承认名字的类型。

与 `(claim)` 类似，但是编译器不会检查 `(define)` 的 `<body>`。

```scheme
(admit make-point (-> float-t float-t point-t))
(define (make-point x y)
  (@list 'make-point x y))
```

## (the)

```scheme
(the <type> <exp>)
```

显式标注 `<exp>` 的类型。

编译器会检查 `<exp>` 的实际类型是否匹配。可用于澄清代码意图或帮助类型推断。

```scheme
(the int-t 42)
(the (-> int-t int-t)
  (lambda (x)
    (iadd x 1)))
```

## (polymorphic)

```scheme
(polymorphic (<type-parameter> ...)
  <type>)
```

包含类型变量的类型。

类型变量通常用单个大写字母表示，在 `<type>` 中可以被引用。
用于 `claim` 中声称多态函数。

```scheme
(claim identity (polymorphic (A) (-> A A)))

(claim car (polymorphic (E) (-> (list-t E) E)))
(claim cdr (polymorphic (E) (-> (list-t E) (list-t E))))
(claim cons (polymorphic (E) (-> E (list-t E) (list-t E))))
```


# 条件

## (if)

```scheme
(if <condition>
  <consequent>
  <alternative>)
```

条件分支。

`<condition>` 被求值。
如果为真，求值 `<consequent>` 并返回。
否则求值 `<alternative>` 并返回。

```scheme
(define (abs x)
  (if (int-less? x 0)
    (ineg x)
    x))
```

## (when)

```scheme
(when <condition>
  <body>)
```

条件为真时执行，用于副作用。

`<condition>` 为真时求值 `<body>`，否则跳过。
`<body>` 中可以写多个表达式。
`(when)` 表达式的返回值总是 `void`。

```scheme
(when debug?
  (print "debug mode")
  (newline))
```

## (unless)

```scheme
(unless <condition>
  <body>)
```

条件为假时执行，用于副作用。

`<condition>` 为假时求值 `<body>`，否则跳过。
`<body>` 中可以写多个表达式。
`(unless)` 表达式的返回值总是 `void`。

```scheme
(unless (equal? x 0)
  (print (idiv 1 x))
  (newline))
```

## (cond)

```scheme
(cond
  (<question> <answer>)
  ...)
```

多分支条件。

依次求值每个 `<question>`。
第一个为真的分支的 `<answer>` 被求值并返回。
末尾的 `<question>` 可以写 `else` 作为默认分支。

```scheme
(define (classify x)
  (cond
   ((int-positive? x) "positive")
   ((int-negative? x) "negative")
   (else "zero")))
```

## (and)

```scheme
(and <exp> ...)
```

短路与。

从左到右求值。遇到第一个假值就停止并返回该值。全真时返回最后一个值。

```scheme
(and (int? x) (int-positive? x))
```

零个参数时返回 `true`。

## (or)

```scheme
(or <exp> ...)
```

短路或。

从左到右求值。遇到第一个真值就停止并返回该值。全假时返回最后一个值。

```scheme
(or (equal? x 0) (equal? x 1))
```

零个参数时返回 `false`。

# 顺序与绑定

## (begin)

```scheme
(begin <body>)
```

顺序执行。

`<body>` 可以是多个表达式 `<exp> ...`，
依次求值，返回最后一个表达式的值。
前面的表达式通常是为了副作用。

```scheme
(begin
  (println "step 1")
  (println "step 2")
  42)  ;; => 42
```

`(lambda)` 和 `(define)` 中的 `<body>` 函数体，
都类似于 `(begin)` 的 `<body>`。

```scheme
(define (f x)
  (= y (iadd x 1))
  (imul y 2))
```

## (let)

```scheme
(let ((<name> <exp>)
      ...)
  <body>)
```

并行局部变量绑定。

所有右侧 `<exp>` 在同一个外层作用域中求值，互相不可见。
然后所有 `<name>` 同时绑定到求值结果，再求值 `<body>`。

```scheme
(let ((x 1))
  (iadd x 1))  ;; => 2

(let ((x 1)
      (y 2))
  (iadd x y))  ;; => 3
```

并行意味着后面的绑定不能引用前面的：

```scheme
(let ((x 1)
      (y (iadd x 1)))  ;; 错误：x 在右侧不可见
  (iadd x y))
```

## (let*)

```scheme
(let* ((<name> <exp>)
       ...)
  <body>)
```

顺序局部变量绑定。

每个 `<exp>` 可以引用前面绑定的名字。

```scheme
(let* ((x 1)
       (y (iadd x 1)))
  (iadd x y))  ;; => 3
```

`(let*)` 等价于嵌套的 `(let)`：

```scheme
(let ((x 1))
  (let ((y (iadd x 1)))
    (iadd x y)))
```

## (=)

```scheme
(= <name> <exp>)
```

`<body>` 中的局部变量绑定。

只能在 `<body>` 中使用。
用来代替嵌套的 `(let)`，以减少缩进。

```scheme
(define (f x)
  (= y (iadd x 1))
  (println y)
  (= z (iadd y 1))
  (println z)
  (iadd y z))
```

等价于：

```scheme
(define (f x)
  (let ((y (iadd x 1)))
    (println y)
    (let ((z (iadd y 1)))
      (println z)
      (iadd y z))))
```

## (letrec)

```scheme
(letrec ((<name> <exp>)
         ...)
  <body>)
```

类似 `(let)`，但是允许递归与互相递归。

所有 `<exp>` 在同一作用域中求值，互相不可见对方的值。
所有 `<name>` 同时绑定到求值结果，然后求值 `<body>`。

互相递归的例子：

```scheme
(letrec ((even?
          (lambda (n)
            (if (equal? n 0)
              true
              (odd? (isub n 1)))))
         (odd?
          (lambda (n)
            (if (equal? n 0)
              false
              (even? (isub n 1))))))
  (assert (even? 4)))
```

与 `(letrec*)`（见下文）的区别：

```scheme
;; (letrec*) 支持顺序依赖：
(letrec* ((a 1)
          (b (iadd a 1)))
  b)  ;; => 2

;; (letrec) 的并行语义不支持顺序依赖：
(letrec ((a 1)
         (b (iadd a 1)))  ;; 错误：a 在此处不可见
  b)
```


## (letrec*)

```scheme
(letrec* ((<name> <exp>)
          ...)
  <body>)
```

与 `(let*)` 类似，但是允许递归与互相递归。

所有 `<exp>` 可以引用所有 `<name>`。

互相递归的例子：

```scheme
(letrec* ((even?
           (lambda (n)
             (if (equal? n 0)
               true
               (odd? (isub n 1)))))
          (odd?
           (lambda (n)
             (if (equal? n 0)
               false
               (even? (isub n 1))))))
  (assert (even? 4)))
```

顺序依赖的例子：

```scheme
(letrec* ((a 1)
          (b (iadd a 1)))
  b)  ;; => 2
```

## local (define)

```scheme
(define (<name> <parameter> ...) <body>)
(define <name> <exp>)
```

`<body>` 中的局部可递归变量绑定。

允许 `(define)` 在 `<body>` 中使用。
用来代替嵌套的 `(letrec*)`，以减少缩进。

互相递归的例子（与 `(letrec*)` 的例子等价）：

```scheme
(begin
  (define (even? n)
    (if (equal? n 0)
      true
      (odd? (isub n 1))))
  (define (odd? n)
    (if (equal? n 0)
      false
      (even? (isub n 1))))
  (even? 4))
```

顺序依赖的例子：

```scheme
(begin
  (define a 1)
  (define b (iadd a 1))
  b)  ;; => 2
```

`(=)` 与 `(define)` 可以混合使用：

```scheme
(begin
  (= one 1)
  (define a one)
  (define b (iadd a one))
  b)  ;; => 2
```


# 函数组合

## (pipe)

```scheme
(pipe <init> <step> ...)
```

管道。

将 `<init>` 传入第一个 `<step>`，结果传入第二个 `<step>`，以此类推。

```scheme
(pipe 5 add1 double)        ;; => 12
(pipe 2 add1 double square) ;; => 36
```

等价于：

```scheme
(double (add1 5))           ;; => 12
(square (double (add1 2)))  ;;  => 36
```

## (chain)

```scheme
(chain <step> ...)
```

管道式函数复合。

与 `(pipe)` 的区别是 `(chain)` 不传入初始值，而是返回一个函数。

```scheme
(chain add1 double)
(chain add1 double square)
```

等价于：

```scheme
(lambda (x) (pipe x add1 double))
(lambda (x) (pipe x add1 double square))
```

等价于：

```scheme
(lambda (x) (double (add1 x)))
(lambda (x) (square (double (add1 x))))
```

## (compose)

```scheme
(compose <step> ...)
```

数学式函数组合。

与 `(chain)` 的复合方向相反。

```scheme
(compose add1 double)
(compose add1 double square)
```

等价于：

```scheme
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

```scheme
(define-algebraic-type <type-name>
  ((<constructor-name> (<field-name> <type>) ...)
   <predicate-name>
   (<field-name> <accessor-name> <modifier-name>)
   ...)
  ...)
```

或带有类型参数：

```scheme
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

```scheme
(define-algebraic-type point-t
  ((make-point (x float-t) (y float-t))
   point?
   (x point-x point-put-x!)
   (y point-y point-put-y!)))
```

将会生成具有下列类型的函数：

```scheme
(claim make-point (-> float-t float-t point-t))
(claim point? (-> point-t bool-t))
(claim point-x (-> point-t float-t))
(claim point-y (-> point-t float-t))
(claim point-put-x! (-> float-t point-t point-t))
(claim point-put-y! (-> float-t point-t point-t))
```

使用举例：

```scheme
(define p (make-point 1.0 2.0))
(point? p)      ;; => true
(point-x p)     ;; => 1.0
(point-put-x! p 3.0)
(point-x p)     ;; => 3.0
```

对于只有单一构造器的代数类型而言，
谓词 `point?` 是多余的，没有意义的。
只有代数类型有多个构造器时，
所生成的谓词才有意义。

`(define-algebraic-type)` 所定义的类型可以带有类型参数。

例如：

```scheme
(define-algebraic-type (my-list-t E)
  ((nil)
   nil?)
  ((li (head E) (tail (my-list-t E)))
   li?
   (head li-head li-put-head!)
   (tail li-tail li-put-tail!)))
```

将会生成具有下列类型的函数：

```scheme
(claim nil (polymorphic (E) (-> (my-list-t E))))
(claim nil? (polymorphic (E) (-> (my-list-t E) bool-t)))
(claim li (polymorphic (E) (-> E (my-list-t E) (my-list-t E))))
(claim li? (polymorphic (E) (-> (my-list-t E) bool-t)))
(claim li-head (polymorphic (E) (-> (my-list-t E) E)))
(claim li-tail (polymorphic (E) (-> (my-list-t E) (my-list-t E))))
(claim li-put-head! (polymorphic (E) (-> E (my-list-t E) (my-list-t E))))
(claim li-put-tail! (polymorphic (E) (-> (my-list-t E) (my-list-t E) (my-list-t E))))
```

## (define-record-type)

```scheme
(define-record-type <type-name>
  (<constructor-name> (<field-name> <type>) ...)
  <predicate-name>
  (<field-name> <accessor-name> <modifier-name>)
  ...)
```

或带有类型参数：

```scheme
(define-record-type (<type-name> <type-parameter> ...)
  (<constructor-name> (<field-name> <type>) ...)
  <predicate-name>
  (<field-name> <accessor-name> <modifier-name>)
  ...)
```

与 `(define-algebraic-type)` 类似，但是只有一个构造器。

```scheme
(define-record-type point-t
  (make-point (x float-t) (y float-t))
  point?
  (x point-x point-put-x!)
  (y point-y point-put-y!))
```

等价于：

```scheme
(define-algebraic-type point-t
  ((make-point (x float-t) (y float-t))
   point?
   (x point-x point-put-x!)
   (y point-y point-put-y!)))
```

`(define-record-type)` 这个语法来自 scheme，
起源于 scheme 48 这个 scheme 方言。

我们给这个语法加上了 `<field-name>` 的类型声明，
即 `(<field-name> <type>)`。

`(define-algebraic-type)` 模仿 `(define-record-type)`，
进一步支持了多个构造器。

## (define-enum)

```scheme
(define-enum <type-name>
  (<constructor-name> (<field-name> <type>) ...)
  ...)
```

或带有类型参数：

```scheme
(define-enum (<type-name> <type-parameter> ...)
  (<constructor-name> (<field-name> <type>) ...)
  ...)
```

定义多个构造器的代数数据类型。
每个构造器按照约定生成谓词、访问器和修改器的名字。

```scheme
(define-enum exp-t
  (var-exp (name symbol-t))
  (apply-exp (target exp-t) (arg exp-t))
  (lambda-exp (parameter symbol-t) (body exp-t)))
```

等价于：

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

对于某个给定的 `<constructor-name>` 生成其名字的规则如下：

- `<predicate-name>` = `<constructor-name>?` -- `var-exp?`
- `<accessor-name>` = `<constructor-name>-<field-name>` -- `var-exp-name`
- `<modifier-name>` = `<constructor-name>-put-<field-name>!` -- `var-exp-put-name!`

## (define-struct)

```scheme
(define-struct <type-name>
  (<field-name> <type>)
  ...)
```

或带有类型参数：

```scheme
(define-struct (<type-name> <type-parameter> ...)
  (<field-name> <type>)
  ...)
```

定义单构造器结构体。
`<type-name>` 类型名必须以 `-t` 结尾，
格式为 `<base-name>-t`。
其中 `<base-name>` 将被用于生成其他名字。

```scheme
(define-struct point-t
  (x float-t)
  (y float-t))
```

等价于：

```scheme
(define-algebraic-type point-t
  ((make-point (x float-t) (y float-t))
   point?
   (x point-x point-put-x!)
   (y point-y point-put-y!)))
```

对于某个给定的 `<type-name>` 生成其名字的规则如下：

- `<type-name>` = `<base-name>-t` -- `point-t`
- `<predicate-name>` = `<base-name>?` -- `point?`
- `<accessor-name>` = `<base-name>-<field-name>` -- `point-x`
- `<modifier-name>` = `<base-name>-put-<field-name>!` -- `point-put-x!`

## (define-struct*)

```scheme
(define-struct* <type-name>
  (<constructor-name>
   (<field-name> <type>)
   ...))
```

或带有类型参数：

```scheme
(define-struct* (<type-name> <type-parameter> ...)
  (<constructor-name>
   (<field-name> <type>)
   ...))
```


与 `(define-struct)` 类似，但是 `<constructor-name>` 由用户给出。

```scheme
(define-struct* point-t
  (make-point
   (x float-t)
   (y float-t)))
```

等价于：

```scheme
(define-struct point-t
  (x float-t)
  (y float-t))
```

之所以给 `(define-struct)` 增加这个变体，
是因为有时需要把 `make-<base-name>` 保留给更简单的构造器。

```scheme
(define-struct* project-t
  (cons-project
   (root-directory string-t)
   (config project-config-t)
   (fragments (hash-t string-t mod-fragment-t))))

(define (make-project root-directory config)
  (cons-project root-directory config (make-hash)))
```

## (match)

```scheme
(match <target>
  (<pattern> <body>)
  ...)
```

用模式匹配的方式解构代数数据类型。

```scheme
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

```scheme
(define-opaque-type (<name> <type-parameter> ...) <representation-type>
  (<interface-name> <interface-type>)
  ...)
```

定义不透明类型，隐藏内部表示。

例如 builtin 中的 `box-t`，内部表示为 `(list-t E)`：

```scheme
(define-opaque-type (box-t E) (list-t E)
  (make-box (-> (box-t E)))
  (box-empty? (-> (box-t E) bool-t))
  (box-put! (-> E (box-t E) (box-t E)))
  (box-get-maybe (-> (box-t E) (maybe-t E))))
```

在实现接口函数的时候，等价于声明了：

```scheme
(claim make-box (polymorphic (E) (-> (list-t E))))
(claim box-empty? (polymorphic (E) (-> (list-t E) bool-t)))
(claim box-put! (polymorphic (E) (-> E (list-t E) (list-t E))))
(claim box-get-maybe (polymorphic (E) (-> (list-t E) (maybe-t E))))
```

因此接口函数内部可以使用 list API 来实现：

```scheme
(define (make-box) (make-list))

(define (box-put! value box)
  (if (box-empty? box)
    (list-push! value box)
    (list-put! 0 value box)))
```

在使用接口函数的时候，等价于声明了：

```scheme
(claim make-box (polymorphic (E) (-> (box-t E))))
(claim box-empty? (polymorphic (E) (-> (box-t E) bool-t)))
(claim box-put! (polymorphic (E) (-> E (box-t E) (box-t E))))
(claim box-get-maybe (polymorphic (E) (-> (box-t E) (maybe-t E))))
```

外部代码只能通过接口函数来操作 `box-t`：

```scheme
(claim box-get (polymorphic (E) (-> (box-t E) E)))
(define (box-get box)
  (match (box-get-maybe box)
    ((just value) value)
    ((nothing) (error "box is empty"))))
```

# 模块

一个文件夹可以被视为一个**项目**（project），
项目中的所有 `.meta` 文件，都被视为属于这个项目。

一个项目中可以有多个**模块**（module）。

模块系统与文件系统解耦，存放模块的路径和文件名并不重要。
同一模块的代码，可以拆分到不同文件中。

## (module)

```scheme
(module <module-name>)
```

声明当前模块。

每个 `.meta` 文件必带有一个模块声明，一般放在开头。

在同一个项目中，可以通过 `<module-name>/<name>` 引用别的模块中的名字。

同一个模块中的函数，就算写在不同的文件中，也可以相互递归。

`even.meta`:

```scheme
(module example)

(define (even? n)
  (if (equal? n 0)
    true
    (odd? (isub n 1))))
```

`odd.meta`:

```scheme
(module example)

(define (odd? n)
  (if (equal? n 0)
    false
    (even? (isub n 1))))
```

## (import)

```scheme
(import <module-name> <name> ...)
```

从其他模块导入指定名字。

导入后可以直接使用，不需要限定前缀。

```scheme
(import math pi circumference)
```

之后，

```scheme
math/pi
math/circumference
```

可简写为：

```scheme
pi
circumference
```

## (import-as)

```scheme
(import-as <module-name> <prefix>)
```

导入模块并修改前缀。

`<module-name>/<name>` 改为 `<prefix>/<name>`。

```scheme
(import-as meta m)
```

之后，

```scheme
meta/exp-t
```

可简写为：

```scheme
m/exp-t
```

## (import-all)

```scheme
(import-all <module-name>)
```

导入模块中所有名字。

使得所有名字都可以不用前缀就能引用。

如果当前模块已经有重复的名字，
就略过这个名字不导入。

因此，不带前缀的引用，还是会引用到当前模块自己的名字。
或者说本地的定义，可以覆盖 `(import-all)` 所引入的定义。

## (private)

```scheme
(private <name> ...)
```

将名字标记为私有。

被标记为私有的名字不能被其他模块引用。

```scheme
(module serial-number)

(private serial-number-hash)
(define serial-number-hash (make-hash))
```

# 测试

## (define-test)

```scheme
(define-test <test-name> <body>)
```

定义测试。

`<body>` 中可以包含多个断言。

```scheme
(claim add1 (-> int-t int-t))
(define (add1 x) (iadd x 1))

(define-test add1-test
  (assert-equal 2 (add1 1))
  (assert-equal 0 (add1 -1)))
```

支持以下断言：

- `(assert x)` -- 断言 `x` 为 `true`。
- `(assert-not x)` -- 断言 `x` 为 `false`。
- `(assert-equal lhs rhs)` -- 断言 `lhs` 与 `rhs` 相等（使用 `equal?` 比较）。
- `(assert-not-equal lhs rhs)` -- 断言 `lhs` 与 `rhs` 不相等。。
