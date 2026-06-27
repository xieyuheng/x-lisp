---
title: 重新设计 basic-lisp
authors: [xieyuheng, deepseek-v4-pro]
date: 2026-06-25
---

2025-12-04 的 [critique of basic-lisp](./2025-12-04-critique-of-basic-lisp.md) 指出 basic-lisp 有三个核心问题：

1. 完全没有类型信息，而优化依赖类型
2. tag 处理未在 IR 中明显表示
3. 限制 operand 为 variable name 导致生成的代码难看

本次重新设计需要同时支持：

- 编译 meta-lisp 这样的动态类型语言（通过 `value-type` 和 tag 指令）
- 编译类似 C 的静态类型系统编程语言（通过具体类型和内存指令）

# 类型

```meta-lisp
(define-enum type-t
  (int64-type)
  (float64-type)
  (bool-type)
  (void-type)
  (pointer-type)
  (value-type)
  (named-type
    (name symbol-t))
  (struct-type
    (fields (hash-t symbol-t type-t)))
  (arrow-type
    (arg-types (list-t type-t))
    (ret-type type-t)))
```

- `int64-type` / `float64-type` / `bool-type` / `void-type`：原始标量类型。
- `pointer-type`：opaque pointer，不带元素类型。类型信息由 `load`/`store` 指令的 content-type 携带。
- `value-type`：tagged dynamic value。所有 meta-lisp 值统一用此类型。
- `named-type`：通过名称引用已定义的 struct 类型。仅用于使用位置（参数类型等），不用于定义位置。
- `struct-type`：在 `struct-definition` 中定义的结构体字段布局。字段列表为 `((field-name . type) ...)`。名称由 `struct-definition` 层面的 `name` 字段承载。
- `arrow-type`：描述函数签名，文本语法为 `(-> <arg-type> ... <ret-type>)`——最后一个为 `ret-type`，之前所有为 `arg-types`，无需额外括号包裹参数列表。例如 `(-> int64-t)` 为零参、`(-> pointer-t int64-t)` 为一参、`(-> float64-t float64-t float64-t)` 为二参。用于 `claim` 和 `knownBinaryOps`/`knownUnaryOps` 表示指令签名。

parse 与 format 时使用常见名称：`int64-t`、`float64-t`、`bool-t`、`void-t`、`pointer-t`、`value-t`；struct 类型的引用直接用其名称（如 `point-t`）。

# Operand

```meta-lisp
(define-enum operand-t
  (var-operand
    (name symbol-t))
  (int64-operand
    (value int-t))
  (float64-operand
    (value float-t))
  (bool-operand
    (value bool-t))
  (void-operand)
  (address-operand
    (name symbol-t)))
```

- `var-operand`：SSA 变量引用。variable 通过定义点确定类型，operand 处不需要标记类型。
- `int64-operand` / `float64-operand` / `bool-operand`：字面量常量。
  - `int64-operand` / `float64-operand` 当前暂用 meta-lisp 的 `int-t` / `float-t` 承载字面量。但 meta-lisp 的 value 是 3-bit tag + 61-bit payload 的 tagged value：`int-t` 只有 61-bit 有符号范围，`float-t` 会截断 double 的低 3 个尾数位。自举编译 meta-lisp 时无额外精度损失（end-to-end 同受 tag 限制），但无法表达完整 64-bit 整数与精确 double。
  - 未来扩展为 opaque 任意精度表示（类似 JS 的 BigInt），以支持完整 64-bit 整数与精确 double（编译 C-like 静态类型语言所需）。
- `void-operand`：void 常量。仅用于 `return` 指令返回 void。
- `address-operand`：顶层符号的地址，类型为 `pointer-type`。查符号表确定语义——若是 `function-definition` 则可用于 `call` / `tail-call`；若是 `variable-definition` 则可用于 `load` / `store` / `padd`。

# Attribute

