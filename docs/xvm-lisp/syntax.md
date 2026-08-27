---
title: 语法
---

# 前言

xvm-lisp 是 xvm2 虚拟机的 Lisp 语法汇编语言。

特点：

- 寄存器机器 —— 函数的局部值存放于编号槽位中，汇编时把局部变量名映射为槽号。
- 槽位存放 tagged value（`value_t`）—— 值的类型由自身的 tag 携带，
  指令按语义要求操作数的 tag（如 `iadd` 要求 int、`fadd` 要求 float）。
- 指令采用 Intel 操作数顺序 —— 目标操作数在前，源操作数在后。
- 所有 operand 在语法上完全区分：**裸符号只用于局部变量**，
  定义引用（函数 / primitive / 全局变量）与跳转目标都带 tag，
  字面量中 `symbol` 用 quote 前缀 `'`，以免与局部变量混淆。

概念层级：

- definition
  - code-definition
    - instr
      - operand

下面分组介绍 xvm-lisp 的所有语法。

# 目录

- [前言](#前言)
- [目录](#目录)
- [注释](#注释)
- [指令](#指令)
- [标签](#标签)
- [顶层定义](#顶层定义)
  - [(define-function)](#define-function)
  - [(define-variable)](#define-variable)
  - [(define-test)](#define-test)
  - [(declare-primitive-function)](#declare-primitive-function)
  - [(declare-primitive-variable)](#declare-primitive-variable)
  - [(default-entry)](#default-entry)
- [操作数](#操作数)
  - [局部变量](#局部变量)
  - [(fn)](#fn)
  - [(prim)](#prim)
  - [(global)](#global)
  - [(label)](#label)
  - [字面量](#字面量)
- [汇编与槽位分配](#汇编与槽位分配)

# 注释

xvm-lisp 使用 Lisp 风格的行注释，以 `;` 开头直到行尾。通常写两个分号 `;;`。

```scheme
;; 这是一条注释
(load x 42)  ;; 行尾注释
```

# 指令

```scheme
(<op> <operand> ...)
```

所有指令统一为 op + operands。
采用 Intel 的操作数顺序，目标操作数在前，源操作数在后。

- 有输出结果的指令，第一个 operand 是 `<dest>`；结果写入由 `<dest>` 命名的槽。
- 函数调用（`call-n` / `call-prim-n` / `apply-n`）不使用 `<dest>` ——
  结果进入返回寄存器，需要时用 `load-result` 取回。
- `goto` / `branch` / `return` / `return-void` / `tail-call-n` / `tail-call-prim-n`
  / `tail-apply-n` 是 terminator 指令，为一个基本块的结束。

每条指令的语法和操作数约束详见[指令参考](instructions.md)。

# 标签

`define-function` 等定义中，指令序列里的裸符号（bare symbol）是标签定义。

- 标签只是代码中的一个位置标记，不改变控制流，也不引入新的作用域。
- 控制流按指令顺序流动；若没有 terminator，会继续执行后面的指令。
- 一个函数的入口就是第一个可执行指令，不需要显式的入口标记。

```scheme
(define-function (factorial n)
  (load one 1)
  (int-less-or-equal base n one)
  (branch base (label base-case) (label recur-case))
  base-case
  (load result 1)
  (return result)
  recur-case
  (isub m n one)
  (call-1 (fn factorial) m)
  (load-result sub)
  (imul result n sub)
  (return result))
```

注意：

- 指令序列元素位置的裸符号是**标签定义**；
- 指令内部 operand 位置的裸符号是 **局部变量**。
  两者位置不同，语法上完全区分。

比较指令的两个输入都是槽 —— 比较字面量时需要先用 `load` 把字面量载入槽。

# 顶层定义

## (define-function)

```scheme
(define-function (<name> <parameter> ...)
  <instr-or-label>
  ...)
```

定义函数。

- 第一个列表是该函数的**签名**：`<name>` 为函数名，`<parameter> ...` 为参数名列表。
- 参数名按声明顺序映射为槽 `0` 到 `arity - 1`（arity 即参数个数），
  `call-n` 的 `n` 必须等于 arity。
- `<instr-or-label>` 是一条指令，或一个裸符号标签定义。

```scheme
(define-function (square x)
  (imul result x x)
  (return result))
```

## (define-variable)

```scheme
(define-variable <name>
  <instr-or-label>
  ...)
```

定义全局变量，body 的返回值（`return` 的结果）即变量的初值。

```scheme
(define-variable *version*
  (load value 42)
  (return value))
```

## (define-test)

```scheme
(define-test <name>
  <instr-or-label>
  ...)
```

定义测试函数，arity 为 0，通常以 `return-void` 结束。

```scheme
(define-test factorial-test
  (load n 5)
  (call-1 (fn factorial) n)
  (load-result result)
  (load expected 120)
  (call-2 (prim meta-builtin/builtin/assert-equal) result expected)
  (return-void))
```

## (declare-primitive-function)

```scheme
(declare-primitive-function <name> <arity>)
```

声明由运行时（C 侧）提供的 primitive 函数。加载时按名字绑定。

## (declare-primitive-variable)

```scheme
(declare-primitive-variable <name>)
```

声明由运行时提供的 primitive 变量。加载时按名字绑定。

## (default-entry)

```scheme
(default-entry <name>)
```

指定程序的入口函数，与 `xvm2` 的 `run` 命令配合使用。

# 操作数

操作数是指令的参数，按 xvm2 机器语义分类。
各形式的含义由语法唯一决定，无歧义。

## 局部变量

```scheme
<var> := <symbol>
```

局部变量（VarOperand），裸符号。汇编时把名字映射为槽号。

```scheme
x
result
value
```

## (fn)

```scheme
(fn <name>)
```

函数定义引用。用于：

- `call-n` / `tail-call-n` 的目标 —— 静态函数调用；
- `load` 的 `<value>` —— 把函数作为一等公民值载入槽。

```scheme
(fn square)
(fn meta-builtin/builtin/factorial)
```

## (prim)

```scheme
(prim <name>)
```

primitive 函数引用。用于：

- `call-prim-n` / `tail-call-prim-n` 的目标 —— 静态 primitive 调用；
- `load` 的 `<value>` —— 把 primitive 作为一等公民值载入槽。

```scheme
(prim meta-builtin/builtin/imul)
```

## (global)

```scheme
(global <name>)
```

全局变量引用。用于 `global-load` / `global-store`。

```scheme
(global *version*)
(global meta-builtin/builtin/counter)
```

## (label)

```scheme
(label <name>)
```

代码标签引用，用作 `goto` / `branch` 的跳转目标。

```scheme
(label positive)
(label merge)
```

注意 `(label ...)` 是 operand，与指令序列中的标签定义（裸符号）不同。

## 字面量

`load` 的第二个 operand（`<value>`）接受以下字面量：

| 记号      | 语法      | 例子          | 说明      |
|-----------|-----------|---------------|-----------|
| `<int>`   | 十进制整数 | `42` `-1` `0` | int 值    |
| `<float>` | 浮点数     | `3.14` `-2.5` | float 值  |
| `<string>`| `"..."`   | `"hello"` `""` | text 值  |
| `'<symbol>`| quote 前缀 | `'foo` `'red` | symbol 值 |

- 字面量以统一的 `load` 载入，值的类型由 tag 携带，不需要分开的常量指令。
- symbol 字面量必须带 quote 前缀 `'` —— 裸符号一律是 VarOperand，
  不带引号的 `foo` 会被读作局部变量而非 symbol 值。
- **没有 bool 字面量** —— meta-lisp 中 `true` / `false` 是 builtin 全局变量
  （`meta-builtin/builtin/true` / `meta-builtin/builtin/false`），
  通过 `global-load` 获取：

  ```scheme
  (global-load t (global meta-builtin/builtin/true))
  ```

  bool 值除此以外来自比较指令（如 `int-less`）的输出和 primitive 返回值。
- void 的记法为 `#void`，但**不会出现在汇编代码中** ——
  void 由 `return-void` 指令表达。

# 汇编与槽位分配

汇编（/编码）时，将每个函数的 VarOperand 名字映射为槽号：

- 参数名按 `(define-function (f x y) ...)` 的声明顺序映射为槽 `0..arity-1`；
- 其余 VarOperand 按首次出现顺序从槽 `arity` 起分配；
- 函数体中的同一名字映射到同一槽。
