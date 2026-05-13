# 语法

meta-lisp 使用 S-expression 语法。

顶层由**语句**（statement）组成。语句内由**表达式**（expression）组成。

## 注释

注释以 `;;` 开头，直到行尾。

```scheme
;; 这是一条注释
(define x 42) ;; 行尾注释
```

## 字面量

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


## 变量与引用

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

### (quote)

```scheme
'<exp>
```

阻止 `exp` 被求值，通常用来创建列表数据。

```scheme
'(1 2 3)        ;; => [1 2 3]
'(a b c)        ;; => ['a 'b 'c]
'foo            ;; => 'foo
```

`'exp` 是 `(quote exp)` 的语法糖。

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

`(parameter ...)` 是形式参数列表，`body` 是一个或多个表达式。
当函数被调用时，实际参数被绑定到形式参数，然后求值 `body`。

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

### (define)（函数定义）

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

函数体中可以直接写多个表达式，省略 `begin`：

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


## 类型声明

### (claim)

```scheme
(claim <name> <type>)
```

声明一个名字的类型。

`claim` 必须在对应的 `define` 之前出现。编译器会检查 `define` 的实现是否与 `claim` 的类型一致。

```scheme
(claim add1 (-> int-t int-t))
(define (add1 x) (iadd x 1))

(claim pi int-t)
(define pi 314)
```

`define-test` 不需要 `claim`。

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

声明包含类型参数的类型。

`A` 和 `B` 是类型变量，在 type 中可以被引用。用于 `claim` 中声明多态函数。

```scheme
(claim identity
  (polymorphic (A) (-> A A)))

(claim pair
  (polymorphic (A B) (-> A B (list-t A))))
```

### (claim-type)

```scheme
(claim-type <name>)
```

声明 `name` 的类型是 `type-t`。

用于定义新的类型常量。通常只在 `meta-builtin.meta` 中使用。

```scheme
(claim-type my-custom-t)
```

### (admit)

```scheme
(admit <name> <type>)
```

绕过类型检查，声明名字的类型。

用于逐步开发——先用 `admit` 占位，后续再补上实现。

```scheme
(admit complex-function (-> int-t string-t))
```


## 条件

### (if)

```scheme
(if <condition> <consequent> <alternative>)
```

条件分支。

`condition` 被求值。如果为真，求值 `consequent` 并返回。否则求值 `alternative` 并返回。

`if` 必须有 else 分支。

```scheme
(if (int-positive? x)
  "positive"
  "non-positive")

(define (abs x)
  (if (int-less? x 0) (ineg x) x))
```

### (when)

```scheme
(when <condition> <body>)
```

条件为真时执行。

`condition` 为真时求值 `body`。否则跳过。返回值是 `void`。

```scheme
(when debug?
  (println "debug mode"))
```

没有 else 分支。需要 else 分支时用 `if`。

### (unless)

```scheme
(unless <condition> <body>)
```

条件为假时执行。

`condition` 为假时求值 `body`。否则跳过。返回值是 `void`。

```scheme
(unless (equal? x 0)
  (println (idiv 1 x)))
```

### (cond)

```scheme
(cond
  (<question> <answer>)
  ...)
```

多分支条件。

依次求值每个 `q`。第一个为真的分支的 `a` 被求值并返回。`else` 是默认分支。

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


## 顺序执行与绑定

### (begin)

```scheme
(begin <exp> ...)
```

顺序执行。

依次求值 `e1` 到 `en`，返回 `en` 的值。前面的表达式通常是为了副作用。

```scheme
(begin
  (println "step 1")
  (println "step 2")
  42)  ;; => 42
```

在函数体中，`begin` 可以省略：

```scheme
(define (f x)
  (= y (iadd x 1))  ;; 相当于 begin 的第一条
  (imul y 2))       ;; 最后一条作为返回值
```

### (let)

```scheme
(let ((<name> <exp>) ...) <body>)
```

并行局部变量绑定。

所有右侧 `exp` 在同一个外层作用域中求值，互相不可见。然后所有 `name` 同时绑定到求值结果，再求值 `body`。

```scheme
(let ((x 1) (y 2))
  (iadd x y))  ;; => 3
```

并行意味着后面的绑定不能引用前面的：

```scheme
(let ((x 1)
      (y (iadd x 1)))  ;; 错误：x 在右侧不可见
  (iadd x y))
```

单绑定的简写形式：

```scheme
(let (x 1)
  (iadd x 1))  ;; => 2
```

等价于：

```scheme
(let ((x 1))
  (iadd x 1))
```

`(let ((x e1)) body)` 等价于 `(begin (= x e1) body)`：

```scheme
(define (f n)
  (= x (iadd n 1))
  (imul x 2))
```

### (let*)

```scheme
(let* ((<name> <exp>) ...) <body>)
```

顺序局部变量绑定。

每个 `exp` 可以引用前面绑定的名字。

```scheme
(let* ((x 1)
       (y (iadd x 1)))
  (iadd x y))  ;; => 3
```

`let*` 等价于嵌套的 `let`：

```scheme
(let ((x 1))
  (let ((y (iadd x 1)))
    (iadd x y)))
```

### (=)

```scheme
(= <name> <exp>)
```

赋值。

将 `exp` 的值赋给已存在的变量 `name`。变量必须先通过 `lambda` 参数、`let` 或 `let*` 绑定。

`=` 和 `let` 一样引入一个新的绑定。唯一的区别是 `=` 不创建新的作用域。

```scheme
(define (f n)
  (= x 0)
  (= x n)
  x)
```

在函数体中，`=` 常用来代替嵌套的 `let`，减少缩进：

```scheme
(define (f x)
  (= y (iadd x 1))
  (= z (iadd y 1))
  (iadd y z))
```

`=` 不能在顶层使用。顶层用 `define`。

### (define)（变量定义）

```scheme
(define <name> <exp>)
```

定义模块级常量。

```scheme
(define pi 314)
(define greeting "hello")
```

必须先 `claim` 再 `define`。


## 函数组合

### (pipe)

```scheme
(pipe <init> <step> ...)
```

管道。

将 `init` 传入 `f1`，结果传入 `f2`，以此类推。返回 `fn` 的结果。等价于从左到右的函数组合，直接传入初始值。

```scheme
(pipe 5 add1 double)        ;; double(add1(5)) => 12
(pipe 2 add1 double square)  ;; square(double(add1(2))) => 36
```

### (chain)

```scheme
(chain <step> ...)
```

函数链。

返回一个函数，等价于从左到右组合 `f1` 到 `fn`。

与 `pipe` 的区别：`chain` 不传入初始值，而是返回一个函数。

```scheme
((chain add1 double) 5)         ;; double(add1(5)) => 12
((chain add1 double square) 2)  ;; square(double(add1(2))) => 36
```

### (compose)

```scheme
(compose <step> ...)
```

反向函数组合。

返回一个函数，等价于从右到左组合 `f1` 到 `fn`。方向与 `chain` 相反。

```scheme
((compose add1 double) 5)          ;; add1(double(5)) => 11
((compose square double add1) 2)   ;; square(double(add1(2))) => 36
```


## 模式匹配与代数数据类型

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
(define-test add1-test
  (assert-equal 2 (add1 1))
  (assert-equal 0 (add1 -1)))
```