```meta-lisp
(define-enum attribute-t
  (type-attribute (value type-t))
  (symbol-attribute (value symbol-t))
  (int-attribute (value int-t))
  (list-attribute (elements (list-t attribute-t))))
```

`attribute` 用于存放指令的编译时常量参数——类型引用、符号名、整数值、及其列表。与 `operand`（运行时值）分离，均通过统一的 `instr-t` 结构携带。

# Instruction

```meta-lisp
(define-struct instr-t
  (id symbol-t)
  (type type-t)
  (op symbol-t)
  (operands (list-t operand-t))
  (attributes (hash-t symbol-t attribute-t)))
```

所有指令统一为一种结构，按 `op` 区分操作：

- **`id`**：每条指令的唯一标识。产生值的指令 `id` 即结果变量名；不产生值的指令 `id` 由编译器生成为 `%<N>`（`%1`、`%2`、...）。
- **`type`**：本指令的结果类型。产生值的指令为具体类型（如 `int64-t`、`value-t`）；不产生值的指令为 `void-t`。
- **`op`**：操作名。
- **`operands`**：运行时值——所有 SSA 变量引用和字面量。统一遍历分析 use-def。
- **`attributes`**：编译时常量，由 `:key` 前缀标识，值类型为 `attribute-t`。

## 统一语法

```
(= <id> <type> (<op> <operand> ...) :<key> <attribute> ...)
```

`(<op> <operand> ...)` 只含运行时值。`:<key> <attribute> ...` 只含编译时常量，以 `:` 前缀的 key 区分。

## 各 op 的 operands 与 attributes 约定

| op | operands | attributes |
|----|----------|-----------|
| `iadd` `isub` `imul` `idiv` `fadd` `fsub` `fmul` `fdiv` `shl` `shr` `bitand` `bitor` `bitxor` `padd` `and` `or` `xor` | [left, right] | — |
| `icmp-eq` `icmp-ne` `icmp-lt` `icmp-le` `icmp-gt` `icmp-ge` `fcmp-eq` `fcmp-ne` `fcmp-lt` `fcmp-le` `fcmp-gt` `fcmp-ge` `bool-eq` `bool-ne` `pointer-eq` `pointer-ne` `value-eq` `value-ne` | [left, right] | — |
| `not` `tag-int` `tag-float` `tag-bool` `to-int64` `to-float64` `to-bool` `const` | [operand] | — |
| `load` | [pointer] | — |
| `call` | [target, ...args] | — |
| `apply` | [target, ...args] | — |
| `size-of` | [] | `:target-type <type>` |
| `offset-of` | [] | `:struct-type <type> :path (<field> ...)` |
| `argument` | [] | `:index <int>` |
| `use` | [] | — |
| `store` | [pointer, value] | `:content-type <type>` |
| `provide` | [value] | `:content-type <type> :use-site <name>` |
| `return` | [value] | — |
| `goto` | [] | `:label <name>` |
| `branch` | [condition] | `:then-label <name> :else-label <name>` |
| `tail-call` | [target, ...args] | — |
| `tail-apply` | [target, ...args] | — |
| `unreachable` | [] | — |

## Binary op 列表

| 类别           | 类型    | op name                                                   |
|----------------|---------|-----------------------------------------------------------|
| 算术           | int64   | `iadd` `isub` `imul` `idiv`                                |
| 算术           | float64 | `fadd` `fsub` `fmul` `fdiv`                                |
| 位运算         | int64   | `shl` `shr` `bitand` `bitor` `bitxor`                      |
| 指针运算       | pointer | `padd`                                                     |
| 逻辑           | bool    | `and` `or` `xor`                                           |
| 比较（可排序） | int64   | `icmp-eq` `icmp-ne` `icmp-lt` `icmp-le` `icmp-gt` `icmp-ge` |
| 比较（可排序） | float64 | `fcmp-eq` `fcmp-ne` `fcmp-lt` `fcmp-le` `fcmp-gt` `fcmp-ge` |
| 比较（仅判等） | bool    | `bool-eq` `bool-ne`                                        |
| 比较（仅判等） | pointer | `pointer-eq` `pointer-ne`                                  |
| 比较（仅判等） | value   | `value-eq` `value-ne`                                      |

