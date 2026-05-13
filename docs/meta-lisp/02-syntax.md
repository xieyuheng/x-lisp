# 语法

meta-lisp 使用 S-expression 语法。

- 顶层语法由**语句**（statement）组成。
- 语句内语法由**表达式**（expression）组成。

## 字面量

| 类型   | 语法           | 示例           |
|--------|----------------|----------------|
| 整数   | 数字           | `42` `-1` `0`  |
| 浮点数 | 带小数点       | `3.14` `-2.5`  |
| 字符串 | 双引号         | `"hello"` `""` |
| 符号   | 单引号 + 名字  | `'foo` `'bar`  |
| 关键字 | 冒号开头       | `:key` `:name` |

`true` 和 `false` 不是字面量，而是绑定了布尔值的变量。

## 注释

使用 `;;` 开头，直到行尾。

```scheme
;; 这是一条注释
(define x 42) ;; 行尾注释
```

## 表达式

### 变量

| 名字     | 语法       | 语义                     | 示例                  |
|----------|------------|--------------------------|-----------------------|
| 变量     | `name`     | 引用局部变量和模块内变量 | `x` `factorial`       |
| 限定变量 | `mod/name` | 引用指定模块中的变量     | `builtin/list-length` |

### 函数

| 名字     | 语法                   | 语义         | 示例                                       |
|----------|------------------------|--------------|--------------------------------------------|
| 匿名函数 | `(lambda (args) body)` | 创建匿名函数 | `(lambda (x) (iadd x 1))`                  |
| 函数调用 | `(f arg1 arg2)`        | 调用函数     | `(iadd 1 2)` `((lambda (x) (iadd x 1)) 2)` |

函数调用是 S-expression 的核心：列表的第一个元素是函数，其余是参数。

### 条件

| 名字   | 语法                               | 语义                  | 示例                                         |
|--------|------------------------------------|-----------------------|----------------------------------------------|
| if     | `(if cond conseq alt)`             | 条件分支，必须有 else | `(if (int-less? x 0) (ineg x) x)`            |
| when   | `(when cond body)`                 | 条件为真时执行        | `(when debug? (display "debug"))`            |
| unless | `(unless cond body)`               | 条件为假时执行        | `(unless (equal? x 0) (idiv 1 x))`           |
| cond   | `(cond (q1 a1) (q2 a2) (else an))` | 多分支条件            | `(cond ((int-less? x 0) "负")(else "非负"))` |
| and    | `(and e1 e2 ...)`                  | 短路与                | `(and (int? x) (int-positive? x))`           |
| or     | `(or e1 e2 ...)`                   | 短路或                | `(or (equal? x 0) (equal? x 1))`             |

`cond` 的最后一个条件可以是 `else`，表示默认分支。

### 顺序执行与绑定

| 名字       | 语法                          | 语义                     | 示例                              |
|------------|-------------------------------|--------------------------|-----------------------------------|
| begin      | `(begin e1 e2 ...)`           | 顺序执行，返回最后一个值 | `(begin (= x 1) (iadd x 1))`      |
| let        | `(let ((x e1) (y e2)) body)`  | 并行绑定（不能互引用）   | `(let ((x 1) (y 2)) (iadd x y))`  |
| let*       | `(let* ((x e1) (y e2)) body)` | 顺序绑定（可互引用）     | `(let* ((x 1) (y (iadd x 1))) y)` |
| let 单绑定 | `(let (x e1) body)`           | 单个绑定的 let           | `(let (x 1) (iadd x 1))`          |
| 赋值       | `(= name expr)`               | 修改已有变量的值         | `(= x (iadd x 1))`                |

在函数体中，可以省略 `(begin)`，多个表达式直接顺序写：

```scheme
(define (f x)
  (= y (iadd x 1))
  (imul y 2))
```

等价于：

```scheme
(define (f x)
  (begin
    (= y (iadd x 1))
    (imul y 2)))
```

`(let ((x e1)) body)` 等价于 `(begin (= x e1) body)`。

### 函数组合

| 名字    | 语法                    | 语义                     | 示例                                |
|---------|-------------------------|--------------------------|-------------------------------------|
| pipe    | `(pipe init f1 f2 ...)` | 将 init 依次传入每个函数 | `(pipe 5 add1 double)` → `12`      |
| chain   | `(chain f1 f2 ...)`     | 组合函数（从左到右）     | `((chain add1 double) 5)` → `12`   |
| compose | `(compose f1 f2 ...)`   | 组合函数（从右到左）     | `((compose add1 double) 5)` → `11` |

pipe 和 chain 的方向相同（从左到右），区别在于 pipe 直接传入初始值，chain 返回一个函数。

| 表达式                      | 数学等价          | 结果 |
|-----------------------------|-------------------|------|
| `(pipe 5 add1 double)`      | `double(add1(5))` | `12` |
| `((chain add1 double) 5)`   | `double(add1(5))` | `12` |
| `((compose add1 double) 5)` | `add1(double(5))` | `11` |

### 模式匹配

```scheme
(match target
  ((constructor field1 field2) body1)
  ((constructor2 field1) body2))
```

`match` 用于解构代数数据类型：

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

### 其他

