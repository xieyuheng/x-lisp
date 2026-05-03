# meta-lisp 语言参考手册

## 简介

meta-lisp 是一个带有类型系统的 Lisp 方言，由 xieyuheng 设计，作为 x-lisp 项目系列的一部分。它的首要目标是加快新语言开发的速度，适合用来写新的解释器与编译器，以探索新的计算模型。

meta-lisp 的设计灵感来源于 ML 系语言（如 Coq），但保持了 Lisp 的简洁语法。它支持：

- 代数数据类型（datatype）
- 接口/记录类型（interface/record）
- 多态类型（polymorphic type）
- 模式匹配（pattern matching）
- 模块系统

## 基本语法

### S-表达式

meta-lisp 使用标准的 S-表达式语法：

```lisp
(operator operand1 operand2 ...)
```

一切都是 S-表达式，包括代码和数据。

### 注释

使用分号 `;` 开始单行注释：

```lisp
; 这是一条注释
(define x 1) ; 这也是注释
```

### 字面量

#### 整数

```lisp
42
-7
0
```

#### 浮点数

```lisp
3.14
-2.5
1.0
```

#### 字符串

```lisp
"Hello, World!"
"包含\"转义\"的字符串"
```

#### 符号（Symbol）

符号以单引号 `'` 开头，或者直接使用标识符（在上下文中会自动识别）：

```lisp
'foo
'bar-baz
```

在代码中直接写 `foo` 也会被解析为符号（除非它是特殊形式或已定义的函数）。

#### 关键字（Keyword）

关键字以冒号 `:` 开头：

```lisp
:x
:y
:color
```

关键字通常用于记录的字段名。

## 类型系统

### 基本类型

meta-lisp 提供以下基本类型：

| 类型 | 说明 |
|------|------|
| `int-t` | 整数类型 |
| `float-t` | 浮点数类型 |
| `string-t` | 字符串类型 |
| `symbol-t` | 符号类型 |
| `keyword-t` | 关键字类型 |
| `bool-t` | 布尔类型 |
| `void-t` | 空类型 |
| `type-t` | 类型本身类型 |
| `file-t` | 文件类型 |

### 容器类型

容器类型是类型构造器，需要参数：

| 类型构造器 | 说明 | 示例 |
|-----------|------|------|
| `list-t` | 列表类型 | `(list-t int-t)` |
| `set-t` | 集合类型 | `(set-t string-t)` |
| `hash-t` | 哈希表类型 | `(hash-t string-t int-t)` |

### 函数类型

函数类型使用箭头 `->` 表示：

```lisp
(-> int-t int-t)                    ; 接受 int 返回 int
(-> int-t int-t bool-t)             ; 接受两个 int 返回一个 bool
(-> (list-t int-t) (list-t int-t)) ; 接受列表返回列表
```

### 多态类型

使用 `polymorphic` 声明多态类型：

```lisp
(polymorphic (A) (-> A A))
; 表示对于任意类型 A，接受 A 返回 A
```

可以有多于一个类型参数：

```lisp
(polymorphic (K V) (-> K V (hash-t K V)))
```

### 类型声明（claim）

使用 `claim` 声明函数或值的类型：

```lisp
(claim add1 (-> int-t int-t))
(claim my-list (list-t int-t))
```

## 数据类型定义

### define-data：代数数据类型

使用 `define-data` 定义代数数据类型（类似 ML 的 datatype）：

```lisp
(define-data exp-t
  (var-exp (name symbol-t))
  (apply-exp (target exp-t) (arg exp-t))
  (lambda-exp (parameter symbol-t) (body exp-t)))
```

这定义了一个名为 `exp-t` 的类型，它有三个构造器：
- `var-exp`：包含一个 name 字段
- `apply-exp`：包含 target 和 arg 字段
- `lambda-exp`：包含 parameter 和 body 字段

### 参数化数据类型

数据类型可以带类型参数：

```lisp
(define-data (my-list-t E)
  (nil)
  (li (head E) (tail (my-list-t E))))
```

这里 `my-list-t` 是一个类型构造器，接受一个类型参数 `E`。

### define-interface：接口/记录类型

