---
title: 语法
---

# 纲要

- 简介
  - 例子
  - 设计目标
  - 设计性质
- 程序
  - 注释
  - 函数
- 标签
- 指令
- 操作数
- 主函数

# 简介

xvm-lisp 是 xvm 虚拟机的汇编语言。

与 x86-lisp 同都属于底层汇编语言，
具有汇编语言的共性：

- 需要指令集编码
- 需要可执行文件格式
- 需要加载器

例子：

```xvm-lisp
(define-function (self/math/factorial n)
  body
  (load-int int.3 1)
  (int-less-or-equal value.3 n int.3)
  (branch value.3 (label then.1) (label else.2))
  then.1
  (load-int int.1 1)
  (return int.1)
  else.2
  (load-int int.2 1)
  (isub value.2 n int.2)
  (call-1 (fn self/math/factorial) value.2)
  (load-result value.1)
  (tail-call-prim-2 (prim meta-builtin/builtin/imul) value.1 n))
```

设计目标：

- xvm 应该是一个可移植的虚拟架构。
  - 在实现 native 编译器之前临时使用。
- 实现应该简单。
  - 易于用 c 写 xvm 的 bytecode 解释器。
- 运行应该高效。
  - 可以优化为 directed threaded 解释器。

设计性质：

- 直接支持动态类型语言的 tagged value 编码，
  所有内置函数的参数与返回值都是 tagged value，
  局部变量保存的也是 tagged value。

- 指令采用 Intel 操作数顺序。
  目标操作数在前，源操作数在后。

- 与 x86 之类的真实架构不同，
  没有有限数量的通用寄存器，
  函数的所有局部变量都分配在栈上。

- 为了方便读写汇编代码，
  在一个函数中，允许直接使用具有名字的局部变量。

  汇编器会把名字分配到栈中的内存位置：
  - 一个函数内每个名字对应一个位置；
  - 先分配函数的参数，再分配局部变量。

- 为了保持简单，每个指令的操作数个数都是固定的，
  每个位置的操作数类型也是固定的。

- 避免函数调用约定，直接使用参数个数固定的函数调用指令，
  -- `call-0 call-1 call-2` 等等，最高是 `call-6`。
  对应于 System V AMD64 ABI 函数调用约定中，
  寄存器传递的参数个数限制。

- 设定一个特殊寄存器保存函数返回值，
  用 `load-result` 指令取返回值。

- 所有操作数在语法上用 sexp 完全区分，符号用于表示局部变量。

# 程序

```xvm-lisp
<program> := (define-function (<name> <parameter> ...)
               <instr-or-label>
               ...)
           | (declare-variable <name>)
           | (declare-primitive-function <name>)
           | (declare-primitive-variable <name>)

<instr-or-label> := <instr> | <label>
```

## 注释

xvm-lisp 使用 LISP 风格的行注释，以 `;` 开头直到行尾。
通常写两个分号 `;;`。

```xvm-lisp
;; 这是一条注释
(load-int x 42)  ;; 行尾注释
```

## 函数

```xvm-lisp
(define-function (<name> <parameter> ...)
  <instr-or-label>
  ...)
```

例如：

```xvm-lisp
(define-function (square x)
  (imul result x x)
  (return result))
```

## 标签

```xvm-lisp
<label> := <name>
```

在函数定义中，指令序列里的裸符号是标签。

- 标签在函数中标记代码中的一个位置。
  标签不改变控制流，也不引入新的作用域。
- 一个函数的入口就是第一个可执行指令，可以没有起始标签。

## 指令

```xvm-lisp
<instr> := (<op> <operand> ...)
```

采用 Intel 的操作数顺序，目标操作数在前，源操作数在后。

- 有输出结果的指令，第一个 operand 是 `<dest>`；结果写入 `<dest>`。
- 函数调用（`call-n` / `call-prim-n` / `apply-n`）不使用 `<dest>`，
  结果进入返回寄存器，需要时用 `load-result` 指令取回。

每条指令的语法和操作数约束详见[指令参考](instructions.md)。

# 操作数

```xvm-lisp
<operand> := <name>
           | (fn <name>)
           | (prim <name>)
           | (global <name>)
           | (label <name>)
           | <literal>

<literal> := <int>
           | <float>
           | <string>
           | <symbol>
```

## (fn)

```xvm-lisp
(fn <name>)
```

引用函数指针。需要修正。

用于：

- `call-n` / `tail-call-n` 的目标，静态函数调用；
- `load-closure` / `make-closure` 的目标，把函数作为 closure 的来源。

## (prim)

```xvm-lisp
(prim <name>)
```

引用基本函数指针。需要修正。

用于：

- `call-prim-n` / `tail-call-prim-n` 的目标，静态基本函数调用；
- 不作为 `load-closure` / `make-closure` 的直接目标，
  基本函数必须先转换为其 wrap 函数，
  再对 wrap 函数做 closure。

```xvm-lisp
(prim meta-builtin/builtin/imul)
```

## (global)

```xvm-lisp
(global <name>)
```

引用全局变量指针。需要修正。

用于 `load-global` / `store-global`。

## (label)

```xvm-lisp
(label <name>)
```

引用代码标签。

用作 `goto` / `branch` 的跳转目标。

注意 `(label ...)` 是操作数，与指令序列中的标签定义（裸符号）不同。

## 字面量

不同类型的字面量使用不同的 load 指令：

| 例子                      | 说明        |
|---------------------------|-------------|
| `(load-int x 42)`         | 加载 int    |
| `(load-float x 3.14)`     | 加载 float  |
| `(load-string x "hello")` | 修正 string |
| `(load-symbol x 'foo)`    | 修正 symbol |


没有 bool 字面量，通过 `load-global` 获取 bool 值。

例如：

```xvm-lisp
(load-global t (global meta-builtin/builtin/true))
```

# 主函数

约定程序的入口函数是 `main`。

例如：

```xvm-lisp
(define-function (main)
  (call-0 (fn setup-variables))
  (call-0 (fn <entry>))
  (return-void))
```

测试函数是 `test`。

例如：

```xvm-lisp
(define-function (test)
  (call-0 (fn setup-variables))
  (call-0 (fn run-tests))
  (return-void))
```
