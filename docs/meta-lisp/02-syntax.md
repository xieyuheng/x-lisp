# 语法

meta-lisp 使用 S-expression 语法。

顶层由**语句**（statement）组成。语句内由**表达式**（expression）组成。

---

## 字面量

整数。由数字组成，可选负号。

```scheme
42
-1
0
```

浮点数。带小数点的数字。

```scheme
3.14
-2.5
```

字符串。用双引号包裹。

```scheme
"hello"
""
```

符号。用单引号开头，后面跟名字。

```scheme
'foo
'bar
```

关键字。用冒号开头。

```scheme
:key
:name
```

布尔值。`true` 和 `false` 不是字面量，而是绑定了布尔值的变量名。

```scheme
true
false
```

---

## 注释

注释以 `;;` 开头，直到行尾。

```scheme
;; 这是一条注释
(define x 42) ;; 行尾注释
```

---

## 变量

变量引用一个已绑定的名字。

名字由字母、数字和 `-` `?` `!` 等字符组成。

```scheme
x
factorial
add1
empty?
point-put-x!
```

变量从以下来源查找：

- 局部绑定：`lambda` 的参数、`let` 的绑定
- 模块内顶层 `define`
- 从其他模块 `import` 进来的名字

---

## 限定变量

限定变量通过 `模块名/变量名` 来引用其他模块中导出的名字。

```scheme
builtin/list-length
math/pi
utils/add1
```

限定名不需要先 `import`，可以直接使用。

---

## 函数调用

函数调用是 S-expression 的核心形式。

语法：`(f args ...)`

列表的第一个元素是函数，其余是参数。所有参数在调用前先求值。

```scheme
(iadd 1 2)             ;; 调用 iadd，参数 1 和 2
(display "hello")      ;; 调用 display，参数 "hello"
(f x)                  ;; 调用 f，参数 x
```

函数调用也可以嵌套：

```scheme
(iadd (imul 2 3) (imul 4 5))  ;; => 26
```

函数位置的表达式也可以是一个复合表达式：

```scheme
((lambda (x) (iadd x 1)) 2)  ;; => 3
```

---

## lambda

创建匿名函数。

语法：`(lambda (parameters ...) body)`

`lambda` 创建一个函数值。parameters 是符号列表。body 是一个表达式。当函数被调用时，参数被绑定到形参，然后求值 body。

```scheme
(lambda (x) (iadd x 1))
```

可以用函数调用立即使用 lambda：

```scheme
((lambda (x) (iadd x 1)) 2)  ;; => 3
```

多个参数：

```scheme
(lambda (a b) (iadd a b))
```

lambda 的参数个数必须与调用时传入的参数个数一致。

---

## define

定义函数或变量。

语法（函数）：`(define (name parameters ...) body)`

语法（变量）：`(define name expr)`

`define` 在当前模块中引入一个新的名字绑定。函数定义是定义了一个值为 lambda 的变量。

```scheme
;; 变量定义
(define pi 314)

;; 函数定义
(define (add1 x) (iadd x 1))
```

函数定义等价于变量定义加 lambda：

```scheme
(define add1 (lambda (x) (iadd x 1)))
```

函数体中可以直接写多个表达式，省略 `begin`：

```scheme
(define (f x)
  (= y (iadd x 1))
  (imul y 2))
```

所有函数和变量必须先 `claim` 再 `define`。

```scheme
(claim square (-> int-t int-t))
(define (square x) (imul x x))
```

---

## claim

声明一个名字的类型。

语法：`(claim name type)`

`claim` 必须在对应的 `define` 之前出现。编译器会检查 `define` 的实现是否与 `claim` 的类型一致。

```scheme
(claim add1 (-> int-t int-t))
(define (add1 x) (iadd x 1))

(claim pi int-t)
(define pi 314)
```

没有 `claim` 就 `define` 会导致编译错误。

`define-test` 不需要 `claim`。

---

## if

条件分支。

语法：`(if condition consequent alternative)`