使用 `define-interface` 定义接口（类似结构类型或行多态）：

```lisp
(define-interface point-t
  :x float-t
  :y float-t)
```

接口定义了记录的字段及其类型。

### 接口继承

接口可以扩展其他接口：

```lisp
(define-interface colored-point-t
  :color string-t)
; 然后通过 extend-interface-exp 扩展
```

## 表达式

### 字面量表达式

```lisp
42          ; int-exp
3.14        ; float-exp
"hello"     ; string-exp
'foo        ; symbol-exp
:x          ; keyword-exp
```

### 变量引用

```lisp
x           ; var-exp
module/name ; qualified-var-exp（限定变量）
```

### 函数应用

```lisp
(function arg1 arg2)
(+ 1 2)
(cons 1 '(2 3))
```

### lambda 表达式

使用 `lambda` 创建匿名函数：

```lisp
(lambda (x) (iadd x 1))
(lambda (x y) (+ x y))
```

### let 表达式

`let` 用于局部绑定，所有绑定同时生效：

```lisp
(let ((x 1)
      (y 2))
  (iadd x y))
```

`let*` 用于顺序绑定，后面的绑定可以使用前面的：

```lisp
(let* ((x 1)
       (y (iadd x 1)))
  (iadd x y))
```

### if 表达式

```lisp
(if condition consequent alternative)
```

示例：

```lisp
(if (equal? x 1)
    2
    3)
```

### cond 表达式

多条件分支：

```lisp
(cond
  ((equal? x 1) 10)
  ((equal? x 2) 20)
  (else 0))
```

### begin 表达式

顺序执行多个表达式，返回最后一个的值：

```lisp
(begin
  (println "hello")
  (println "world")
  42)
```

### and 和 or

```lisp
(and true true)   ; => true
(and true false)  ; => false
(or false true)   ; => true
(or false false)  ; => false
```

### match 表达式

模式匹配是 meta-lisp 的强大特性：

```lisp
(match exp
  ((var-exp name)
   (println name))
  ((lambda-exp parameter body)
   (evaluate body ...))
  ((apply-exp target arg)
   (apply (evaluate target) (evaluate arg))))
```

每个子句的形式为 `(pattern body)`。

### quote 表达式

引用表达式返回 S-表达式本身：

```lisp
'(1 2 3)        ; 引用列表
'(+ 1 2)        ; 引用 S-表达式
'foo             ; 引用符号
```

### the 表达式

类型注解（可选的类型检查）：

```lisp
(the int-t 42)
(the (-> int-t int-t) (lambda (x) (iadd x 1)))
```

## 定义

### define：定义函数或值

定义函数：

```lisp
(define (add x y)
  (iadd x y))
```

定义递归函数：

```lisp
(define (factorial n)
  (if (equal? n 0)
      1
      (imul n (factorial (isub n 1)))))
```

定义值：

```lisp
(define x 42)
(define my-list '(1 2 3 4 5))
```

### claim 和 define 分离

可以先声明类型，再定义实现：

```lisp
(claim factorial (-> int-t int-t))

(define (factorial n)
  (if (equal? n 0)
      1
      (imul n (factorial (isub n 1)))))
```

## 记录（Record）

### 创建记录

使用 `@record` 语法创建记录：

```lisp
(@record :x 1.0 :y 2.0)
; 类型为 point-t（如果匹配接口定义）
```

### 扩展记录

使用 `extend` 函数扩展记录（添加新字段）：

```lisp
(define point (@record :x 1.0 :y 2.0))
(extend point :color "red")
; => @record :x 1.0 :y 2.0 :color "red"
```

### 更新记录

使用 `update` 创建更新后的新记录（不可变）：

```lisp
(update point :x 2.0)
; => @record :x 2.0 :y 2.0
```

使用 `update!` 原地更新记录（可变）：

```lisp
(update! point :y 3.0)
; point 现在是 @record :x 1.0 :y 3.0
```

## 模块系统

### 定义模块

每个文件通常以 `(module name)` 开始：

```lisp
(module my-module)

(define (foo x) ...)
(define (bar y) ...)
```

### 使用其他模块的函数

