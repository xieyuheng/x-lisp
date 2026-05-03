# Meta-Lisp 语言参考手册

> 本文档由 hy3-preview 模型生成，基于 x-lisp 项目源码分析。

## 目录

- [简介](#简介)
- [基本语法](#基本语法)
- [特殊形式](#特殊形式)
- [类型系统](#类型系统)
- [模块系统](#模块系统)
- [内置函数](#内置函数)
- [高级特性](#高级特性)
- [如何运行](#如何运行)

---

## 简介

Meta-Lisp 是 x-lisp 项目系列中的核心语言，设计目标是加快新语言开发的速度。它适合用来编写新的解释器与编译器，以探索新的计算模型，如：

- Interaction Net
- Pi-Calculus
- Rewrite System
- Propagator Model
- Logic Constraint Programming
- Reactive Programming

Meta-Lisp 在 Lisp 语法框架内，可以更快地设计和迭代新语法，从而加快新语言的开发速度。

### 设计目标

1. **主要目标**：加快新语言开发速度，作为探索新计算模型的基础工具
2. **次要目标**：
   - 方便用 C 扩展，可作为 C 实现的 library 和 app 的脚本语言
   - 尽量使实现独立，简化所依赖的技术栈

---

## 基本语法

### S-表达式

Meta-Lisp 使用 S-表达式作为语法基础，支持以下数据类型：

| 类型 | 语法示例 | 说明 |
|------|----------|------|
| **符号 (Symbol)** | `foo`, `bar123` | 符号，用作标识符 |
| **字符串 (String)** | `"hello"` | 字符串 |
| **整数 (Int)** | `42`, `100` | 大整数（bigint） |
| **浮点数 (Float)** | `3.14`, `1.0` | 浮点数 |
| **关键字 (Keyword)** | `:foo`, `:bar` | 以冒号开头的关键字 |
| **列表 (List)** | `(a b c)` | 列表 |

### 注释

使用分号 `;` 进行单行注释：

```scheme
; 这是一条注释
(define x 10) ; 行尾注释
```

### 字面量语法

```scheme
; 引用 -- 原样返回 S-表达式
@quote (some s-exp)

; 字面量列表
@list element1 element2 ...

; 字面量记录
@record :key1 value1 :key2 value2 ...

; 字面量集合
@set element1 element2 ...

; 字面量哈希表
@hash key1 value1 key2 value2 ...
```

---

## 特殊形式

特殊形式是语言的核心语法结构，它们不是普通函数，而是被求值器特殊处理。

### 定义与绑定

#### `define` - 定义变量或函数

```scheme
; 定义变量
(define name value)

; 定义函数
(define (name param1 param2 ...)
  body)

; 示例
(define pi 3.14159)
(define (square x) (fmul x x))
(define (add a b) (iadd a b))
```

#### `lambda` - 匿名函数

```scheme
(lambda (param1 param2 ...)
  body)

; 示例
(define double (lambda (x) (fmul x 2.0)))
(define apply-f (lambda (f x) (f x)))
```

### 条件表达式

#### `if` - 条件分支

```scheme
(if condition consequent alternative)

; 示例
(if (int-positive? x)
    (print "positive")
    (print "non-positive"))
```

#### `when` - 条件为真时执行

```scheme
(when condition
  body ...)

; 示例
(when (int-positive? x)
  (println "x is positive")
  (println "doing something..."))
```

#### `unless` - 条件为假时执行

```scheme
(unless condition
  body ...)

; 示例
(unless (int-positive? x)
  (println "x is not positive"))
```

#### `and` - 逻辑与

```scheme
(and expr1 expr2 ...)

; 短路求值，返回最后一个为真的值或第一个为假的值
```

#### `or` - 逻辑或

```scheme
(or expr1 expr2 ...)

; 短路求值，返回第一个为真的值或最后一个为假的值
```

#### `cond` - 多条件分支

```scheme
(cond
  (question1 answer1)
  (question2 answer2)
  (else default-answer))

; 示例
(cond
  ((int-greater? x 0) (print "positive"))
  ((int-less? x 0) (print "negative"))
  (else (print "zero")))
```

### 局部绑定

#### `let` - 并行绑定

```scheme
(let ((name1 rhs1)
      (name2 rhs2))
  body)

; 所有 rhs 在绑定前求值，绑定是并行的
; 示例
(let ((a 10)
      (b 20))
  (iadd a b))
```

#### `let*` - 顺序绑定

```scheme
(let* ((name1 rhs1)
       (name2 rhs2))
  body)

; 后面的绑定可以看到前面的绑定
; 示例
(let* ((x 10)
       (y (iadd x 5)))
  (iadd x y)) ; 返回 25
```

#### `begin` - 顺序执行

```scheme
(begin
  expr1
  expr2
  ...)

; 顺序执行多个表达式，返回最后一个的值
; 示例
(begin
  (println "first")
  (println "second")
  (iadd 1 2))
```

### 模式匹配

#### `match` - 单目标匹配

```scheme
(match target
  (pattern1 body1)
  (pattern2 body2)
  ...)

; 示例
(match list
  (#nil 0)
  ((cons head tail) (iadd 1 (length tail))))
```

#### `match-many` - 多目标匹配

```scheme
(match-many (target1 target2 ...)
  (pattern1 pattern2 ...) body)

; 同时匹配多个目标
```

---

## 类型系统

Meta-Lisp 具有一个静态类型系统，使用双向类型检查（bidirectional type checker）。

### 基础类型

| 类型 | 说明 |
|------|------|
| `type-t` | 类型类型（类型的类型） |
| `int-t` | 整数类型 |
| `float-t` | 浮点数类型 |
| `string-t` | 字符串类型 |
| `symbol-t` | 符号类型 |
| `keyword-t` | 关键字类型 |
| `bool-t` | 布尔类型 |
| `void-t` | 空类型 |
| `file-t` | 文件句柄类型 |

### 类型构造器

#### 列表类型

```scheme
(list-t element-type)

; 示例
(list-t int-t)        ; 整数列表
(list-t string-t)     ; 字符串列表
```

#### 集合类型

```scheme
(set-t element-type)

; 示例
(set-t int-t)         ; 整数集合
```

#### 哈希表类型

```scheme
(hash-t key-type value-type)

; 示例
(hash-t string-t int-t)  ; 键为字符串、值为整数的哈希表
```

#### 函数类型

```scheme
(-> arg-type1 arg-type2 ... ret-type)

; 示例
(-> int-t int-t)                    ; 接受整数，返回整数
(-> string-t (list-t char-t))       ; 接受字符串，返回字符列表
```

#### 接口类型

```scheme
(interface
  :field1 type1
  :field2 type2 ...)

; 示例
(interface
  :x float-t
  :y float-t)
```

#### 扩展接口

```scheme
(extend-interface base-type
  :field1 type1 ...)

; 示例
(extend-interface point-t
  :z float-t)
```

### 类型定义

#### `define-type` - 定义类型别名

```scheme
; 简单类型别名
(define-type name
  body-type)

; 参数化类型
(define-type (name param1 param2 ...)
  body-type)

; 示例
(define-type point-t
  (interface
    :x float-t
    :y float-t))

(define-type (pair-t A B)
  (interface
    :first A
    :second B))
```

#### `define-data` - 定义数据类型（代数数据类型）

```scheme
(define-data (data-type-name param ...)
  (constructor1 field1 field2 ...)
  (constructor2 ...))

; 示例：定义列表数据类型
(define-data (my-list-t E)
  (nil)
  (cons (head E) (tail (my-list-t E))))

; 使用
(define my-list (cons 1 (cons 2 (nil))))
```

#### `define-interface` - 定义接口

```scheme
(define-interface (interface-name param ...)
  :field1 type1
  :field2 type2 ...)

; 示例
(define-interface (point-3d-t)
  :x float-t
  :y float-t
  :z float-t)
```

### 类型注解

#### `the` - 类型注解

```scheme
(the type expression)

; 示例
(the int-t 42)
(the (list-t string-t) (list "a" "b" "c"))
```

#### `polymorphic` - 多态类型

```scheme
(polymorphic (A B ...)
  type-or-expression)

; 示例：多态恒等函数
(define identity
  (polymorphic (A)
    (lambda (x) x)))
```

### 记录操作

#### 创建记录

```scheme
(@record :x 1 :y 2)

; 或使用字面量语法
@record :x 1 :y 2
```

#### 访问记录字段

```scheme
(:field-name record)

; 示例
(define p @record :x 10.0 :y 20.0)
(:x p)    ; 返回 10.0
(:y p)    ; 返回 20.0
```

#### 扩展/更新记录

```scheme
; 不可变更新 -- 返回新记录
(extend record
  :field1 new-value)

(update record
  :field1 new-value)

; 可变更新 -- 修改原记录
(update! record
  :field1 new-value)
```

---

## 模块系统

### 模块声明

#### `module` - 声明模块

```scheme
(module module-name)

; 示例
(module math-utils)
```

#### `type-error-module` - 声明类型错误测试模块

```scheme
(type-error-module module-name)

; 用于测试类型错误的模块
```

### 导入

#### `import` - 导入指定名称

```scheme
(import module-name (name1 name2 ...))

; 示例
(import math-utils (square cube))
```

#### `import-as` - 导入并添加前缀

```scheme
(import-as module-name prefix)

; 示例
(import-as math-utils math/)
; 然后使用 math/square, math/cube 等
```

#### `import-all` - 导入所有

```scheme
(import-all module-name)

; 导入模块的所有导出
```

### 声明与断言

#### `claim` - 类型断言

```scheme
(claim name type)

; 声明一个名字的类型，用于类型检查
; 示例
(claim square (-> float-t float-t))
```

#### `exempt` - 豁免检查

```scheme
(exempt (name1 name2 ...))

; 豁免某些名字的检查，通常用于内置函数
```

#### `declare-primitive-function` - 声明原生函数

```scheme
(declare-primitive-function name arity)

; 声明一个原生函数及其元数
```

#### `declare-primitive-variable` - 声明原生变量

```scheme
(declare-primitive-variable name)

; 声明一个原生变量
```

### 测试

#### `define-test` - 定义测试

```scheme
(define-test test-name
  body ...)

; 示例
(define-test test-addition
  (assert-equal (iadd 1 2) 3))
```

---

## 内置函数

### 整数运算 (`int-t`)

| 函数 | 类型 | 说明 |
|------|------|------|
| `ineg` | `(-> int-t int-t)` | 取负 |
| `iadd` | `(-> int-t int-t int-t)` | 加法 |
| `isub` | `(-> int-t int-t int-t)` | 减法 |
| `imul` | `(-> int-t int-t int-t)` | 乘法 |
| `idiv` | `(-> int-t int-t int-t)` | 整除 |
| `imod` | `(-> int-t int-t int-t)` | 取模 |
| `int-max` | `(-> int-t int-t int-t)` | 最大值 |
| `int-min` | `(-> int-t int-t int-t)` | 最小值 |
| `int-positive?` | `(-> int-t bool-t)` | 是否正数 |
| `int-non-negative?` | `(-> int-t bool-t)` | 是否非负 |
| `int-non-zero?` | `(-> int-t bool-t)` | 是否非零 |
| `int-greater?` | `(-> int-t int-t bool-t)` | 大于 |
| `int-less?` | `(-> int-t int-t bool-t)` | 小于 |
| `int-greater-or-equal?` | `(-> int-t int-t bool-t)` | 大于等于 |
| `int-less-or-equal?` | `(-> int-t int-t bool-t)` | 小于等于 |
| `int-compare-ascending` | `(-> int-t int-t int-t)` | 比较（升序，-1/0/1） |
| `int-compare-descending` | `(-> int-t int-t int-t)` | 比较（降序，-1/0/1） |
| `int?` | `(polymorphic (A) (-> A bool-t))` | 是否为整数 |

### 浮点数运算 (`float-t`)

| 函数 | 类型 | 说明 |
|------|------|------|
| `fneg` | `(-> float-t float-t)` | 取负 |
| `fadd` | `(-> float-t float-t float-t)` | 加法 |
| `fsub` | `(-> float-t float-t float-t)` | 减法 |
| `fmul` | `(-> float-t float-t float-t)` | 乘法 |
| `fdiv` | `(-> float-t float-t float-t)` | 除法 |
| `fmod` | `(-> float-t float-t float-t)` | 取模 |
| `float-max` | `(-> float-t float-t float-t)` | 最大值 |
| `float-min` | `(-> float-t float-t float-t)` | 最小值 |
| `float-positive?` | `(-> float-t bool-t)` | 是否正数 |
| `float-non-negative?` | `(-> float-t bool-t)` | 是否非负 |
| `float-non-zero?` | `(-> float-t bool-t)` | 是否非零 |
| `float-greater?` | `(-> float-t float-t bool-t)` | 大于 |
| `float-less?` | `(-> float-t float-t bool-t)` | 小于 |
| `float-greater-or-equal?` | `(-> float-t float-t bool-t)` | 大于等于 |
| `float-less-or-equal?` | `(-> float-t float-t bool-t)` | 小于等于 |
| `float-compare-ascending` | `(-> float-t float-t int-t)` | 比较（升序） |
| `float-compare-descending` | `(-> float-t float-t int-t)` | 比较（降序） |
| `float?` | `(polymorphic (A) (-> A bool-t))` | 是否为浮点数 |

### 布尔运算 (`bool-t`)

| 函数 | 类型 | 说明 |
|------|------|------|
| `true` | `bool-t` | 真值 |
| `false` | `bool-t` | 假值 |
| `not` | `(-> bool-t bool-t)` | 取反 |
| `bool?` | `(polymorphic (A) (-> A bool-t))` | 是否为布尔值 |

### 字符串操作 (`string-t`)

| 函数 | 类型 | 说明 |
|------|------|------|
| `string-length` | `(-> string-t int-t)` | 字符串长度 |
| `string-empty?` | `(-> string-t bool-t)` | 是否为空 |
| `string-blank?` | `(-> string-t bool-t)` | 是否为空白 |
| `string-substring` | `(-> int-t int-t string-t string-t)` | 子字符串 |
| `string-append` | `(-> string-t string-t string-t)` | 追加 |
| `string-concat` | `(-> (list-t string-t) string-t)` | 连接列表 |
| `string-compare-lexical` | `(-> string-t string-t int-t)` | 字典序比较 |
| `string-to-symbol` | `(-> string-t symbol-t)` | 转为符号 |
| `string-chars` | `(-> string-t (list-t string-t))` | 转为字符列表 |
| `string-lines` | `(-> string-t (list-t string-t))` | 按行分割 |
| `string-split` | `(-> string-t string-t (list-t string-t))` | 分割 |
| `string-join` | `(-> string-t (list-t string-t) string-t)` | 连接 |
| `string-replace` | `(-> string-t string-t string-t string-t)` | 替换 |
| `string-starts-with?` | `(-> string-t string-t bool-t)` | 以...开头 |
| `string-ends-with?` | `(-> string-t string-t bool-t)` | 以...结尾 |
| `string-to-upper-case` | `(-> string-t string-t)` | 转大写 |
| `string-to-lower-case` | `(-> string-t string-t)` | 转小写 |
| `string-get-code-point` | `(-> int-t string-t int-t)` | 获取代码点 |
| `string-contains?` | `(-> string-t string-t bool-t)` | 包含子串 |
| `string-find-index` | `(-> string-t string-t int-t)` | 查找索引 |
| `string-trim-left` / `string-trim-start` | `(-> string-t string-t)` | 左/开头去空白 |
| `string-trim-right` / `string-trim-end` | `(-> string-t string-t)` | 右/结尾去空白 |
| `string-trim` | `(-> string-t string-t)` | 去空白 |
| `string?` | `(polymorphic (A) (-> A bool-t))` | 是否为字符串 |

### 符号操作 (`symbol-t`)

| 函数 | 类型 | 说明 |
|------|------|------|
| `symbol-length` | `(-> symbol-t int-t)` | 符号长度 |
| `symbol-to-string` | `(-> symbol-t string-t)` | 转为字符串 |
| `symbol-append` | `(-> symbol-t symbol-t symbol-t)` | 追加 |
| `symbol-concat` | `(-> (list-t symbol-t) symbol-t)` | 连接 |
| `symbol?` | `(polymorphic (A) (-> A bool-t))` | 是否为符号 |

### 关键字操作 (`keyword-t`)

| 函数 | 类型 | 说明 |
|------|------|------|
| `keyword-length` | `(-> keyword-t int-t)` | 关键字长度 |
| `keyword-to-string` | `(-> keyword-t string-t)` | 转为字符串 |
| `keyword-append` | `(-> keyword-t keyword-t keyword-t)` | 追加 |
| `keyword-concat` | `(-> (list-t keyword-t) keyword-t)` | 连接 |
| `keyword?` | `(polymorphic (A) (-> A bool-t))` | 是否为关键字 |

### 列表操作 (`list-t`)

| 函数 | 类型 | 说明 |
|------|------|------|
| `list?` | `(polymorphic (A) (-> A bool-t))` | 是否为列表 |
| `make-list` | `(polymorphic (E) (-> (list-t E)))` | 创建空列表 |
| `car` / `list-head` | `(polymorphic (E) (-> (list-t E) E))` | 取头部 |
| `cdr` / `list-tail` | `(polymorphic (E) (-> (list-t E) (list-t E)))` | 取尾部 |
| `cons` | `(polymorphic (E) (-> E (list-t E) (list-t E)))` | 构造列表 |
| `list-init` | `(polymorphic (E) (-> (list-t E) (list-t E)))` | 除最后一个 |
| `list-last` | `(polymorphic (E) (-> (list-t E) E))` | 取最后一个 |
| `list-length` | `(polymorphic (E) (-> (list-t E) int-t))` | 列表长度 |
| `list-empty?` | `(polymorphic (E) (-> (list-t E) bool-t))` | 是否为空 |
| `list-copy` | `(polymorphic (E) (-> (list-t E) (list-t E)))` | 复制 |
| `list-get` | `(polymorphic (E) (-> int-t (list-t E) E))` | 按索引获取 |
| `list-put` | `(polymorphic (E) (-> int-t E (list-t E) (list-t E)))` | 不可变修改 |
| `list-put!` | `(polymorphic (E) (-> int-t E (list-t E) (list-t E)))` | 可变修改 |
| `list-push` | `(polymorphic (E) (-> E (list-t E) (list-t E)))` | 不可变压入 |
| `list-push!` | `(polymorphic (E) (-> E (list-t E) (list-t E)))` | 可变压入 |
| `list-pop!` | `(polymorphic (E) (-> (list-t E) E))` | 弹出末尾 |
| `list-pop-front!` | `(polymorphic (E) (-> (list-t E) E))` | 弹出头部 |
| `list-push-front!` | `(polymorphic (E) (-> E (list-t E) (list-t E)))` | 压入头部 |
| `list-reverse` | `(polymorphic (E) (-> (list-t E) (list-t E)))` | 反转 |
| `list-to-set` | `(polymorphic (E) (-> (list-t E) (set-t E)))` | 转为集合 |

### 集合操作 (`set-t`)

| 函数 | 类型 | 说明 |
|------|------|------|
| `make-set` | `(polymorphic (E) (-> (set-t E)))` | 创建空集合 |
| `set-copy` | `(polymorphic (E) (-> (set-t E) (set-t E)))` | 复制 |
| `set-size` | `(polymorphic (E) (-> (set-t E) int-t))` | 集合大小 |
| `set-empty?` | `(polymorphic (E) (-> (set-t E) bool-t))` | 是否为空 |
| `set-member?` | `(polymorphic (E) (-> E (set-t E) bool-t))` | 是否包含 |
| `set-subset?` | `(polymorphic (E) (-> (set-t E) (set-t E) bool-t))` | 是否为子集 |
| `set-to-list` | `(polymorphic (E) (-> (set-t E) (list-t E)))` | 转为列表 |
| `set-add` | `(polymorphic (E) (-> E (set-t E) (set-t E)))` | 不可变添加 |
| `set-add!` | `(polymorphic (E) (-> E (set-t E) (set-t E)))` | 可变添加 |
| `set-delete` | `(polymorphic (E) (-> E (set-t E) (set-t E)))` | 不可变删除 |
| `set-delete!` | `(polymorphic (E) (-> E (set-t E) (set-t E)))` | 可变删除 |
| `set-clear!` | `(polymorphic (E) (-> (set-t E) (set-t E)))` | 清空 |
| `set-union` | `(polymorphic (E) (-> (set-t E) (set-t E) (set-t E)))` | 并集 |
| `set-inter` | `(polymorphic (E) (-> (set-t E) (set-t E) (set-t E)))` | 交集 |
| `set-difference` | `(polymorphic (E) (-> (set-t E) (set-t E) (set-t E)))` | 差集 |
| `set-disjoint?` | `(polymorphic (E) (-> (set-t E) (set-t E) bool-t))` | 是否不相交 |

### 哈希表操作 (`hash-t`)

| 函数 | 类型 | 说明 |
|------|------|------|
| `make-hash` | `(polymorphic (K V) (-> (hash-t K V)))` | 创建空哈希表 |
| `hash-empty?` | `(polymorphic (K V) (-> (hash-t K V) bool-t))` | 是否为空 |
| `hash-length` | `(polymorphic (K V) (-> (hash-t K V) int-t))` | 哈希表大小 |
| `hash-get` | `(polymorphic (K V) (-> K (hash-t K V) V))` | 获取值 |
| `hash-has?` | `(polymorphic (K V) (-> K (hash-t K V) bool-t))` | 是否包含键 |
| `hash-put` | `(polymorphic (K V) (-> K V (hash-t K V) (hash-t K V)))` | 不可变放入 |
| `hash-put!` | `(polymorphic (K V) (-> K V (hash-t K V) (hash-t K V)))` | 可变放入 |
| `hash-delete!` | `(polymorphic (K V) (-> K (hash-t K V) (hash-t K V)))` | 可变删除 |
| `hash-copy` | `(polymorphic (K V) (-> (hash-t K V) (hash-t K V)))` | 复制 |
| `hash-entries` | `(polymorphic (K V) (-> (hash-t K V) (list-t (hash-entry-t K V))))` | 获取条目 |
| `hash-keys` | `(polymorphic (K V) (-> (hash-t K V) (list-t K)))` | 获取所有键 |
| `hash-values` | `(polymorphic (K V) (-> (hash-t K V) (list-t V)))` | 获取所有值 |

### 文件与 IO

| 函数 | 类型 | 说明 |
|------|------|------|
| `open-input-file` | `(-> string-t file-t)` | 打开输入文件 |
| `open-output-file` | `(-> string-t file-t)` | 打开输出文件 |
| `file-close` | `(-> file-t void-t)` | 关闭文件 |
| `file-read` | `(-> file-t string-t)` | 读取文件 |
| `file-write` | `(-> file-t string-t void-t)` | 写入文件 |
| `file-writeln` | `(-> file-t string-t void-t)` | 写入文件并换行 |
| `print` | `(polymorphic (A) (-> A void-t))` | 打印（不换行） |
| `println` | `(polymorphic (A) (-> A void-t))` | 打印（换行） |
| `write` | `(-> string-t void-t)` | 写入字符串（不换行） |
| `writeln` | `(-> string-t void-t)` | 写入字符串（换行） |
| `newline` | `(-> void-t)` | 换行 |

### 断言与错误

| 函数 | 类型 | 说明 |
|------|------|------|
| `assert` | `(-> bool-t void-t)` | 断言为真 |
| `assert-not` | `(-> bool-t void-t)` | 断言为假 |
| `assert-equal` | `(polymorphic (A) (-> A A void-t))` | 断言相等 |
| `assert-not-equal` | `(polymorphic (A) (-> A A void-t))` | 断言不相等 |
| `error` | `(polymorphic (A) (-> string-t A))` | 抛出错误 |
| `error-with-location` | `(polymorphic (A) (-> string-t source-location-t A))` | 带位置的错误 |

### 通用值操作

| 函数 | 类型 | 说明 |
|------|------|------|
| `atom?` | `(polymorphic (A) (-> A bool-t))` | 是否为原子 |
| `same?` | `(polymorphic (A) (-> A A bool-t))` | 同一性判断 |
| `equal?` | `(polymorphic (A) (-> A A bool-t))` | 相等性判断 |
| `format` | `(polymorphic (A) (-> A string-t))` | 格式化为字符串 |
| `hash-code` | `(polymorphic (A) (-> A int-t))` | 计算哈希码 |
| `total-compare` | `(polymorphic (A) (-> A A int-t))` | 全序比较 |

### 其他

| 函数 | 类型 | 说明 |
|------|------|------|
| `void` | `void-t` | 空值 |
| `void?` | `(polymorphic (A) (-> A bool-t))` | 是否为空值 |
| `random-int` | `(-> int-t int-t int-t)` | 随机整数 |
| `random-float` | `(-> float-t float-t float-t)` | 随机浮点数 |
| `exit` | `(-> int-t void-t)` | 退出程序 |
| `current-directory` | `(-> string-t)` | 获取当前目录 |

### 文件系统操作

| 函数 | 类型 | 说明 |
|------|------|------|
| `fs-exists?` | `(-> string-t bool-t)` | 路径是否存在 |
| `fs-file?` | `(-> string-t bool-t)` | 是否为文件 |
| `fs-directory?` | `(-> string-t bool-t)` | 是否为目录 |
| `fs-read` | `(-> string-t string-t)` | 读取文件全部内容 |
| `fs-write` | `(-> string-t string-t void-t)` | 写入文件 |
| `fs-list` | `(-> string-t (list-t string-t))` | 列出目录内容 |
| `fs-ensure-file` | `(-> string-t void-t)` | 确保文件存在 |
| `fs-ensure-directory` | `(-> string-t void-t)` | 确保目录存在 |
| `fs-delete-file` | `(-> string-t void-t)` | 删除文件 |
| `fs-delete-directory` | `(-> string-t void-t)` | 删除目录 |
| `fs-delete` | `(-> string-t void-t)` | 删除路径 |
| `fs-rename` | `(-> string-t string-t void-t)` | 重命名 |

---

## 高级特性

### 行多态（Row Polymorphism）

Meta-Lisp 支持行多态，允许函数操作具有特定字段的记录，而不关心记录的其他字段：

```scheme
(define-interface point-t
  :x float-t
  :y float-t)

; 可以接受任何包含 :y 字段的记录
(claim point-y
  (polymorphic (R A)
    (-> (extend-interface R :y A)
        A)))

(define (point-y point)
  (:y point))

; 即使记录有其他字段，也能正常工作
(define p3d @record :x 1.0 :y 2.0 :z 3.0)
(point-y p3d)  ; 返回 2.0，即使 p3d 有 :z 字段
```

### 数据类型与模式匹配

使用 `define-data` 定义代数数据类型，配合 `match` 进行模式匹配：

```scheme
; 定义二叉树
(define-data (tree-t E)
  (leaf (value E))
  (node (left (tree-t E)) (right (tree-t E))))

; 使用模式匹配计算树的大小
(define (tree-size tree)
  (match tree
    ((leaf value) 1)
    ((node left right)
     (iadd (tree-size left)
           (tree-size right)))))

; 创建树
(define my-tree
  (node (leaf 1) (leaf 2)))
```

### 高阶函数

Meta-Lisp 支持高阶函数，函数可以作为参数传递和作为返回值：

```scheme
; identity 函数
(define (identity x) x)

; 常量函数
(define (constant x y) x)

; 交换参数顺序
(define (swap f x y) (f y x))

; 丢弃参数
(define (drop f)
  (lambda (dropped x) (f x)))

; 复制参数
(define (dup f)
  (lambda (x) (f x x)))

; 组合函数
(define (compose f g)
  (lambda (x) (f (g x))))

; 使用
(define double (lambda (x) (fmul x 2.0)))
(define inc (lambda (x) (fadd x 1.0)))
(define double-then-inc (compose inc double))
```

---

## 如何运行

### 使用 meta-lisp.js 编译器

Meta-Lisp 使用 TypeScript 实现的编译器进行类型检查和构建。

#### 检查类型

```bash
node projects/meta-lisp.js/src/main.ts check --config <项目配置文件>
```

#### 构建项目

```bash
node projects/meta-lisp.js/src/main.ts build --config <项目配置文件>
```

#### 运行测试

```bash
node projects/meta-lisp.js/src/main.ts test --config <项目配置文件> --builtin
```

### 项目结构

一个典型的 Meta-Lisp 项目包含以下结构：

```
my-project.meta/
├── src/              # 源代码目录
│   ├── main.meta     # 主模块
│   └── ...
├── build/            # 构建输出目录
├── snapshot/         # 测试快照目录
├── package.json      # 项目配置（如果适用）
└── [配置文件]        # 指定模块路径等
```

### 示例项目

`projects/meta-examples.meta/` 包含了示例元语言项目，可以用来学习和测试：

```bash
cd projects/meta-examples.meta
./meta-lisp.js test --profile --builtin
```

### 在代码中使用

以下是一个简单的 Meta-Lisp 程序示例：

```scheme
; hello.meta
(module hello)

(import io (println))

(define (main)
  (println "Hello, Meta-Lisp!"))

(main)
```

---

## 设计笔记摘要

根据 `docs/diary/` 中的设计笔记：

### Meta-Lisp 的定位

Meta-Lisp 带有类型系统，类似于 ML 与 Coq 的关系，它是 cicada-lisp 的基础。

### 类型系统特点

- 使用 bidirectional type checker（双向类型检查器）
- 支持简单类型、多态、行多态
- 支持 datatype（代数数据类型）和 interface
- 支持子类型关系

### 设计哲学

- 在 Lisp 的语法框架内快速设计和迭代新语法
- 加快新语言开发速度
- 方便用 C 扩展
- 尽量使实现独立，简化技术栈

---

## 参考资料

- 项目主页：`/home/xyh/projects/xieyuheng/x-lisp`
- 编译器源码：`projects/meta-lisp.js/src/`
- 内置函数：`projects/meta-builtin.meta/src/`
- 示例代码：`projects/meta-examples.meta/src/`
- 设计文档：`docs/design/`
- 开发日志：`docs/diary/`

---

*本文档由 hy3-preview (opencode/hy3-preview-free) 生成。*
