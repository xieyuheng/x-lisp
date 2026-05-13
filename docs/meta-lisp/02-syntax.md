# 语法

meta-lisp 使用 S-expression 语法。

模块顶层由**语句**（statement）组成。
语句内由**表达式**（expression）组成。

下面分组介绍 meta-lisp 的所有语法。

## 注释

注释以 `;` 开头，直到行尾。

在写行注释的时候 lisp 程序员通常写两个 `;;`。

```scheme
;; 这是一条注释
(define x 42) ;; 行尾注释
```

## 字面量

### 原子

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

### (quote)

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

## 变量

### (define)

```scheme
(define <name> <exp>)
```

定义模块级变量。

```scheme
(define answer 42)
(define greeting "hello")
```

### 变量

变量引用一个已绑定的名字。

名字由字母、数字和 `-` `?` `!` 等字符组成。

```scheme
x
factorial
list-length
list-empty?
```

变量从以下来源查找：

- 局部绑定：`lambda` 的参数、`let` 的绑定
- 模块内顶层 `define`
- 从其他模块 `import` 进来的名字

### 限定变量

`mod/name` 引用其他模块中的名字。

限定名不需要先 `import`，可以直接使用。

```scheme
builtin/list-length
builtin/list-empty?
```

## 函数

### 函数调用

```scheme
(<target> <arg> ...)
```

函数调用是 S-expression 的核心形式。

如果表达式的第一个元素不是语法关键词，就被认为是函数调用。
第一个元素是函数，其余是参数。
所有参数在调用前先求值。

```scheme
(iadd 1 2)              ;; 调用 iadd
(println "hello")       ;; 调用 println
((lambda (x) x) 1)      ;; 函数位置也可以是表达式
```

### (lambda)

```scheme
(lambda (<parameter> ...) <body>)
```

创建匿名函数。

`(<parameter> ...)` 是形式参数列表，
`<body>` 是一个或多个表达式。
当函数被调用时，实际参数被绑定到形式参数，然后求值 `<body>`。

```scheme
(lambda (x) (iadd x 1))
```

立即调用：

```scheme
((lambda (x) (iadd x 1)) 2)  ;; => 3
```

多个参数：

```scheme
(lambda (a b) (iadd a b))
```

### (define)

```scheme
(define (<name> <parameter> ...) <body>)
```

定义命名函数。

在当前模块中引入一个新的名字绑定。函数定义等价于定义了值为 lambda 的变量。

```scheme
(define (add1 x) (iadd x 1))
```

等价于：

```scheme
(define add1 (lambda (x) (iadd x 1)))
```

函数体 `<body>` 可以是多个表达式：

```scheme
(define (f x)
  (= y (iadd x 1))
  (imul y 2))
```

所有函数必须先 `claim` 再 `define`。

```scheme
(claim square (-> int-t int-t))
(define (square x) (imul x x))
```


## 类型

### (claim)

```scheme
(claim <name> <type>)
```

声称一个名字的类型。

编译器会检查 `define` 的实现是否与 `claim` 的类型一致。

```scheme
(claim add1 (-> int-t int-t))
(define (add1 x) (iadd x 1))

(claim answer int-t)
(define answer 42)
```

### (admit)

```scheme
(admit <name> <type>)
```

承认名字的类型。

与 `(claim)` 类似，但是编译器不会检查对应的 `(define)`。

```scheme
(admit make-point (-> float-t float-t point-t))
(define (make-point x y)
  (@list 'make-point x y))
```

### (the)

```scheme
(the <type> <exp>)
```

显式标注 `exp` 的类型。

编译器会检查 `exp` 的实际类型是否匹配。可用于澄清代码意图或帮助类型推断。

```scheme
(the int-t 42)
(the (-> int-t int-t) (lambda (x) (iadd x 1)))
```

### (polymorphic)

```scheme
(polymorphic (<type-parameter> ...) <type>)
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


## 条件

### (if)

```scheme
(if <condition>
  <consequent>
  <alternative>)
```

条件分支。

`<condition>` 被求值。
如果为真，求值 `<consequent>` 并返回。
否则求值 `<alternative>` 并返回。

`(if)` 必须有 else 分支。

```scheme
(define (abs x)
  (if (int-less? x 0)
    (ineg x)
    x))