| 名字        | 语法                     | 语义              | 示例                         |
|-------------|--------------------------|-------------------|------------------------------|
| the         | `(the type exp)`         | 类型标注          | `(the int-t 42)`             |
| polymorphic | `(polymorphic (A) type)` | 多态类型          | `(polymorphic (A) (-> A A))` |
| quote       | `'expr`                  | 引用 S-expression | `'(1 2 3)`                   |

## 语句

语句出现在顶层（模块作用域），不能被嵌套在表达式中。

### 模块

| 语句   | 语法            | 语义           | 示例              |
|--------|-----------------|----------------|-------------------|
| module | `(module name)` | 声明当前模块名 | `(module my-lib)` |

每个 `.meta` 文件必须以 `(module name)` 开头。

### 导入

| 语句       | 语法                     | 语义               | 示例                       |
|------------|--------------------------|--------------------|----------------------------|
| import     | `(import mod name ...)`  | 从模块导入指定名字 | `(import list length map)` |
| import-as  | `(import-as mod prefix)` | 导入模块并用前缀   | `(import-as list L)`       |
| import-all | `(import-all mod)`       | 导入模块中所有名字 | `(import-all list)`        |

限定名访问：`mod/name`。

```scheme
(module main)

(import examples gcd)

;; 直接使用
(claim result int-t)
(= result (gcd 12 8))

;; 限定名
(claim result-2 int-t)
(= result-2 examples/gcd 12 8)
```

### 定义

| 语句        | 语法                        | 语义     | 示例                                |
|-------------|-----------------------------|----------|-------------------------------------|
| define 函数 | `(define (name args) body)` | 定义函数 | `(define (add1 x) (iadd x 1))`      |
| define 变量 | `(define name expr)`        | 定义常量 | `(define pi 314)`                   |
| claim       | `(claim name type)`         | 类型声明 | `(claim add1 (-> int-t int-t))`     |
| define-test | `(define-test name body)`   | 定义测试 | `(define-test test1 (assert true))` |

**在定义函数/变量之前，必须先用 `claim` 声明类型。**

```scheme
(claim square (-> int-t int-t))
(define (square x) (imul x x))
```

`define-test` 不需要 `claim`。

### 数据类型定义

| 语句                  | 语法                                             | 用途                 |
|-----------------------|--------------------------------------------------|----------------------|
| define-struct         | `(define-struct name (field type) ...)`          | 单构造器结构体       |
| define-struct*        | `(define-struct* name (ctor (field type) ...))`  | 单构造器，自定义名字 |
| define-enum           | `(define-enum name (ctor (field type) ...) ...)` | 多构造器代数数据类型 |
| define-algebraic-type | 完全 explicit 的语法                             | 完全控制命名         |

详见 [04-data-types.md](04-data-types.md)。

### 访问控制

| 语句    | 语法                 | 语义             | 示例                   |
|---------|----------------------|------------------|------------------------|
| private | `(private name ...)` | 将名字标记为私有 | `(private make-point)` |
| exempt  | `(exempt name ...)`  | 免除未使用警告   | `(exempt unused-fn)`   |

### 内置函数声明

| 语句                       | 语法                                      | 语义         |
|----------------------------|-------------------------------------------|--------------|
| declare-primitive-function | `(declare-primitive-function name arity)` | 声明内置函数 |
| declare-primitive-variable | `(declare-primitive-variable name)`       | 声明内置变量 |

这些语句仅在 `meta-builtin.meta` 项目中使用。

### 其他

| 语句       | 语法                | 语义                                         |
|------------|---------------------|----------------------------------------------|
| admit      | `(admit name type)` | 绕过类型检查，声明名字的类型（用于逐步开发） |
| claim-type | `(claim-type name)` | 声明类型的类型（高级）                       |

## 语法快速索引

### 表达式

```
literal       → 42 | -1 | 3.14 | "hello" | 'foo | :key | true | false
var           → name
qualified-var → mod/name
lambda        → (lambda (name ...) exp)
apply         → (exp exp ...)
pipe          → (pipe exp exp ...)
chain         → (chain exp ...)
compose       → (compose exp ...)
let           → (let ((name exp) ...) exp) | (let (name exp) exp)
let*          → (let* ((name exp) ...) exp)
begin         → (begin exp ...)
assign        → (= name exp)
if            → (if exp exp exp)
when          → (when exp exp)
unless        → (unless exp exp)
cond          → (cond (exp exp) ... (else exp))
and           → (and exp ...)
or            → (or exp ...)
match         → (match exp (pat exp) ...)
the           → (the type exp)
polymorphic   → (polymorphic (name ...) type)
quote         → 'sexp
list-literal  → (list exp ...)
hash-literal  → (hash (exp exp) ...)
```

### 语句

```
module                    → (module name)
import                    → (import mod-name name ...)
import-as                 → (import-as mod-name prefix)
import-all                → (import-all mod-name)
define-function           → (define (name name ...) exp)
define-variable           → (define name exp)
define-test               → (define-test name exp)
claim                     → (claim name type)
claim-type                → (claim-type name)
admit                     → (admit name type)
private                   → (private name ...)
exempt                    → (exempt name ...)
define-struct             → (define-struct name (name type) ...)
define-struct*            → (define-struct* name (ctor (name type) ...))
define-enum               → (define-enum name (ctor (name type) ...) ...)
define-algebraic-type     → (define-algebraic-type name ...)
declare-primitive-function → (declare-primitive-function name arity)
declare-primitive-variable  → (declare-primitive-variable name)
```
