---
title: 语法
---

# 前言

basic-lisp 是 meta-lisp 编译器的**底层中间表示**（IR），使用**符号表达式**（S-expression）语法。

它同时支持两种编译目标：

- 编译 **meta-lisp** 这样的动态类型语言 -- 通过 `value-type` 和 tag 指令
- 编译类似 **C** 的静态类型语言 -- 通过具体类型和内存指令

模块顶层由**定义**（definition）和**声明**（claim）组成。
函数由**基本块**（block）组成，基本块由**指令**（instr）组成。

下面分组介绍 basic-lisp IR 的所有语法。

# 目录

- [前言](#前言)
- [目录](#目录)
- [类型](#类型)
  - [基本类型](#基本类型)
  - [结构体类型](#结构体类型)
  - [函数类型](#函数类型)
- [操作数](#操作数)
- [属性](#属性)
- [指令](#指令)
  - [统一语法](#统一语法)
  - [二元运算](#二元运算)
  - [比较指令](#比较指令)
  - [一元运算](#一元运算)
  - [内存操作](#内存操作)
  - [控制流](#控制流)
  - [函数调用](#函数调用)
  - [动态值操作](#动态值操作)
- [基本块](#基本块)
- [声明](#声明)
  - [(claim)](#claim)
- [定义](#定义)
  - [(define-function)](#define-function)
  - [(define-variable)](#define-variable)
  - [(define-struct)](#define-struct)
- [数据表达式](#数据表达式)
  - [(int)](#int)
  - [(float)](#float)
  - [(string)](#string)
  - [(struct)](#struct)
  - [(pointer)](#pointer)
  - [(array)](#array)
  - [(address)](#address)
- [模块](#模块)

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

最后一个为 `ret-type`，之前所有为 `arg-types`。

例如：

```scheme
(-> int64-t)
(-> pointer-t int64-t)
(-> float64-t float64-t float64-t)
(-> value-t value-t value-t value-t)
```

用于 `(claim)` 声明函数的类型签名。

# 操作数

操作数是指令的运行时值。

除了 SSA 变量之外，所有操作数的语法都是带有 tag 的 sexp。

| 操作数       | 例子               |
|--------------|--------------------|
| SSA 变量     | `x` `x.1`          |
| 64 位整数    | `(int64 42)`       |
| 64 位浮点数  | `(float64 3.14)`   |
| 布尔值       | `(bool true)`      |
| 空值         | `(void)`           |
| 顶层符号地址 | `(address origin)` |

- SSA 变量通过定义点确定类型，操作数处不需要标记类型。
- `address` 类型为 `pointer-t`。
  查符号表确定语义 -- 若是函数定义则可用于 `call` / `tail-call`；
  若是变量定义则可用于 `load` / `store` / `padd`。
- `(void)` 仅用于 `return` 指令返回 void。

# 属性

每个指令可以通过 `:<key> <attribute>` 语法带有任意多个属性。

属性 `<attribute>` 是编译时信息，与 `operand`（运行时值）分离。

| 属性 | 语法      | 说明     |
|------|-----------|----------|
| 类型 | `int64-t` | 类型引用 |
| 符号 | `foo`     | 符号名   |
| 整数 | `42`      | 整数值   |
| 列表 | `(x y)`   | 属性列表 |

注意：

- 作为属性的整数直接使用 atom sexp 语法 -- `42`，
  与作为操作数的整数不同 -- `(int64 42)`。

# 指令

## 统一语法

所有指令统一为一种结构：

```
(= <id> <type> (<op> <operand> ...) :<key> <attribute> ...)
```

- `<id>`：指令的唯一标识。产生值的指令 `id` 即结果变量名；
  不产生值的指令也有 `id`，例如 `∅.1`、`∅.2`。
- `<type>`：本指令的结果类型。
  产生值的指令为具体类型，例如 `int64-t`、`value-t`；
  不产生值的指令为 `void-t`。
- `<op>`：操作名 -- 代表了指令的种类。
- `<operand>`：操作数 -- 运行时值，用于分析 def-use 关系。
- `:<key> <attribute>`：属性常量，以 `:` 前缀的 key 区分。
  不同操作名的指令，决定了所带有的属性的意义。

```scheme
(= sum int64-t (iadd a b))
(= ∅.1 void-t (branch cond) :then-label then :else-label else)
```

## 二元运算

| op                                    | 返回值类型 | 说明             |
|---------------------------------------|------------|------------------|
| `iadd` `isub` `imul` `idiv`           | int64      | 整数算术         |
| `fadd` `fsub` `fmul` `fdiv`           | float64    | 浮点算术         |
| `shl` `shr` `bitand` `bitor` `bitxor` | int64      | 位运算           |
| `padd`                                | pointer    | 指针字节偏移加法 |
| `and` `or` `xor`                      | bool       | 逻辑运算         |

- 算术/位运算/逻辑运算的 `type` 字段等于 operand 类型。
- 其中 `padd` 的 `base` 类型为 `pointer-t`，`offset` 类型为 `int64-t`，
  结果为 `base + offset` 类型 `pointer-t`。

```scheme
(= result int64-t (iadd x y))
(= result float64-t (fadd a b))
(= new-ptr pointer-t (padd base offset))
```

## 比较指令

比较指令的 operand 类型由 op 名前缀唯一确定，结果 `type` 恒为 `bool-t`。

| op                                                          | 说明                |
|-------------------------------------------------------------|---------------------|
| `icmp-eq` `icmp-ne` `icmp-lt` `icmp-le` `icmp-gt` `icmp-ge` | int64 有序比较      |
| `fcmp-eq` `fcmp-ne` `fcmp-lt` `fcmp-le` `fcmp-gt` `fcmp-ge` | float64 有序比较    |
| `bool-eq` `bool-ne`                                         | bool 相等性         |
| `pointer-eq` `pointer-ne`                                   | pointer 相等性      |
| `value-eq` `value-ne`                                       | value identity 相等 |

- `icmp-*` / `fcmp-*` 含有序比较（`lt` / `le` / `gt` / `ge`），只给可排序的 int64 / float64。
- `bool-*` / `pointer-*` / `value-*` 无有序语义，只有相等性。
- `value-eq` / `value-ne` 是 tagged 机器字相等（即 meta-lisp 的 `eq?`）；结构相等 `equal?` 是基于它的库函数，不是基础指令。

```scheme
(= neg bool-t (icmp-lt n (int64 0)))
(= same bool-t (value-eq x y))
```

## 一元运算

| op name      | 说明                     |
|--------------|--------------------------|
| `not`        | 逻辑取反                 |
| `tag-int`    | 将 int64 包装为 value    |
| `tag-float`  | 将 float64 包装为 value  |
| `tag-bool`   | 将 bool 包装为 value     |
| `to-int64`   | 从 value 解构 int64      |
| `to-float64` | 从 value 解构 float64    |
| `to-bool`    | 从 value 解构 bool       |
| `const`      | 将 operand 绑定到 SSA 名 |

- `tag-*`：将原始类型值包装为 `value-t`。
- `to-*`：从 `value-t` 中解构原始类型值（运行时类型检查）。

```scheme
(= tagged value-t (tag-int x))
(= raw int64-t (to-int64 tagged))
(= p pointer-t (const (address origin)))
```

## 内存操作

| op          | operands        | attributes                                | 说明             |
|-------------|-----------------|-------------------------------------------|------------------|
| `load`      | `pointer`       | 无                                        | 从指针加载值     |
| `store`     | `pointer value` | `:content-type <type>`                    | 将值写入指针     |
| `size-of`   | 无              | `:target-type <type>`                     | 计算类型字节大小 |
| `offset-of` | 无              | `:struct-type <type> :path (<field> ...)` | 计算字段偏移     |

- `load`：opaque pointer 不带元素类型，结果 `type` 即为值的类型。
- `store`：`content-type` 为被存储值的类型。本指令 type 为 `void-t`。
- `size-of`：编译时常量，type 为 `int64-t`。
- `offset-of`：沿 struct 字段路径逐级计算累积字节偏移。type 为 `int64-t`。编译时常量。

```scheme
(= value int64-t (load ptr))
(= ∅.1 void-t (store ptr value) :content-type int64-t)
(= size int64-t (size-of) :target-type point-t)
(= y-offset int64-t (offset-of) :struct-type point-t :path (y))
```

## 控制流

| op            | operands    | attributes                              | 说明           |
|---------------|-------------|-----------------------------------------|----------------|
| `return`      | `value`     | 无                                      | 函数返回       |
| `goto`        | 无          | `:label <name>`                         | 无条件跳转     |
| `branch`      | `condition` | `:then-label <name> :else-label <name>` | 条件分支       |
| `unreachable` | 无          | 无                                      | 不可达路径标记 |

- 所有控制流指令的 type 为 `void-t`。
- `branch` 的 `condition` 必须为 `bool-t`。
- 基本块的最后一条指令必须为 terminator 类指令（`return` / `goto` / `branch` / `tail-call` / `tail-apply` / `unreachable`）。

```scheme
(= ∅.1 void-t (branch cond) :then-label positive :else-label non-positive)
(= ∅.2 void-t (goto) :label merge)
(= ∅.3 void-t (return result))
```

## 函数调用

| op           | operands          | attributes     | 说明         |
|--------------|-------------------|----------------|--------------|
| `call`       | `target, ...args` | 无             | 静态调用     |
| `tail-call`  | `target, ...args` | 无             | 尾调用       |
| `apply`      | `target, ...args` | 无             | 动态调用     |
| `tail-apply` | `target, ...args` | 无             | 尾动态调用   |
| `argument`   | 无                | `:index <int>` | 获取函数参数 |

- `call`：`target` 为 `(address f)` 或 SSA var。
- `apply`：动态调用 `value-t` 中的函数/闭包，`target` 为 SSA var。
- `argument`：获取函数的第 `index` 个参数（从 0 开始）。type 为参数类型。

```scheme
(= result value-t (call (address add-or-sub) flag a b))
(= ∅.1 void-t (tail-call (address aux) x y))
(= a value-t (argument) :index 0)
```

## 动态值操作

| op        | operands  | attributes                              | 说明           |
|-----------|-----------|-----------------------------------------|----------------|
| `use`     | 无        | 无                                      | 从合并点读取值 |
| `provide` | `[value]` | `:content-type <type> :use-site <name>` | 向合并点写入值 |

- `use`：type 为合并点的值类型，结果变量名即合并点名。
- `provide`：`content-type` 为被写入值的类型。本指令 type 为 `void-t`。

```scheme
(= ∅.1 void-t (provide result) :content-type value-t :use-site result)
;; 在另一个基本块中：
(= result value-t (use))
```

# 基本块

基本块由标号和指令序列组成：

```
(= <label> (block
  <instr> ...))
```

- 第一个 block 是 entry block。
- `instrs` 的最后一条指令必须为 terminator 类指令。
- 函数参数通过 entry block 中的 `(argument :index N)` 获取。

```scheme
(block body
  (= a value-t (argument) :index 0)
  (= b value-t (argument) :index 1)
  (= sum value-t (call (address add) a b))
  (= ∅.1 void-t (return sum)))
```

# 声明

## (claim)

```scheme
(claim <name> <type>)
```

声明一个名字的类型签名。

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
    (= n int64-t (argument) :index 0)
    (= result int64-t (iadd n (int64 1)))
    (= ∅.1 void-t (return result))))
```

## (define-variable)

```scheme
(define-variable <name> <init>)
```

定义全局变量。

- 完整类型由同名 `claim` 提供。
- `<init>` 为数据表达式 `(exp)` 时，静态初始化为该数据段内容。
- `<init>` 为 `(nothing)` 时，等价于 BSS 段的未初始化变量。

```scheme
(claim origin point-t)
(define-variable origin (struct point-t (x (int 0)) (y (int 0))))

(claim buffer (struct-t buffer-t))
(define-variable buffer (nothing))
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

数据表达式用于 `define-variable` 的 `init` 字段，描述数据段内存布局。
它不是指令中的运行时值（`operand-t`），而是独立的数据类型。

## (int)

```scheme
(int <value>)
```

整数字面量。宽度由所在 struct 字段类型决定。

```scheme
(int 42)
(int 0)
(int -1)
```

## (float)

```scheme
(float <value>)
```

浮点数字面量。

```scheme
(float 3.14)
(float -2.5)
```

## (string)

```scheme
(string "<content>")
```

以 null-terminated bytes 存储的字符串。

```scheme
(string "hello")
(string "world")
```

## (struct)

```scheme
(struct <name> (<field> <exp>) ...)
```

引用已声明 struct 类型的字段布局，字段值递归为 `exp-t`。

`<name>` 必选。

```scheme
(define-variable origin
  (struct point-t
    (x (int 0))
    (y (int 0))))
```

## (pointer)

```scheme
(pointer <exp>)
```

指向内联数据的指针，数据序列化在指针之后。

```scheme
(pointer
  (struct node-t
    (value (int 1))
    (next (int 0))))
```

## (array)

```scheme
(array <exp> ...)
```

定长有序数组。

```scheme
(array (int 1) (int 2) (int 3))
(array
  (address ©str.0)
  (address ©str.1))
```

## (address)

```scheme
(address <name>)
```

对已定义符号的地址引用。

```scheme
(address origin)
(address ©str.0)
```

# 模块

模块是所有定义和声明的容器。

模块中，`definitions` 存储所有定义（struct / function / variable），`claims` 存储所有类型声明。

```scheme
(claim add1 (-> int64-t int64-t))
(define-function add1
  (block body
    (= n int64-t (argument) :index 0)
    (= result int64-t (iadd n (int64 1)))
    (= ∅.1 void-t (return result))))

(define-struct point-t
  (x int64-t)
  (y int64-t))

(claim origin point-t)
(define-variable origin (struct point-t (x (int 0)) (y (int 0))))
```
