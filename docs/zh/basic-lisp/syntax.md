---
title: 语法
---

# 前言

basic-lisp 是 meta-lisp 编译器的**底层中间表示**（IR），
使用**符号表达式**（S-expression）语法。

它同时支持两种编译目标：

- 编译 **meta-lisp** 这样的动态类型语言 -- 通过 `value-t` 和 tag 指令
- 编译类似 **C** 的静态类型语言 -- 通过具体类型和内存指令

模块顶层由**定义**（definition）和**声明**（claim）组成。
函数由**基本块**（block）组成，基本块由**指令**（instr）组成。

下面分组介绍 basic-lisp IR 的所有语法。

# 目录

- [前言](#前言)
- [目录](#目录)
- [注释](#注释)
- [类型](#类型)
  - [基本类型](#基本类型)
  - [结构体类型](#结构体类型)
  - [函数类型](#函数类型)
- [操作数](#操作数)
- [属性](#属性)
- [指令](#指令)
- [基本块](#基本块)
- [声明](#声明)
  - [(claim)](#claim)
- [定义](#定义)
  - [(define-function)](#define-function)
  - [(define-variable)](#define-variable)
  - [(define-struct)](#define-struct)
- [数据表达式](#数据表达式)
  - [裸字面量](#裸字面量)
  - [(address)](#address)
  - [(struct)](#struct)
  - [(pointer)](#pointer)
  - [(array)](#array)
- [例子](#例子)

# 注释

basic-lisp 使用 Lisp 风格的行注释，以 `;` 开头直到行尾。通常写两个分号 `;;`。

```scheme
;; 这是一条注释
(= result int64-t (iadd a b))  ;; 行尾注释
```

# 类型

类型分为基本类型和复合类型，
复合类型包含结构体类型和函数类型。

## 基本类型

| 类型        | 说明                     |
|-------------|--------------------------|
| `int64-t`   | 64 位整数                |
| `float64-t` | 64 位浮点数              |
| `bool-t`    | 布尔值                   |
| `void-t`    | 空值，用于不产生值的指令 |
| `pointer-t` | 不透明指针               |
| `value-t`   | 带有 tag 的动态值        |

- `pointer-t` 是 **opaque 指针** -- 不带元素类型。
  类型信息由 `load` / `store` 指令的 `:content-type` 属性携带。
- `value-t` 是 tagged dynamic value。所有 meta-lisp 值在 IR 中统一用此类型。

## 结构体类型

结构体类型由 `(define-struct <name> ...)` 引入，通过名称引用（如 `point-t`）。

只支持简单的结构体类型，不带类型参数。

## 函数类型

```scheme
(-> <arg-type> ... <ret-type>)
```

函数类型。

例如：

```scheme
(-> int64-t)
(-> pointer-t int64-t)
(-> float64-t float64-t float64-t)
(-> value-t value-t value-t value-t)
```

用于 `(claim)` 声明函数的类型。

# 操作数

操作数是指令的运行时值。

所有操作数都是 SSA 变量引用。

| 操作数   | 例子       |
|----------|------------|
| SSA 变量 | `x` `x.1` |

- 字面量常量（整数、浮点数、布尔值、符号地址等）通过 `const` 和 `address` 指令产生 SSA 变量，而非作为操作数。
- SSA 变量通过定义点确定类型，操作数处不需要标记类型。

# 属性

每个指令可以通过 `:<key> <attribute>` 语法带有任意多个属性。

属性 `<attribute>` 是编译时信息，与 `operand`（运行时值）分离，但同处于 `(<op> ...)` 操作形式之内。

| 种类     | 语法      | 说明         |
|----------|-----------|--------------|
| 类型引用 | `int64-t` | 引用一个类型 |
| 符号     | `foo`     | 符号名       |
| 整数     | `42`      | 整数值       |
| 浮点数   | `3.14`    | 浮点数值     |
| 布尔值   | `(true)` `(false)` | 布尔值 |
| 列表     | `(x y)`   | 属性列表     |

注意：

- 属性中整数、浮点数与操作数使用相同的 atom sexp 语法 -- `42` 为整数、`3.14` 为浮点数。
  区别在于语义角色：属性位于 `:key` 声明之后，属于编译期信息。
- 布尔值使用 `(true)` 和 `(false)` 语法，以区别于 symbol。

# 指令

指令分为两种形态：

**产生值的指令**（有结果 cell）：

```
(= <id> (<op> <operand> ... :<key> <attribute> ...))
```

- `<id>`：结果 cell 的标识，即变量名
- `<op>`：操作名 -- 代表了指令的种类
- `<operand>`：操作数 -- 运行时值，用于分析 def-use 关系
- `:<key> <attribute>`：属性常量，位于操作形式内部、operand 之后，以 `:` 前缀的 key 区分

**不产生值的指令**（无结果 cell，如 terminator 和副作用指令）：

```
(<op> <operand> ... :<key> <attribute> ...)
```

不带 `(= <id> ...)` 前缀，直接以 `(<op> ...)` 形式出现。

多结果的指令未来支持：

```
(= <id1> <id2> ... (<op> ...))
```

结果变量的类型由后续的类型推导 pass 决定，不在语法中显式标注。

```scheme
(= sum (iadd a b))
(branch cond :then-label then :else-label else)
```

每条指令的类型和用法详见[指令索引](instructions/index.md)。

# 基本块

基本块由标号和指令序列组成：

```scheme
(block <label>
  <instr>
  ...)
```

- 第一个 block 是 entry block。
- `instrs` 的最后一条指令必须为 terminator 类指令。
- 用 `(argument :index N)` 获取函数参数。

```scheme
(block body
  (= a (argument :index 0))
  (= b (argument :index 1))
  (= add-addr (address :name add))
  (= sum (call add-addr a b))
  (return sum))
```

# 声明

## (claim)

```scheme
(claim <name> <type>)
```

声明一个顶层定义的类型。

函数用 `(-> ...)` arrow-type：

```scheme
(claim add-or-sub (-> value-t value-t value-t value-t))
(claim identity (-> int64-t int64-t))
```

变量用具体类型：

```scheme
(claim origin point-t)
(claim counter int64-t)
```

`claim` 存储于模块的 `claims` 中，不在 `definitions` 中。

# 定义

basic-lisp 有三种定义：结构体定义、函数定义和变量定义。

## (define-function)

```scheme
(define-function <name>
  <block> ...)
```

定义可执行函数。

- 完整类型由同名 `claim` 提供。
- `blocks` 的第一个 block 是 entry block。
- 参数通过 `(argument :index N)` 获取。

```scheme
(claim add1 (-> int64-t int64-t))

(define-function add1
  (block body
    (= n (argument :index 0))
    (= one (int64 :content 1))
    (= result (iadd n one))
    (return result))))
```

## (define-variable)

```scheme
(define-variable <name>)            ;; BSS（无初始化）
(define-variable <name> <exp>)      ;; 静态初始化
```

定义全局变量。

- 完整类型由同名 `claim` 提供。
- 不带 `<exp>` 时等价于 BSS 段的未初始化变量。
- 带 `<exp>` 时以数据表达式描述数据段内存布局，静态初始化。

```scheme
(claim origin point-t)
(define-variable origin (struct point-t (x 0) (y 0)))

(claim buffer buffer-t)
(define-variable buffer)
```

## (define-struct)

```scheme
(define-struct <type-name>-t
  (<field-name> <type>)
  ...)
```

声明结构体类型及字段布局。

- 类型名必须以 `-t` 结尾。
- 字段列表是有序的，决定各字段偏移与总大小。
- 布局为 packed -- 字段间无 padding。

```scheme
(define-struct point-t
  (x int64-t)
  (y int64-t))

(define-struct string-table-t
  (count int64-t)
  (entries pointer-t)
  (title pointer-t))
```

# 数据表达式

数据表达式用于 `(define-variable)`，描述数据段内存布局。
它不是指令中的运行时值（`operand-t`），而是独立的数据类型。

## 裸字面量

整数：

```scheme
42
-1
0
```

浮点数：

```scheme
3.14
-2.5
```

字符串：

```scheme
"hello"
"world"
```

字符串表达式会被翻译为指针，
指向 string table 中 null 结尾的 C 风格的 string。

## (address)

```scheme
(address <name>)
```

对已定义符号的地址引用。

```scheme
(address origin)
(address ©str.0)
```

## (struct)

```scheme
(struct <name> (<field> <exp>) ...)
```

描述 struct 实例的内存布局。`<field>` 的值是递归的数据表达式。

`<name>` 必选。

```scheme
(define-variable origin
  (struct point-t
    (x 0)
    (y 0)))
```

## (pointer)

```scheme
(pointer <exp>)
```

指向内联数据的指针，数据序列化在指针之后。

```scheme
(pointer
  (struct node-t
    (value 1)
    (next 0)))
```

## (array)

```scheme
(array <exp> ...)
```

定长有序数组。

```scheme
(array 1 2 3)
(array
  (address ©str.0)
  (address ©str.1))
```

# 例子

```scheme
(claim add1 (-> int64-t int64-t))
(define-function add1
  (block body
    (= n (argument :index 0))
    (= one (int64 :content 1))
    (= result (iadd n one))
    (return result))))

(define-struct point-t
  (x int64-t)
  (y int64-t))

(claim origin point-t)
(define-variable origin
  (struct point-t
    (x 0)
    (y 0)))
```