使用 `module/name` 语法引用其他模块的定义：

```lisp
(my-module/foo 42)
(math/pi)
```

## 内置函数

### 算术运算

| 函数 | 类型 | 说明 |
|------|------|------|
| `iadd` | `(-> int-t int-t int-t)` | 整数加法 |
| `isub` | `(-> int-t int-t int-t)` | 整数减法 |
| `imul` | `(-> int-t int-t int-t)` | 整数乘法 |
| `idiv` | `(-> int-t int-t int-t)` | 整数除法 |
| `fadd` | `(-> float-t float-t float-t)` | 浮点数加法 |
| `fsub` | `(-> float-t float-t float-t)` | 浮点数减法 |
| `fmul` | `(-> float-t float-t float-t)` | 浮点数乘法 |
| `fdiv` | `(-> float-t float-t float-t)` | 浮点数除法 |

### 比较运算

| 函数 | 类型 | 说明 |
|------|------|------|
| `equal?` | `(polymorphic (A) (-> A A bool-t))` | 结构相等性 |
| `same?` | `(polymorphic (A) (-> A A bool-t))` | 同一性（引用相等） |
| `total-compare` | `(polymorphic (A) (-> A A int-t))` | 全序比较 |

### 逻辑运算

| 函数 | 类型 | 说明 |
|------|------|------|
| `not` | `(-> bool-t bool-t)` | 逻辑非 |
| `and` | 特殊形式 | 逻辑与 |
| `or` | 特殊形式 | 逻辑或 |

### 列表操作

| 函数 | 类型 | 说明 |
|------|------|------|
| `cons` | `(polymorphic (E) (-> E (list-t E) (list-t E)))` | 构造列表 |
| `car` | `(polymorphic (E) (-> (list-t E) E))` | 取列表头 |
| `cdr` | `(polymorphic (E) (-> (list-t E) (list-t E)))` | 取列表尾 |
| `list-head` | `(polymorphic (E) (-> (list-t E) E))` | 取第一个元素 |
| `list-tail` | `(polymorphic (E) (-> (list-t E) (list-t E)))` | 取除第一个外的部分 |
| `list-length` | `(polymorphic (E) (-> (list-t E) int-t))` | 列表长度 |
| `list-empty?` | `(polymorphic (E) (-> (list-t E) bool-t))` | 判断列表是否为空 |
| `list-reverse` | `(polymorphic (E) (-> (list-t E) (list-t E)))` | 反转列表 |
| `list-get` | `(polymorphic (E) (-> int-t (list-t E) E))` | 按索引获取元素 |
| `list-put` | `(polymorphic (E) (-> int-t E (list-t E) (list-t E)))` | 不可变更新 |
| `list-put!` | `(polymorphic (E) (-> int-t E (list-t E) (list-t E)))` | 可变更新 |
| `list-push` | `(polymorphic (E) (-> E (list-t E) (list-t E)))` | 不可变推入 |
| `list-push!` | `(polymorphic (E) (-> E (list-t E) (list-t E)))` | 可变推入 |
| `list-pop!` | `(polymorphic (E) (-> (list-t E) E))` | 弹出最后一个 |
| `list-copy` | `(polymorphic (E) (-> (list-t E) (list-t E)))` | 复制列表 |

### 字符串操作

| 函数 | 类型 | 说明 |
|------|------|------|
| `string-length` | `(-> string-t int-t)` | 字符串长度 |
| `string-empty?` | `(-> string-t bool-t)` | 判断是否为空 |
| `string-blank?` | `(-> string-t bool-t)` | 判断是否为空或空白 |
| `string-append` | `(-> string-t string-t string-t)` | 连接两个字符串 |
| `string-concat` | `(-> (list-t string-t) string-t)` | 连接字符串列表 |
| `string-substring` | `(-> int-t int-t string-t string-t)` | 子串 |
| `string-split` | `(-> string-t string-t (list-t string-t))` | 分割字符串 |
| `string-join` | `(-> string-t (list-t string-t) string-t)` | 用分隔符连接 |
| `string-replace` | `(-> string-t string-t string-t string-t)` | 替换 |
| `string-starts-with?` | `(-> string-t string-t bool-t)` | 判断是否以前缀开始 |
| `string-ends-with?` | `(-> string-t string-t bool-t)` | 判断是否以后缀结束 |
| `string-contains?` | `(-> string-t string-t bool-t)` | 判断是否包含子串 |
| `string-to-upper-case` | `(-> string-t string-t)` | 转大写 |
| `string-to-lower-case` | `(-> string-t string-t)` | 转小写 |
| `string-trim` | `(-> string-t string-t)` | 去除两端空白 |
| `string-to-symbol` | `(-> string-t symbol-t)` | 字符串转符号 |