`condition` 被求值。如果为真，求值 `consequent` 并返回。否则求值 `alternative` 并返回。

`if` 必须有 else 分支。没有 else 分支的情况使用 `when`。

```scheme
(if (int-positive? x)
  "positive"
  "non-positive")
```

`if` 是表达式，返回值：

```scheme
(define (abs x)
  (if (int-less? x 0) (ineg x) x))
```

---

## when

条件为真时执行。

语法：`(when condition body)`

`condition` 为真时求值 `body`。否则跳过。返回值是 `void`。

```scheme
(when debug?
  (display "debug mode"))

(when (int-positive? x)
  (display "positive"))
```

没有 else 分支。需要 else 分支时用 `if`。

---

## unless

条件为假时执行。

语法：`(unless condition body)`

`condition` 为假时求值 `body`。否则跳过。返回值是 `void`。

```scheme
(unless (equal? x 0)
  (display (idiv 1 x)))
```

---

## cond

多分支条件。

语法：`(cond (q1 a1) (q2 a2) ... (else an))`

依次求值每个 `q`，第一个为真的分支的 `a` 被求值并返回。`else` 是默认分支，必须放在最后。

```scheme
(define (classify x)
  (cond
   ((int-positive? x) "positive")
   ((int-negative? x) "negative")
   (else "zero")))
```

每个分支的 `q` 和 `a` 都是表达式。`else` 是一个特殊标记，表示无条件匹配。

---

## and

短路与。

语法：`(and e1 e2 ...)`

从左到右求值。遇到第一个假值就停止并返回该值。全真时返回最后一个值。

```scheme
(and (int? x) (int-positive? x))
(and (equal? x 0) (equal? y 0))
```

零个参数时返回 `true`。

---

## or

短路或。

语法：`(or e1 e2 ...)`

从左到右求值。遇到第一个真值就停止并返回该值。全假时返回最后一个值。

```scheme
(or (equal? x 0) (equal? x 1))
```

---

## begin

顺序执行。

语法：`(begin e1 e2 ... en)`

依次求值 `e1` 到 `en`，返回 `en` 的值。前面的表达式通常是为了副作用。

```scheme
(begin
  (display "step 1")
  (display "step 2")
  42)  ;; => 42
```

在函数体中，`begin` 可以省略：

```scheme
(define (f x)
  (= y (iadd x 1))  ;; 相当于 begin 的第一条
  (imul y 2))       ;; 最后一条作为返回值
```

---

## let

局部变量绑定。

语法：`(let ((name expr) ...) body)`

`let` 的绑定是并行的。所有右侧 `expr` 在同一个外层作用域中求值，互相不可见。然后所有 `name` 同时绑定到求值结果，再求值 `body`。

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

---

## let*

顺序局部变量绑定。

语法：`(let* ((name expr) ...) body)`

`let*` 的绑定是顺序的。每个 `expr` 可以引用前面绑定的名字。

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

---

## =

赋值。

语法：`(= name expr)`

`=` 将 `expr` 的值赋给已存在的变量 `name`。变量必须先通过 `lambda` 参数、`let` 或 `let*` 绑定。

`=` 不是可变变量意义上的赋值。它和 `let` 一样引入一个新的绑定。唯一的区别是 `=` 不创建新的作用域。

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

`=` 不能在顶层（module 作用域）使用。顶层用 `define`。

---

## pipe

管道。

语法：`(pipe init f1 f2 ... fn)`

将 `init` 传入 `f1`，结果传入 `f2`，以此类推。返回 `fn` 的结果。

等价于从左到右的函数组合，直接传入初始值。

```scheme
(pipe 5 add1 double)  ;; double(add1(5)) => 12
(pipe 2 add1 double square)  ;; square(double(add1(2))) => 36
```

---

## chain

函数链。

语法：`(chain f1 f2 ... fn)`

返回一个函数，等价于从左到右组合 `f1` 到 `fn`。

