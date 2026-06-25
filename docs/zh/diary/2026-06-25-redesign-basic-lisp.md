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
  (struct-type
    (fields (list-t (pair-t symbol-t type-t))))
  (function-type
    (arg-types (list-t type-t))
    (ret-type type-t)))
```

- `int64-type` / `float64-type` / `bool-type` / `void-type`：原始标量类型。
- `pointer-type`：opaque pointer，不带元素类型。类型信息由 `load`/`store` 指令的 dest/value 字段携带。
- `value-type`：tagged dynamic value。所有 meta-lisp 值统一用此类型。
- `struct-type`：通过 `define-struct` 定义的命名结构体。字段列表为 `((field-name . type) ...)`。
- `function-type`：仅用于 `function-declaration` 描述函数签名，不出现在值的类型标注中。

parse 与 format 时使用常见名称：`int64-t`、`float64-t`、`bool-t`、`void-t`、`pointer-t`、`value-t`。

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
  (undefined-operand)
  (function-operand
    (name symbol-t))
  (global-operand
    (name symbol-t)))
```

- `var-operand`：SSA 变量引用。variable 通过定义点确定类型，operand 处不需要标记类型。
- `int64-operand` / `float64-operand` / `bool-operand`：字面量常量。
- `void-operand` / `undefined-operand`：void 常量和未定义值。
  - `undefined-operand` 仅用于 `variable-definition` 的 `init` 字段，表达 BSS 语义。
- `function-operand`：顶层函数符号引用。出现在 `call` / `tail-call-terminator` 的 target 位置。
- `global-operand`：顶层全局变量符号引用。语义上等价于该变量的地址（`pointer-type`）。

# Instruction

```meta-lisp
(define-enum instr-t
  (value-instr
    (dest symbol-t)
    (type type-t)
    (op symbol-t)
    (operands (list-t operand-t)))
  (field-address-instr
    (dest symbol-t)
    (struct-type type-t)
    (base operand-t)
    (field symbol-t))
  (element-address-instr
    (dest symbol-t)
    (element-type type-t)
    (base operand-t)
    (index operand-t))
  (stack-allocate-instr
    (dest symbol-t)
    (struct-type type-t))
  (heap-allocate-instr
    (dest symbol-t)
    (struct-type type-t)))
```

`value-instr` 覆盖所有 `(op operand ...)` 形式的指令。`op` 包括：

| 类别     | op name                                           |
|----------|---------------------------------------------------|
| 算术     | `iadd` `isub` `imul` `idiv`                       |
|          | `fadd` `fsub` `fmul` `fdiv`                       |
| 比较     | `icmp-eq` `icmp-lt` `icmp-le` `icmp-gt` `icmp-ge` |
|          | `fcmp-eq` `fcmp-lt` `fcmp-le` `fcmp-gt` `fcmp-ge` |
| 位运算   | `shl` `shr` `bitand` `bitor` `bitxor`             |
| 逻辑     | `and` `or` `not`                                  |
| Tag 操作 | `tag-int` `tag-float` `tag-bool`                  |
|          | `to-int64` `to-float64` `to-bool`                 |
| 调用     | `call` `apply`                                    |
| 内存     | `load` `store`                                    |
| 其他     | `const`                                           |

说明：

- 比较指令（`icmp-*` / `fcmp-*`）的 condition code 内联在 op name 中。不需要像 x86 asm 那样分离 `cmp` + condition code——basic-lisp 是优化 IR，应当语义化。
- `icmp-eq` 也用于 pointer 和 function 的判等。
- `tag-int` / `tag-float` / `tag-bool`：将原始类型值包装为 `value-type`。
- `to-int64` / `to-float64` / `to-bool`：从 `value-type` 中解构原始类型值（运行时类型检查）。
- `call`：静态调用，target 为 `(function-operand f)` 或 SSA var（间接调用）。
- `apply`：动态调用 `value-type` 中的函数/闭包，target 为 SSA var。
- `const`：将 operand 绑定到 SSA 名字。`(= p pointer-type (const (global origin)))`。

`field-address-instr` / `element-address-instr` / `stack-allocate-instr` / `heap-allocate-instr` 为独立 variant——它们的 type 参数（`struct-type`、`element-type`）是类型名（编译时 immediate），不属于 operand 的运行时值范畴。`field` 符号同理。

# Terminator

每个 block 恰好以一个 terminator 结尾。

```meta-lisp
(define-enum terminator-t
  (return-terminator
    (value operand-t))
  (goto-terminator
    (target-label symbol-t)
    (args (list-t operand-t)))
  (branch-terminator
    (condition operand-t)
    (then-label symbol-t)
    (then-args (list-t operand-t))
    (else-label symbol-t)
    (else-args (list-t operand-t)))
  (tail-call-terminator
    (target operand-t)
    (operands (list-t operand-t)))
  (tail-apply-terminator
    (target operand-t)
    (operands (list-t operand-t)))
  (unreachable-terminator))
```

- `return-terminator`：函数返回。`value` 类型必须与函数的 `ret-type` 一致。
- `goto-terminator`：无条件跳转。`args` 传给目标 block 的 `parameters`。
- `branch-terminator`：条件跳转。`condition` 必须为 `bool-type` 的 operand。`then-args` / `else-args` 分别传给 `then-label` / `else-label` block 的 `parameters`。
- `tail-call-terminator`：尾调用，`target` 为 `(function-operand ...)` 或 SSA var。
- `tail-apply-terminator`：尾动态调用，`target` 为 `value-type` 的 SSA var。
- `unreachable-terminator`：不可达路径标记。