### 符号操作

| 函数 | 类型 | 说明 |
|------|------|------|
| `symbol?` | `(polymorphic (A) (-> A bool-t))` | 判断是否为符号 |
| `symbol-length` | `(-> symbol-t int-t)` | 符号长度 |
| `symbol-to-string` | `(-> symbol-t string-t)` | 符号转字符串 |
| `symbol-append` | `(-> symbol-t symbol-t symbol-t)` | 连接两个符号 |
| `symbol-concat` | `(-> (list-t symbol-t) symbol-t)` | 连接符号列表 |

### 哈希表操作

| 函数 | 类型 | 说明 |
|------|------|------|
| `make-hash` | `(polymorphic (K V) (-> (hash-t K V)))` | 创建空哈希表 |
| `hash-empty?` | `(polymorphic (K V) (-> (hash-t K V) bool-t))` | 判断是否为空 |
| `hash-length` | `(polymorphic (K V) (-> (hash-t K V) int-t))` | 哈希表大小 |
| `hash-get` | `(polymorphic (K V) (-> K (hash-t K V) V))` | 获取值 |
| `hash-has?` | `(polymorphic (K V) (-> K (hash-t K V) bool-t))` | 判断是否包含键 |
| `hash-put` | `(polymorphic (K V) (-> K V (hash-t K V) (hash-t K V)))` | 不可变插入 |
| `hash-put!` | `(polymorphic (K V) (-> K V (hash-t K V) (hash-t K V)))` | 可变插入 |
| `hash-delete!` | `(polymorphic (K V) (-> K (hash-t K V) (hash-t K V)))` | 删除键 |
| `hash-copy` | `(polymorphic (K V) (-> (hash-t K V) (hash-t K V)))` | 复制哈希表 |
| `hash-keys` | `(polymorphic (K V) (-> (hash-t K V) (list-t K)))` | 获取所有键 |
| `hash-values` | `(polymorphic (K V) (-> (hash-t K V) (list-t V)))` | 获取所有值 |
| `hash-entries` | `(polymorphic (K V) (-> (hash-t K V) (list-t (hash-entry-t K V))))` | 获取所有条目 |

### 类型判断

| 函数 | 类型 | 说明 |
|------|------|------|
| `atom?` | `(polymorphic (A) (-> A bool-t))` | 判断是否为原子 |
| `bool?` | `(polymorphic (A) (-> A bool-t))` | 判断是否为布尔值 |
| `int?` | `(polymorphic (A) (-> A bool-t))` | 判断是否为整数 |
| `float?` | `(polymorphic (A) (-> A bool-t))` | 判断是否为浮点数 |
| `string?` | `(polymorphic (A) (-> A bool-t))` | 判断是否为字符串 |
| `symbol?` | `(polymorphic (A) (-> A bool-t))` | 判断是否为符号 |
| `list?` | `(polymorphic (A) (-> A bool-t))` | 判断是否为列表 |

### 其他内置函数

| 函数 | 类型 | 说明 |
|------|------|------|
| `format` | `(polymorphic (A) (-> A string-t))` | 格式化为字符串 |
| `hash-code` | `(polymorphic (A) (-> A int-t))` | 计算哈希码 |
| `println` | 可变参数 | 打印并换行 |
| `print` | 可变参数 | 打印 |
| `error` | `(-> string-t value-t)` | 抛出错误 |
| `assert` | 特殊形式 | 断言 |
| `assert-equal` | 特殊形式 | 断言相等 |

## 声明原生函数