与 `pipe` 的区别：`chain` 不传入初始值，而是返回一个函数。

```scheme
((chain add1 double) 5)  ;; double(add1(5)) => 12
((chain add1 double square) 2)  ;; square(double(add1(2))) => 36
```

---

## compose

反向函数组合。

语法：`(compose f1 f2 ... fn)`

返回一个函数，等价于从右到左组合 `f1` 到 `fn`。

与 `chain` 方向相反：`compose` 先应用最后一个函数。

```scheme
((compose add1 double) 5)  ;; add1(double(5)) => 11
((compose square double add1) 2)  ;; square(double(add1(2))) => 36
```

三种形式对比，假设有表达式 `f3(f2(f1(x)))`：

| 形式 | 写法 |
|---|---|
| pipe | `(pipe x f1 f2 f3)` |
| chain | `((chain f1 f2 f3) x)` |
| compose | `((compose f3 f2 f1) x)` |

---

## match

模式匹配。

语法：

```scheme
(match target
  ((constructor field-pattern ...) body)
  ...)
```

`match` 解构代数数据类型的值。`target` 是要匹配的值。每个子句以一个构造器名开头，后面的符号绑定到对应字段。第一个匹配的子句被求值。

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

多态列表上的 match：

```scheme
(define (my-list-length list)
  (match list
    ((nil) 0)
    ((li head tail) (iadd 1 (my-list-length tail)))))
```

构造器名必须匹配 `define-enum` 或 `define-algebraic-type` 中定义的构造器。所有分支的构造器必须覆盖目标类型的所有可能。

---

## quote

引用。

语法：`'expr`

`quote` 阻止 `expr` 被求值，返回它原始的 S-expression 数据。通常用来创建列表数据。

```scheme
'(1 2 3)        ;; 一个包含三个整数的列表
'(+ 1 2)        ;; 一个包含符号和整数的列表，而不是求值为 3
'foo            ;; 等同于符号 foo
```

`'expr` 是 `(quote expr)` 的语法糖。

---

## the

类型标注。

语法：`(the type expr)`

显式标注 `expr` 的类型。编译器会检查 `expr` 的实际类型是否匹配。可用于澄清代码意图或帮助类型推断。

```scheme
(the int-t 42)
(the (-> int-t int-t) (lambda (x) (iadd x 1)))
```

---

## polymorphic

多态类型。

语法：`(polymorphic (A B ...) type)`

声明一个包含类型参数的类型。`A` 和 `B` 是类型变量，在 type 中可以被引用。用于 `claim` 中声明多态函数。

```scheme
(claim identity
  (polymorphic (A) (-> A A)))

(claim pair
  (polymorphic (A B) (-> A B (list-t A))))
```

多态函数的类型参数由编译器根据调用时的参数类型自动推断。

---

## module

声明当前模块。

语法：`(module name)`

每个 `.meta` 文件必须以 `module` 开头。`name` 是模块名，通常与文件名一致。

```scheme
(module math)
```

模块名影响导入时的路径和限定名的前缀。

---

## import

从其他模块导入名字。

语法：`(import mod-name name ...)`

将指定模块中的一个或多个名字导入当前模块的作用域。导入后可以直接使用，不需要限定前缀。

```scheme
(import math pi circumference)
(import list length map)
```

---

## import-as

导入模块并用前缀。

语法：`(import-as mod-name prefix)`

导入模块中的所有名字，但加上指定的前缀。使用时用 `prefix/name`。

```scheme
(import-as list L)

(L/length '(1 2 3))  ;; 使用前缀 L
```

---

## import-all

导入模块中所有名字。

语法：`(import-all mod-name)`

导入模块中的所有名字到当前作用域。使用时可以直接用名字，不需要限定前缀。

```scheme
(import-all list)

(length '(1 2 3))  ;; 直接使用
(map add1 '(1 2 3))
```

---

## define-struct

定义只有一个构造器的结构体。

语法：`(define-struct name (field-name field-type) ...)`

