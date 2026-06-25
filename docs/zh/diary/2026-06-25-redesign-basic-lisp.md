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
    (fields (list-t (pair-t symbol-t type-t))))
  (function-type
    (arg-types (list-t type-t))
    (ret-type type-t)))
```

- `int64-type` / `float64-type` / `bool-type` / `void-type`：原始标量类型。
- `pointer-type`：opaque pointer，不带元素类型。类型信息由 `load`/`store` 指令的 dest/value 字段携带。
- `value-type`：tagged dynamic value。所有 meta-lisp 值统一用此类型。
- `named-type`：通过名称引用已定义的 struct 类型。仅用于使用位置（参数类型等），不用于定义位置。
- `struct-type`：在 `struct-definition` 中定义的结构体字段布局。字段列表为 `((field-name . type) ...)`。名称由 `struct-definition` 层面的 `name` 字段承载。
- `function-type`：仅用于 `function-declaration` 描述函数签名，不出现在值的类型标注中。

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
  (undefined-operand)
  (function-operand
    (name symbol-t))
  (global-operand
    (name symbol-t)))
```

- `var-operand`：SSA 变量引用。variable 通过定义点确定类型，operand 处不需要标记类型。
- `int64-operand` / `float64-operand` / `bool-operand`：字面量常量。
  - `int64-operand` / `float64-operand` 当前暂用 meta-lisp 的 `int-t` / `float-t` 承载字面量。但 meta-lisp 的 value 是 3-bit tag + 61-bit payload 的 tagged value：`int-t` 只有 61-bit 有符号范围，`float-t` 会截断 double 的低 3 个尾数位。自举编译 meta-lisp 时无额外精度损失（end-to-end 同受 tag 限制），但无法表达完整 64-bit 整数与精确 double。
  - 未来扩展为 opaque 任意精度表示（类似 JS 的 BigInt），以支持完整 64-bit 整数与精确 double（编译 C-like 静态类型语言所需）。
- `void-operand` / `undefined-operand`：void 常量和未定义值。
  - `undefined-operand` 仅用于 `variable-definition` 的 `init` 字段，表达 BSS 语义。
- `function-operand`：顶层函数符号引用。出现在 `call` / `tail-call-terminator` 的 target 位置。
- `global-operand`：顶层全局变量符号引用。语义上等价于该变量的地址（`pointer-type`）。

# Instruction

```meta-lisp
(define-enum instr-t
  (binary-instr
    (dest symbol-t)
    (type type-t)
    (op symbol-t)
    (left operand-t)
    (right operand-t))
  (unary-instr
    (dest symbol-t)
    (type type-t)
    (op symbol-t)
    (operand operand-t))
  (load-instr
    (dest symbol-t)
    (type type-t)
    (pointer operand-t))
  (store-instr
    (type type-t)
    (pointer operand-t)
    (value operand-t))
  (call-instr
    (dest symbol-t)
    (type type-t)
    (target operand-t)
    (operands (list-t operand-t)))
  (apply-instr
    (dest symbol-t)
    (type type-t)
    (target operand-t)
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

指令按 **shape（字段形状）** 分组：形状相同的二元 / 一元运算分别归入 `binary-instr` / `unary-instr`，用 `op` 区分具体运算，避免 variant 爆炸；形状不同的（load / store / call / apply / 地址 / 分配）各自独立成 variant。

`binary-instr` 的 `op`：

| 类别           | 类型    | op name                                                   |
|----------------|---------|-----------------------------------------------------------|
| 算术           | int64   | `iadd` `isub` `imul` `idiv`                                |
| 算术           | float64 | `fadd` `fsub` `fmul` `fdiv`                                |
| 位运算         | int64   | `shl` `shr` `bitand` `bitor` `bitxor`                      |
| 逻辑           | bool    | `and` `or` `xor`                                           |
| 比较（可排序） | int64   | `icmp-eq` `icmp-ne` `icmp-lt` `icmp-le` `icmp-gt` `icmp-ge` |
| 比较（可排序） | float64 | `fcmp-eq` `fcmp-ne` `fcmp-lt` `fcmp-le` `fcmp-gt` `fcmp-ge` |
| 比较（仅判等） | bool    | `bool-eq` `bool-ne`                                        |
| 比较（仅判等） | pointer | `pointer-eq` `pointer-ne`                                  |
| 比较（仅判等） | value   | `value-eq` `value-ne`                                      |

`unary-instr` 的 `op`：

| 类别     | op name                          |
|----------|----------------------------------|
| 逻辑     | `not`                            |
| Tag 包装 | `tag-int` `tag-float` `tag-bool` |
| Tag 解构 | `to-int64` `to-float64` `to-bool` |
| 绑定     | `const`                          |

说明：

- **比较按「类型的比较能力」分类，全部是 `binary-instr` 的 op，类型零融合**：每个比较 op 的 operand 类型由 op 名前缀唯一确定（`icmp-*`→int64、`fcmp-*`→float64、`bool-*`→bool、`pointer-*`→pointer、`value-*`→value），结果 dest 恒为 bool。
  - `cmp` 隐含有序比较（含 `lt` / `le` / `gt` / `ge`），只给可排序的 int64 / float64；bool / pointer / value 无有序语义、只有相等性，故用 `-eq` / `-ne` 而不叫 cmp。
  - 类型检查无需任何文档约定：每个 op 的 operand 类型单一，不同类型的判等是不同 op。
  - codegen 一一映射机器模式：`icmp-*`→`cmp + setcc`、`fcmp-*`→`ucomisd + setcc`、`bool-` / `pointer-` / `value-eq` / `value-ne`→机器字 `cmp + sete / setne`（三者机器码相同，可共享 emit）。
  - `value-eq` / `value-ne` 是 value 的 **identity 相等**（tagged 机器字相等，即 meta-lisp 的 `eq?`）；结构相等 `equal?` 是基于它的库函数，不是基础指令。
  - 注：int 有序比较的 cc 当前默认有符号语义；未来编译 C-like 语言时再扩展无符号 cc 变体，现在不过度设计。
- **`type` 字段表示 dest（SSA 变量）的类型**。算术 / 位运算 / 逻辑 op 的 dest 类型等于 operand 类型；比较 op 的 dest 类型恒为 bool。该字段虽与 op 名编码的类型冗余，但使每个 SSA 变量的类型可直接读取，并能与 op 前缀交叉校验。
- `tag-int` / `tag-float` / `tag-bool`：将原始类型值包装为 `value-type`。
- `to-int64` / `to-float64` / `to-bool`：从 `value-type` 中解构原始类型值（运行时类型检查）。
- `const`：将 operand 绑定到 SSA 名字。`(= p pointer-t (const (global origin)))`。codegen 不为 `const` 生成代码。
- `load-instr`：从 `pointer` 指向的地址加载 `type` 类型的值。opaque pointer 不带元素类型，故 `type` 不可省。
- `store-instr`：将 `value` 写入 `pointer` 指向的地址，`type` 为被存储值的类型。**`store-instr` 不产生值，故无 dest**。
- `call-instr`：静态调用，`target` 为 `(function-operand f)` 或 SSA var（间接调用）。
- `apply-instr`：动态调用 `value-type` 中的函数 / 闭包，`target` 为 SSA var。

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
    (= x-pointer pointer-t (field-address point-t (global origin) x))
    (store int64-t x-pointer (int64 0))
    (= y-pointer pointer-t (field-address point-t (global origin) y))
    (store int64-t y-pointer (int64 0))
    (return (void))))

(declare-function printf (-> pointer-t int64-t))
```