## Unary op 列表

| 类别     | op name                          |
|----------|----------------------------------|
| 逻辑     | `not`                            |
| Tag 包装 | `tag-int` `tag-float` `tag-bool` |
| Tag 解构 | `to-int64` `to-float64` `to-bool` |
| 绑定     | `const`                          |

## 说明

- **比较按「类型的比较能力」分类**：每个比较 op 的 operand 类型由 op 名前缀唯一确定（`icmp-*`→int64、`fcmp-*`→float64、`bool-*`→bool、`pointer-*`→pointer、`value-*`→value），结果 type 恒为 `bool-t`。
  - `cmp` 隐含有序比较（含 `lt` / `le` / `gt` / `ge`），只给可排序的 int64 / float64；bool / pointer / value 无有序语义、只有相等性，故用 `-eq` / `-ne` 而不叫 cmp。
  - `value-eq` / `value-ne` 是 value 的 **identity 相等**（tagged 机器字相等，即 meta-lisp 的 `eq?`）；结构相等 `equal?` 是基于它的库函数，不是基础指令。
- **`type` 字段**：表示本指令结果（SSA 变量）的类型。算术 / 位运算 / 逻辑 op 的 type 等于 operand 类型；比较 op 的 type 恒为 `bool-t`；terminator 类指令的 type 恒为 `void-t`。
- `tag-int` / `tag-float` / `tag-bool`：将原始类型值包装为 `value-type`。
- `to-int64` / `to-float64` / `to-bool`：从 `value-type` 中解构原始类型值（运行时类型检查）。
- `const`：将 operand 绑定到 SSA 名字。`(= p pointer-t (const (address origin)))`。codegen 不为 `const` 生成代码。
- `load`：从 `pointer` 指向的地址加载值。opaque pointer 不带元素类型，type 不可省。
- `store`：将 `value` 写入 `pointer` 指向的地址。`content-type` 为被存储值的类型。本指令 type 为 `void-t`。
- `call`：静态调用，`target` 为 `(address f)` 或 SSA var。
- `apply`：动态调用 `value-type` 中的函数 / 闭包，`target` 为 SSA var。
- `padd`：指针的字节偏移加法。`base` 为 `pointer-type`，`offset` 为 `int64-t`，结果为 `pointer-type`。等价于 `base + offset` 字节。
- `size-of`：计算 `target-type` 的字节大小。type 为 `int64-t`。编译时常量。
- `offset-of`：沿 `struct-type` 的字段路径 `path` 逐级计算累积字节偏移。type 为 `int64-t`。编译时常量。
- `argument`：获取函数的第 `index` 个参数（从 0 开始）。type 为参数类型。
- `use`：从合并点读取值。type 为合并点的值类型。dest 名即合并点名。
- `provide`：向合并点 `use-site` 写入 `value`。`content-type` 为被写入值的类型。本指令 type 为 `void-t`。
- `return`：函数返回 `value`。type 为 `void-t`。
- `goto`：无条件跳转到 label。type 为 `void-t`。
- `branch`：若 `condition` 为真跳转到 `then-label`，否则跳转到 `else-label`。`condition` 必须为 `bool-t`。type 为 `void-t`。
- `tail-call` / `tail-apply`：尾调用 / 尾动态调用。type 为 `void-t`。
- `unreachable`：不可达路径标记。type 为 `void-t`。

# Block

```meta-lisp
(define-struct block-t
  (label symbol-t)
  (instrs (list-t instr-t)))
```

- `label`：block 名称，跳转目标。
- `instrs`：指令序列。最后一条指令必须为 terminator 类指令（`return` / `goto` / `branch` / `tail-call` / `tail-apply` / `unreachable`）。

# Claim