# Block

```meta-lisp
(define-struct block-t
  (label symbol-t)
  (parameters (list-t (pair-t symbol-t type-t)))
  (instrs (list-t instr-t))
  (terminator terminator-t))
```

- `label`：block 名称，跳转目标。
- `parameters`：入口参数列表 `((name type) ...)`。entry block 的 parameters 即函数签名。无参数时为空列表。
- `instrs`：非终止指令序列。可以为空。
- `terminator`：恰好一个终止指令。

# Definition

```meta-lisp
(define-enum definition-t
  (struct-definition
    (name symbol-t)
    (fields (list-t (pair-t symbol-t type-t))))
  (function-definition
    (name symbol-t)
    (ret-type type-t)
    (blocks (list-t block-t)))
  (function-declaration
    (name symbol-t)
    (type type-t))
  (variable-definition
    (name symbol-t)
    (type type-t)
    (init (maybe-t operand-t)))
  (variable-declaration
    (name symbol-t)
    (type type-t)))
```

- `struct-definition`：声明结构体类型及字段布局。
- `function-definition`：
  - `ret-type` 声明返回类型。
  - `blocks` 的第一个 block 是 entry block。entry block 的 `parameters` 即函数参数。
- `function-declaration`：无体的外部函数（如 builtin）。
- `variable-definition`：
  - `init` 为 `(just operand)` 时，静态初始化为该 operand 的值。
  - `init` 为 `nothing` 时，等价于 BSS 段的未初始化变量。
- `variable-declaration`：external 变量，定义在其他模块。

不再有 `define-test`——test 信息由 meta-lisp 前端编码为 `function-definition`（零参数，返回 `bool-type`）。

# Module

```meta-lisp
(define-struct mod-t
  (definitions (hash-t symbol-t definition-t)))
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
(define-function add-or-sub value-t
  (block (body (flag value-t) (a value-t) (b value-t))
    (= raw-a int64-t (to-int64 a))
    (= raw-b int64-t (to-int64 b))
    (= cond bool-t (to-bool flag))
    (branch cond (label then) (label else)))

  (block then
    (= sum int64-t (iadd raw-a raw-b))
    (= result value-t (tag-int sum))
    (goto (label merge result)))

  (block else
    (= diff int64-t (isub raw-a raw-b))
    (= result value-t (tag-int diff))
    (goto (label merge result)))

  (block (merge (x value-t))
    (return x)))
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
(define-function add-or-sub int64-t
  (block (body (flag bool-t) (a int64-t) (b int64-t))
    (branch flag (label then a b) (label else a b)))

  (block (then (x int64-t) (y int64-t))
    (= sum int64-t (iadd x y))
    (return sum))

  (block (else (x int64-t) (y int64-t))
    (= diff int64-t (isub x y))
    (return diff)))
```

## 示例 3：全局变量与结构体

```meta-lisp
(define-struct point-t
  (x int64-t)
  (y int64-t))

(define-variable origin point-t (undefined))

(define-function set-origin void-t
  (block (body)
    (= x-ptr pointer-t (field-address point-t (global origin) x))
    (store x-ptr (int64 0))
    (= y-ptr pointer-t (field-address point-t (global origin) y))
    (store y-ptr (int64 0))
    (return (void))))

(declare-function printf (-> pointer-t int64-t))
```

# 与旧设计的对比

| | 旧 basic-lisp | 新 basic-lisp |
|---|---|---|
| 类型系统 | 无 | `type-t` ADT（8 个 variant） |
| Operand | 嵌套 `exp-t`（含 `ApplyExp`） | `operand-t` 平面枚举（var / literal / function / global） |
| 指令结构 | 6 个 variant，含 Test+Branch 隐式配对 | 5 个 variant，terminator 独立 |
| 控制流 | `TestInstr` + `BranchInstr` 配对，`GotoInstr` / `ReturnInstr` | `branch-terminator`（合并 test+branch）+ `goto-terminator` + `return-terminator` + `tail-call-terminator` + `tail-apply-terminator` |
| Block | `{ label, instrs }`，无 parameters | `{ label, parameters, instrs, terminator }` — block parameters 消除 phi |
| 函数入口 | 参数列表 + blocks（隐式从外层作用域引入） | entry block 的 parameters 即函数参数 |
| Tag 处理 | 不透明：所有值必须为 tagged value | 显式指令：`tag-int` / `tag-float` / `tag-bool` / `to-int64` / `to-float64` / `to-bool` |
| 全局变量 | `VariableDefinition` with blocks（运行时初始化） | `VariableDefinition` with static init operand（对齐 LLVM），运行时初始化通过 init function |
| Struct | 无 | `define-struct` + `field-address-instr` / `element-address-instr` |
| 内存操作 | 无 | `stack-allocate-instr` / `heap-allocate-instr` / `load` / `store` |
| 函数声明 | `PrimitiveFunctionDeclaration`（仅 arity） | `function-declaration`（完整类型签名 `function-type`） |
| 变量声明 | `PrimitiveVariableDeclaration` | `variable-declaration` + `variable-definition` |
| 测试 | `TestDefinition`（独立的定义种类） | 由 meta-lisp 前端编码为 `function-definition` |