## 示例 4：比较指令

int64 有序比较（`icmp-*`），结果为 `bool-t`：

```meta-lisp
(define-function sign int64-t
  (block (body (n int64-t))
    (= neg bool-t (icmp-lt n (int64 0)))
    (branch neg (label negative) (label non-negative)))

  (block negative
    (return (int64 -1)))

  (block non-negative
    (= pos bool-t (icmp-gt n (int64 0)))
    (branch pos (label positive) (label zero)))

  (block positive
    (return (int64 1)))

  (block zero
    (return (int64 0))))
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
  - 新：`operand-t` 平面枚举（var / literal / function / global）。

- **指令结构**
  - 旧：6 个 variant，含 Test+Branch 隐式配对。
  - 新：按 shape 分组的 10 个 instr variant（`binary-instr` / `unary-instr` / `load-instr` / `store-instr` / `call-instr` / `apply-instr` + `field-address-instr` / `element-address-instr` / `stack-allocate-instr` / `heap-allocate-instr`），terminator 独立。

- **比较**
  - 旧：隐含在指令中，未类型化。
  - 新：类型化为 `binary-instr` 的 op（`icmp-*` / `fcmp-*` / `bool-eq` / `bool-ne` / `pointer-eq` / `pointer-ne` / `value-eq` / `value-ne`）；按类型的比较能力分类，类型零融合，`cmp`（有序比较）仅用于可排序的 int64 / float64。

- **控制流**
  - 旧：`TestInstr` + `BranchInstr` 配对，`GotoInstr` / `ReturnInstr`。
  - 新：`branch-terminator`（合并 test+branch）+ `goto-terminator` + `return-terminator` + `tail-call-terminator` + `tail-apply-terminator`。

- **Block**
  - 旧：`{ label, instrs }`，无 parameters。
  - 新：`{ label, parameters, instrs, terminator }`——block parameters 消除 phi。

- **函数入口**
  - 旧：参数列表 + blocks（隐式从外层作用域引入）。
  - 新：entry block 的 parameters 即函数参数。

- **Tag 处理**
  - 旧：不透明，所有值必须为 tagged value。
  - 新：显式指令 `tag-int` / `tag-float` / `tag-bool` / `to-int64` / `to-float64` / `to-bool`。

- **全局变量**
  - 旧：`VariableDefinition` with blocks（运行时初始化）。
  - 新：`VariableDefinition` with static init operand（对齐 LLVM），运行时初始化通过 init function。

- **Struct**
  - 旧：无。
  - 新：`define-struct` + `field-address-instr` / `element-address-instr`。

- **内存操作**
  - 旧：无。
  - 新：`stack-allocate-instr` / `heap-allocate-instr` / `load-instr` / `store-instr`（`store-instr` 不产生值，无 dest）。

- **函数声明**
  - 旧：`PrimitiveFunctionDeclaration`（仅 arity）。
  - 新：`function-declaration`（完整类型签名 `function-type`）。

- **变量声明**
  - 旧：`PrimitiveVariableDeclaration`。
  - 新：`variable-declaration` + `variable-definition`。

- **测试**
  - 旧：`TestDefinition`（独立的定义种类）。
  - 新：由 meta-lisp 前端编码为 `function-definition`。