使用 `declare-primitive-function` 和 `declare-primitive-variable` 声明原生函数：

```lisp
(declare-primitive-function iadd 2)  ; 声明接受2个参数的函数
(declare-primitive-variable true)    ; 声明变量
```

通常配合 `claim` 使用来提供类型信息：

```lisp
(declare-primitive-function iadd 2)
(claim iadd (-> int-t int-t int-t))
```

## 测试

使用 `define-test` 定义测试：

```lisp
(define-test my-test
  (assert-equal 3 (add1 2))
  (assert (equal? x y)))
```

## 示例

### 示例 1：简单函数

```lisp
(module example1)

(define (add1 x)
  (iadd x 1))

(define (square x)
  (imul x x))

(define-test test
  (assert-equal 2 (add1 1))
  (assert-equal 4 (square 2)))
```

### 示例 2：使用数据类型

```lisp
(module example2)

(define-data (my-list-t E)
  (nil)
  (li (head E) (tail (my-list-t E))))

(claim my-list-length
  (polymorphic (E) (-> (my-list-t E) int-t)))

(define (my-list-length lst)
  (match lst
    ((nil) 0)
    ((li head tail)
     (iadd 1 (my-list-length tail)))))
```

### 示例 3：使用记录

```lisp
(module example3)

(define-interface point-t
  :x float-t
  :y float-t)

(define (distance p1 p2)
  (let ((dx (fsub (:x p1) (:x p2)))
        (dy (fsub (:y p1) (:y p2))))
    (sqrt (fadd (fmul dx dx) (fmul dy dy)))))

(define-test test
  (let ((p1 (@record :x 0.0 :y 0.0))
        (p2 (@record :x 3.0 :y 4.0)))
    (assert-equal 5.0 (distance p1 p2))))
```

### 示例 4：斐波那契数列

```lisp
(module fibonacci)

(claim fib (-> int-t int-t))

(define (fib n)
  (cond
    ((equal? n 0) 0)
    ((equal? n 1) 1)
    (else (iadd (fib (isub n 1)) (fib (isub n 2))))))

(define-test test
  (assert-equal 0 (fib 0))
  (assert-equal 1 (fib 1))
  (assert-equal 1 (fib 2))
  (assert-equal 2 (fib 3))
  (assert-equal 3 (fib 4))
  (assert-equal 5 (fib 5)))
```

## 附录：语法摘要

### 表达式语法

```
exp ::= int-literal
      | float-literal
      | string-literal
      | symbol-literal
      | keyword-literal
      | (exp exp*)
      | (lambda (symbol*) exp)
      | (let ((symbol exp)*) exp)
      | (let* ((symbol exp)*) exp)
      | (if exp exp exp)
      | (cond (exp exp)* (else exp))
      | (begin exp*)
      | (match exp (pattern exp)*)
      | (quote exp)
      | (the type exp)
      | (@record (keyword exp)*)
      | (list exp*)
      | (hash (exp exp)*)
```

### 定义语法

```
definition ::= (module symbol)
             | (define (symbol symbol*) exp)
             | (define symbol exp)
             | (claim symbol type)
             | (define-data (symbol symbol*) (constructor (field type)*)*)
             | (define-interface symbol (keyword type)*)
             | (declare-primitive-function symbol int)
             | (declare-primitive-variable symbol)
```

### 类型语法

```
type ::= int-t | float-t | string-t | symbol-t | keyword-t | bool-t | void-t
       | (list-t type)
       | (set-t type)
       | (hash-t type type)
       | (-> type* type)
       | (polymorphic (symbol*) type)
       | (type type*)
       | symbol
```

## 设计理念

meta-lisp 的设计遵循以下原则：

1. **简洁性**：语法尽量简洁，接近传统 Lisp
2. **类型安全**：提供可选的静态类型检查
3. **表达力**：通过代数数据类型和模式匹配提供强大的表达能力
4. **可扩展性**：通过模块系统和接口支持代码重用
5. **实用性**：作为开发新语言的工具，注重实用性和开发效率

meta-lisp 的 logo 是 "A Lisp for building new languages"，它旨在成为一个元语言，用于快速原型化和实现新的编程语言。
