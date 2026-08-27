---
title: 语法
---

# 前言

basic-lisp 是 meta-lisp 编译器的**底层中间表示**（IR），
使用**符号算式**（S-expression）语法。

它同时支持两种编译目标：

- 编译 **meta-lisp** 这样的动态类型语言 -- 通过 `value-t` 和 tag 指令
- 编译类似 **C** 的静态类型语言 -- 通过具体类型和内存指令

模块顶层由**定义**（definition）和**声明**（claim）组成。
函数由**基本块**（block）组成，基本块由**指令**（instr）组成。

下面分组介绍 basic-lisp IR 的所有语法。

# 目录

- [前言](#前言)
- [目录](#目录)
- [指令](#指令)
- [基本块](#基本块)
- [注释](#注释)
- [类型](#类型)
  - [基本类型](#基本类型)
  - [结构体类型](#结构体类型)
  - [函数类型](#函数类型)
- [格子](#格子)
- [属性](#属性)
- [声明](#声明)
  - [(claim)](#claim)
- [定义](#定义)
  - [(define-function)](#define-function)
  - [(define-variable)](#define-variable)
  - [(define-struct)](#define-struct)
  - [(extern-function)](#extern-function)
  - [(extern-variable)](#extern-variable)
- [数据](#数据)
  - [裸字面量](#裸字面量)
  - [(address)](#address)
  - [(struct)](#struct)
  - [(pointer)](#pointer)
  - [(array)](#array)
- [例子](#例子)

# 注释

注释以 `;` 开头，直到行尾。

在写行注释的时候 lisp 程序员通常写两个 `;;`。

```scheme
;; 注释
(= result int64-t (iadd a b))  ;; 行尾注释
```

# 指令

有输出 cell 的指令：

```scheme
(= <cell> (<op> <cell> ... :<key> <attribute> ...))
```

- `<cell>`（左侧）：指令的输出 cell
- `<op>`：指令的操作名
- `<cell>`（右侧）：指令的输入 cell
- `:<key> <attribute>`：指令的属性常量

未来支持多输出 cell 可以用如下语法支持：

```scheme
(= <cell> ... (<op> <cell> ... :<key> <attribute> ...))
```

无输出 cell 的指令，如 terminator 和副作用指令：

```scheme
(<op> <cell> ... :<key> <attribute> ...)
```

```scheme
(= sum (iadd a b))
(branch cond :then-label then :else-label else)
```

每条指令的类型和用法详见[指令参考](instructions.md)。

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

# 类型

每个 cell 都有固定的类型，
可以根据 cell 的使用情况推导出来。

类型分为基本类型和复合类型，
复合类型包含结构体类型和函数类型。

## 基本类型

| 类型        | 说明              |
|-------------|-------------------|
| `int64-t`   | 64 位整数         |
| `float64-t` | 64 位浮点数       |
| `bool-t`    | 布尔值            |
| `void-t`    | 空值              |
| `pointer-t` | 不透明指针        |
| `value-t`   | 带有 tag 的动态值 |

- `pointer-t` 是 **opaque 指针** -- 不带元素类型。
  读写类型由操作数 cell 的类型推导。
- `value-t` 是 tagged dynamic value。
  所有 meta-lisp 值在 IR 中统一用此类型。

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

未来需要支持多返回值类型可以用 `(values)` 语法：

```scheme
(-> int64-t int64-t (values int64-t int64-t))
```

# 格子

格子（cell）是 SSA 值的容器。
一个函数中，在参数位置出现的每个局部变量，都被视为一个 cell。
每个 cell 有唯一的标识（id）。
cell 在 instruction 中，被代表 propagator 的 op 连接起来，形成传播网络。

所有 cell 都是 SSA 变量引用。

| 语法   | 例子      |
|--------|-----------|
| 变量名 | `x` `x.1` |

# 属性

每个指令可以通过 `:<key> <attribute>` 语法带有任意多个属性。

属性 `<attribute>` 是编译时信息，与 cell（运行时值）分离，但同处于 `(<op> ...)` 操作形式之内。

| 种类     | 语法               | 说明         |
|----------|--------------------|--------------|
| 类型引用 | `int64-t`          | 引用一个类型 |
| 符号     | `foo`              | 符号名       |
| 整数     | `42`               | 整数值       |
| 浮点数   | `3.14`             | 浮点数值     |
| 布尔值   | `(true)` `(false)` | 布尔值       |
| 列表     | `(x y)`            | 属性列表     |

注意：

- 属性中整数、浮点数与 cell 使用相同的 atom sexp 语法 -- `42` 为整数、`3.14` 为浮点数。
  区别在于语义角色：属性位于 `:key` 声明之后，属于编译期信息。
- 布尔值使用 `(true)` 和 `(false)` 语法，以区别于 symbol。

# 声明

## (claim)

```scheme
(claim <name> <type>)
```

声明一个定义的类型。

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

# 定义

## (define-function)

```scheme
(define-function <name>
  <block>
  ...)
```

定义可执行函数。

- 完整类型由同名 `(claim)` 提供。
- 第一个 block 是 entry block。
- 参数通过 `(argument :index N)` 获取。

```scheme
(claim add1 (-> int64-t int64-t))

(define-function add1
  (block body
    (= n (argument :index 0))
    (= one (int64 :content 1))
    (= result (iadd n one))
    (return result)))
```

## (define-variable)

```scheme
(define-variable <name>)        ;; 无初始化，或运行时初始化
(define-variable <name> <data>)  ;; 静态初始化
```

定义全局变量。

- 完整类型由同名 `(claim)` 提供。
- 带 `<data>` 时以数据描述数据段内存布局，静态初始化。

```scheme
(claim origin point-t)
(define-variable origin
  (struct point-t
    (x 0)
    (y 0)))

(claim buffer buffer-t)
(define-variable buffer)
```

## (define-struct)

```scheme
(define-struct <type-name>
  (<field-name> <type>)
  ...)
```

声明结构体类型及字段布局。

- `<type-name>` 的惯例是以 `-t` 结尾。
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

## (extern-function)

```scheme
(extern-function <name>)
```

声明外部函数。

- 完整类型由同名 `(claim)` 提供。
- 外部函数的实现在编译单元外部（如运行时原生函数、动态链接库等）。
- 仅在已存在同名 `(claim)` 时有效。

```scheme
(claim malloc (-> int64-t pointer-t))
(extern-function malloc)

(claim free (-> pointer-t void-t))
(extern-function free)
```

## (extern-variable)

```scheme
(extern-variable <name>)
```

声明外部变量。

- 完整类型由同名 `(claim)` 提供。
- 外部变量的实现在编译单元外部（如运行时提供的全局变量）。
- 仅在已存在同名 `(claim)` 时有效。

```scheme
(claim errno int64-t)
(extern-variable errno)
```

# 数据

数据用于 `(define-variable)`，描述变量所绑定的静态数据。

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

字符串字面量会被翻译为指针，
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
(struct <type-name>
  (<field> <data>)
  ...)
```

描述 struct 实例的内存布局。

例如：

```scheme
(define-variable origin
  (struct point-t
    (x 0)
    (y 0)))
```

## (pointer)

```scheme
(pointer <data>)
```

指向匿名数据的指针。

```scheme
(pointer
  (struct node-t
    (value 1)
    (next 0)))
```

## (array)

```scheme
(array <data> ...)
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
    (return result)))

(define-struct point-t
  (x int64-t)
  (y int64-t))

(claim origin point-t)
(define-variable origin
  (struct point-t
    (x 0)
    (y 0)))
```