```meta-lisp
(define-struct claim-t
  (name symbol-t)
  (type type-t))
```

`claim` 声明一个名字的类型签名。函数用 `(-> ...)` arrow-type：`(claim add-or-sub (-> value-t value-t value-t value-t))`。变量用具体类型：`(claim origin point-t)`。存储于 `mod-t` 的 `claims` 中，不在 `definitions` 中。

# Definition

```meta-lisp
(define-enum definition-t
  (struct-definition
    (name symbol-t)
    (fields (hash-t symbol-t type-t)))
  (function-definition
    (name symbol-t)
    (blocks (list-t block-t)))
  (variable-definition
    (name symbol-t)
    (init (maybe-t operand-t))))
```

- `struct-definition`：声明结构体类型及字段布局。
- `function-definition`：
  - 完整类型由同名 `claim` 提供。
  - `blocks` 的第一个 block 是 entry block。参数通过 `(argument :index N)` 获取。
- `variable-definition`：
  - 完整类型由同名 `claim` 提供。
  - `init` 为 `(just operand)` 时，静态初始化为该 operand 的值。
  - `init` 为 `nothing` 时，等价于 BSS 段的未初始化变量。

不再有 `define-test`——test 信息由 meta-lisp 前端编码为 `function-definition`（零参数，返回 `bool-t`）。

# Module

```meta-lisp
(define-struct mod-t
  (definitions (hash-t symbol-t definition-t))
  (claims (hash-t symbol-t type-t)))
```

# 语法示例

## 示例 1：编译 meta-lisp（动态类型）

源程序：

```meta-lisp
(define (add-or-sub flag a b)
  (if flag (iadd a b) (isub a b)))
```

basic-lisp IR 文本形式：

```meta-lisp
(claim add-or-sub (-> value-t value-t value-t value-t))

(define-function add-or-sub
  (block body
    (= flag value-t (argument) :index 0)
    (= a value-t (argument) :index 1)
    (= b value-t (argument) :index 2)
    (= raw-a int64-t (to-int64 a))
    (= raw-b int64-t (to-int64 b))
    (= cond bool-t (to-bool flag))
    (= %1 void-t (branch cond) :then-label then :else-label else))

  (block then
    (= sum int64-t (iadd raw-a raw-b))
    (= result value-t (tag-int sum))
    (= %2 void-t (provide result) :content-type value-t :use-site result)
    (= %3 void-t (goto) :label merge))

  (block else
    (= diff int64-t (isub raw-a raw-b))
    (= result value-t (tag-int diff))
    (= %4 void-t (provide result) :content-type value-t :use-site result)
    (= %5 void-t (goto) :label merge))

  (block merge
    (= result value-t (use))
    (= %6 void-t (return result))))
```

## 示例 2：编译 C-like 语言（静态类型）

C 程序：

```c
long add_or_sub(int flag, long a, long b) {
    if (flag) return a + b;
    else return a - b;
}
```

IR 文本形式：

```meta-lisp
(claim add-or-sub (-> bool-t int64-t int64-t int64-t))

(define-function add-or-sub
  (block body
    (= flag bool-t (argument) :index 0)
    (= a int64-t (argument) :index 1)
    (= b int64-t (argument) :index 2)
    (= %1 void-t (branch flag) :then-label then :else-label else))

  (block then
    (= sum int64-t (iadd a b))
    (= %2 void-t (return sum)))

  (block else
    (= diff int64-t (isub a b))
    (= %3 void-t (return diff))))
```

## 示例 3：全局变量与结构体

```meta-lisp
(define-struct point-t (x int64-t) (y int64-t))

(claim origin point-t)
(define-variable origin)

(claim set-origin (-> void-t))

(define-function set-origin
  (block body
    (= x-offset int64-t (offset-of) :struct-type point-t :path (x))
    (= x-pointer pointer-t (padd (address origin) x-offset))
    (= %1 void-t (store x-pointer (int64 0)) :content-type int64-t)
    (= y-offset int64-t (offset-of) :struct-type point-t :path (y))
    (= y-pointer pointer-t (padd (address origin) y-offset))
    (= %2 void-t (store y-pointer (int64 0)) :content-type int64-t)
    (= %3 void-t (return (void)))))

(claim printf (-> pointer-t int64-t))
```