类型名必须以 `-t` 结尾。编译器自动生成构造器名 `make-<base>`（`<base>` 是类型名去掉 `-t`）。

自动生成的名字：

- 构造器：`make-<base>`
- 谓词：`<base>?`
- 访问器：`<name>-<field>`
- 修改器：`<name>-put-<field>!`

```scheme
(define-struct point-t
  (x float-t)
  (y float-t))

;; 使用
(define p (make-point 1.0 2.0))
(point-x p)         ;; => 1.0
(point? p)          ;; => true
(point-put-x! p 3.0) ;; 修改 x 字段
```

---

## define-struct*

定义单构造器结构体，自定义构造器名。

语法：`(define-struct* name (constructor-name (field-name field-type) ...))`

与 `define-struct` 的区别是构造器名由你指定。

```scheme
(define-struct* point-t (cons-point (x int-t) (y int-t)))

(cons-point 1 2)
```

---

## define-enum

定义多个构造器的代数数据类型。

语法：`(define-enum name (constructor (field-name field-type) ...) ...)`

每个构造器自动生成：

- 构造器：`<constructor>`
- 谓词：`<constructor>?`
- 访问器：`<constructor>-<field>`
- 修改器：`<constructor>-put-<field>!`

```scheme
(define-enum exp-t
  (var-exp (name symbol-t))
  (lambda-exp (parameter symbol-t) (body exp-t)))

(match (var-exp 'x)
  ((var-exp name) name)             ;; => 'x
  ((lambda-exp parameter body) nil))
```

---

## define-algebraic-type

最 explicit 的代数数据类型定义。

语法：

```scheme
(define-algebraic-type type-name
  ((constructor (field field-type) ...)
   predicate
   (field accessor modifier) ...)
  ...)
```

所有名字都由你显式指定。

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

---

## private

将名字标记为私有。

语法：`(private name ...)`

被标记为私有的名字不能被其他模块引用。

```scheme
(module counter)

(define counter-state 0)
(define (reset) (= counter-state 0))

(private counter-state reset)  ;; 外部不可见
```

---

## exempt

免除未使用警告。

语法：`(exempt name ...)`

如果一个顶层定义在当前模块中没有被使用，编译器会警告。`exempt` 免除这个警告。

```scheme
(module my-lib)

(define (internal x) (imul x 2))
(define (public x) (internal x))

(exempt internal)  ;; internal 只在模块内部用，但免于警告
```

---

## define-test

定义测试。

语法：`(define-test name body)`

`body` 中包含断言。测试通过 `./meta-lisp.js test` 运行。不需要 `claim`。

```scheme
(define-test add1-test
  (assert-equal 2 (add1 1))
  (assert-equal 0 (add1 -1)))
```

---

## admit

绕过类型检查。

语法：`(admit name type)`

声明 `name` 的类型，但不检查实现。用于逐步开发——先用 `admit` 占位，后续再补上实现。

```scheme
(admit complex-function (-> int-t string-t))
;; 之后可以调用 complex-function，但编译器不会检查其实现
```

---

## claim-type

声明类型的类型。

语法：`(claim-type name)`

声明 `name` 的类型是 `type-t`。用于定义新的类型常量。

```scheme
(claim-type my-custom-t)
```

通常只在 `meta-builtin.meta` 中使用。

---

## declare-primitive-function

声明内置函数。

语法：`(declare-primitive-function name arity)`

告诉编译器 `name` 是一个运行时实现的内置函数，`arity` 是参数个数。

```scheme
(declare-primitive-function iadd 2)
(declare-primitive-function display 1)
```

只在 `meta-builtin.meta` 项目中使用。

---

## declare-primitive-variable

声明内置变量。

语法：`(declare-primitive-variable name)`

告诉编译器 `name` 是一个运行时提供的内置常量。

```scheme
(declare-primitive-variable int-t)
(declare-primitive-variable true)
```

只在 `meta-builtin.meta` 项目中使用。