```

### (when)

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

### (unless)

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

### (cond)

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

### (and)

```scheme
(and <exp> ...)
```

短路与。

从左到右求值。遇到第一个假值就停止并返回该值。全真时返回最后一个值。

```scheme
(and (int? x) (int-positive? x))
```

零个参数时返回 `true`。

### (or)

```scheme
(or <exp> ...)
```

短路或。

从左到右求值。遇到第一个真值就停止并返回该值。全假时返回最后一个值。

```scheme
(or (equal? x 0) (equal? x 1))
```

零个参数时返回 `false`。

## 顺序与绑定

### (begin)

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

### (let)

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

### (let*)

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

### (=)

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


## 函数组合

### (pipe)

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

### (chain)

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

### (compose)

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

## 代数数据类型

### (match)

```scheme
(match <target>
  (<pattern> <body>)
  ...)
```

模式匹配。

`target` 是要匹配的值。每个子句以一个构造器名开头，后面的符号绑定到对应字段。第一个匹配的子句的 body 被求值。

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

构造器名必须匹配 `define-enum` 或 `define-algebraic-type` 中定义的构造器。所有分支必须覆盖目标类型的所有可能。

### (define-enum)

```scheme
(define-enum <name>
  (<constructor> (<field> <type>) ...)
  ...)
```

定义多个构造器的代数数据类型。

每个构造器自动生成构造器、谓词、访问器、修改器。

```scheme
(define-enum exp-t
  (var-exp (name symbol-t))
  (lambda-exp (parameter symbol-t) (body exp-t)))
```

生成的名字：

- 构造器：`<constructor>`，例如 `var-exp`
- 谓词：`<constructor>?`，例如 `var-exp?`
- 访问器：`<constructor>-<field>`，例如 `var-exp-name`
- 修改器：`<constructor>-put-<field>!`，例如 `var-exp-put-name!`

### (define-struct)

```scheme
(define-struct <name>
  (<field> <type>) ...)
```

定义单构造器结构体。

类型名必须以 `-t` 结尾。构造器名自动生成为 `make-<base>`。

```scheme
(define-struct point-t
  (x float-t)
  (y float-t))

(define p (make-point 1.0 2.0))
(point-x p)  ;; => 1.0
```

### (define-struct*)

```scheme
(define-struct* <name>
  (<constructor> (<field> <type>) ...))
```

定义单构造器结构体，自定义构造器名。

```scheme
(define-struct* point-t (cons-point (x int-t) (y int-t)))

(cons-point 1 2)
```

### (define-algebraic-type)

```scheme
(define-algebraic-type <name>
  ((<constructor> (<field> <type>) ...)
   <predicate>
   (<field> <accessor> <modifier>) ...)
  ...)
```

最 explicit 的代数数据类型定义。所有名字由你指定。

```scheme
(define-algebraic-type exp-t
  ((var-exp (name symbol-t))
   var-exp?
   (name var-exp-name var-exp-put-name!))
  ((lambda-exp (parameter symbol-t) (body exp-t))
   lambda-exp?
   (parameter lambda-exp-parameter lambda-exp-put-parameter!)
   (body lambda-exp-body lambda-exp-put-body!)))
```

每定义一个构造器，格式为：构造器名 + 字段列表 + 谓词 + 字段的访问器/修改器列表。


## 模块

### (module)

```scheme
(module <name>)
```

声明当前模块。

每个 `.meta` 文件必须以 `module` 开头。`name` 通常与文件名一致。

```scheme
(module math)
```

### (import)

```scheme
(import <mod-name> <name> ...)
```

从其他模块导入指定名字。

导入后可以直接使用，不需要限定前缀。

```scheme
(import math pi circumference)
(import list length map)
```

### (import-as)

```scheme
(import-as <mod-name> <prefix>)
```

导入模块并用前缀。

使用时用 `prefix/name`。

```scheme
(import-as list L)

(L/length '(1 2 3))
```

### (import-all)

```scheme
(import-all <mod-name>)
```

导入模块中所有名字。

```scheme
(import-all list)

(length '(1 2 3))
```


## 访问控制

### (private)

```scheme
(private <name> ...)
```

将名字标记为私有。

被标记为私有的名字不能被其他模块引用。

```scheme
(module counter)

(define counter-state 0)
(define (reset) (= counter-state 0))

(private counter-state reset)
```

### (exempt)

```scheme
(exempt <name> ...)
```

免除未使用警告。

如果顶层定义在当前模块中没有被使用，编译器会警告。`exempt` 免除这个警告。

```scheme
(define (internal x) (imul x 2))
(define (public x) (internal x))

(exempt internal)
```

## 测试

### (define-test)

```scheme
(define-test <name> <body>)
```

定义测试。

`body` 中可以用断言来做测试。
通过 `./meta-lisp.js test` 运行。

```scheme
(define add1 (iadd 1))

(define-test add1-test
  (assert-equal 2 (add1 1))
  (assert-equal 0 (add1 -1)))
```