## 示例 4：比较指令

int64 有序比较（`icmp-*`），结果为 `bool-t`：

```meta-lisp
(claim sign (-> int64-t int64-t))

(define-function sign
  (block body
    (= n int64-t (argument) :index 0)
    (= neg bool-t (icmp-lt n (int64 0)))
    (= %1 void-t (branch neg) :then-label negative :else-label non-negative))

  (block negative
    (= %2 void-t (return (int64 -1))))

  (block non-negative
    (= pos bool-t (icmp-gt n (int64 0)))
    (= %3 void-t (branch pos) :then-label positive :else-label zero))

  (block positive
    (= %4 void-t (return (int64 1))))

  (block zero
    (= %5 void-t (return (int64 0)))))
```

动态值的 identity 判等用 `value-eq` / `value-ne`（仅判等，无有序比较）：

```meta-lisp
(= same bool-t (value-eq x y))
```

# 与旧设计的对比

- **类型系统**
  - 旧：无。
  - 新：`type-t` ADT（9 个 variant）。

- **Operand**
  - 旧：嵌套 `exp-t`（含 `ApplyExp`）。
  - 新：`operand-t` 平面枚举（var / literal / address）。

- **Attribute**
  - 旧：无。
  - 新：`attribute-t`（4 个 variant），存放编译时常量。与 operand 分离。

- **指令结构**
  - 旧：6 个 variant，含 Test+Branch 隐式配对。
  - 新：统一 `instr-t` struct，按 `op` + `attributes` 区分 16 种操作（含 terminator 类指令）。全部采用 `(= id type (op operands...) :key attr ...)` 统一语法。

- **比较**
  - 旧：隐含在指令中，未类型化。
  - 新：`binary-instr` 的 op（`icmp-*` / `fcmp-*` / `bool-eq` / `bool-ne` / `pointer-eq` / `pointer-ne` / `value-eq` / `value-ne`）；按类型的比较能力分类。

- **控制流**
  - 旧：`TestInstr` + `BranchInstr` 配对，`GotoInstr` / `ReturnInstr`。
  - 新：`goto` / `branch` / `return` / `tail-call` / `tail-apply` / `unreachable` 作为 terminator 类指令，block 最后一条。

- **Block**
  - 旧：`{ label, instrs }`，无 parameters。
  - 新：`{ label, instrs }`，合并点通过 `provide` / `use` 指令实现。

- **函数入口**
  - 旧：参数列表 + blocks。
  - 新：`(argument :index N)` 指令。

- **Tag 处理**
  - 旧：不透明，所有值必须为 tagged value。
  - 新：显式指令 `tag-int` / `tag-float` / `tag-bool` / `to-int64` / `to-float64` / `to-bool`。

- **全局变量**
  - 旧：`VariableDefinition` with blocks（运行时初始化）。
  - 新：`VariableDefinition` with static init operand（对齐 LLVM），运行时初始化通过 init function。

- **Struct**
  - 旧：无。
  - 新：`define-struct` + `size-of` / `offset-of` / `padd`。

- **内存操作**
  - 旧：无。
  - 新：`load` / `store`（`store` 不产生值，type 为 `void-t`）。

- **声明机制**
  - 旧：`PrimitiveFunctionDeclaration`（仅 arity）、`PrimitiveVariableDeclaration`、`function-declaration`、`variable-declaration`。
  - 新：统一 `claim`（`claim name type`），存储于 `mod.claims`。

- **测试**
  - 旧：`TestDefinition`（独立的定义种类）。
  - 新：由 meta-lisp 前端编码为 `function-definition`。
