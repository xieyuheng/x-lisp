---
title: 指令参考
---

> 通用语法见 [syntax.md](syntax.md)。
> 操作数约束中，空格分隔表示“可选其一”。

## 操作数记号

| 记号     | 含义                                                         |
|----------|--------------------------------------------------------------|
| `<var>`  | 局部变量，裸符号（VarOperand），如 `x` `result`              |
| `<dest>` | 目标局部变量，即 `<var>`                                    |
| `<value>`| 字面量，见语法 [字面量](syntax.md#字面量)                    |
| `(fn x)` | 函数定义引用                                                 |
| `(prim x)`| primitive 函数引用                                          |
| `(global x)`| 全局变量引用                                              |
| `(label x)`| 标签引用                                                    |

## 目录

- [字面量与数据传送](#字面量与数据传送)
- [引用与全局](#引用与全局)
- [函数调用](#函数调用)
- [控制流](#控制流)
- [整数运算](#整数运算)
- [浮点运算](#浮点运算)

# 字面量与数据传送

| 指令          | 语法                      | 操作数约束                    | 描述                                   |
|---------------|---------------------------|-------------------------------|----------------------------------------|
| `load`        | `(load <dest> <value>)`   | `<dest> := <var>`；`<value>` 为字面量、`(fn ...)` 或 `(prim ...)` | 载入字面量或函数值到槽。所有类型统一走此指令，值的类型由 tag 携带 |
| `move`        | `(move <dest> <src>)`     | `<dest> := <var>`；`<src> := <var>` | 槽间拷贝                               |
| `load-result` | `(load-result <dest>)`    | `<dest> := <var>`          | 从返回寄存器取回最近一次 `call-n` / `call-prim-n` / `apply-n` 的结果 |

`load` 装载函数值（一等公民）：

```scheme
(load f (fn square))
(load p (prim meta-builtin/builtin/imul))
```

# 引用与全局

| 指令           | 语法                         | 操作数约束                                   | 描述                 |
|----------------|------------------------------|----------------------------------------------|----------------------|
| `global-load`  | `(global-load <dest> (global x))` | `<dest> := <var>`                          | 读全局变量的值       |
| `global-store` | `(global-store (global x) <src>)` | `<src> := <var>`                           | 将槽的值写入全局变量 |

# 函数调用

`n` 为参数个数，取值 `0` 到 `6`（受前端 `LimitArityPass` 限制）。
每条指令定长 —— n 个参数对应 n 个参数槽操作数。

- `call-n` / `tail-call-n`：静态函数调用，目标为 `(fn ...)`。
- `call-prim-n` / `tail-call-prim-n`：静态 primitive 调用，目标为 `(prim ...)`。
- `apply-n`：动态调用，目标为 `<var>`（运行时的函数值）。

调用结果进入返回寄存器，**不使用 `<dest>`**；需要结果时，
调用后跟一条 `load-result`。

| 指令             | 语法                              | 操作数约束                          | 描述                                   |
|------------------|-----------------------------------|-------------------------------------|----------------------------------------|
| `call-0` … `call-6` | `(call-n (fn f) <a0> ...)`      | 目标为 `(fn ...)`；n 个参数槽 | 静态函数调用。要求 `n` 等于 f 的 arity；结果入返回寄存器 |
| `call-prim-0` … `call-prim-6` | `(call-prim-n (prim p) <a0> ...)` | 目标为 `(prim ...)`；n 个参数槽 | 静态 primitive 调用。直接调 C primitive，不压帧；结果入返回寄存器 |
| `tail-call-0` … `tail-call-6` | `(tail-call-n (fn f) <a0> ...)` | 同上 | 尾函数调用 —— 回收当前帧后进入 callee，terminator |
| `tail-call-prim-0` … `tail-call-prim-6` | `(tail-call-prim-n (prim p) <a0> ...)` | 同上 | 尾 primitive 调用，terminator |
| `apply-0` … `apply-6` | `(apply-n <target> <a0> ...)` | `<target> := <var>`；n 个参数槽 | 动态调用。运行时按值的类型分派（fn / prim / closure / curry）；结果入返回寄存器 |
| `tail-apply-0` … `tail-apply-6` | `(tail-apply-n <target> <a0> ...)` | 同上 | 尾动态调用，terminator |

## call / apply 与 load-result

需要调用结果时，在调用后使用 `load-result`：

```scheme
(call-2 (fn factorial) n)
(load-result result)
```

动态调用先取函数值（`load` 装载一等公民函数）再 `apply-n`：

```scheme
(load f (fn negation))
(apply-1 f x)
(load-result result)
```

副作用调用（丢弃结果）不写 `load-result` —— 没有 dest 操作数，
"丢弃"是零成本的。

## apply 的分派

`apply-n` 的目标是运行时的值，按值的类型分派：fn → 压帧调用；
prim → 直接 C 调用；closure → 解包后调用；curry → 合并参数后调用。

## curry / over-application

`apply-n` 不要求目标函数的 arity 等于 `n`：

- `n < arity`：部分应用（curry），结果为 curry 对象；
- `n == arity`：直接调用；
- `n > arity`：调用后继续应用剩余参数（over-application）。

`call-n` / `call-prim-n` 是静态调用，要求 `n == arity`，由翻译层保证。

# 控制流

| 指令          | 语法                                           | 操作数约束                                            | 描述                                |
|---------------|------------------------------------------------|-------------------------------------------------------|-------------------------------------|
| `goto`        | `(goto (label l))`                             | `<label>` 为标签引用                                  | 无条件跳转，terminator              |
| `branch`      | `(branch <cond> (label t) (label e))`          | `<cond> := <var>`（cond 为 bool 值）；两个 `<label>` | 条件分支，terminator                |
| `return`      | `(return <src>)`                               | `<src> := <var>`                                      | 带值返回，terminator                |
| `return-void` | `(return-void)`                                | -                                                     | void 返回，terminator               |

## branch

`branch` 的 `<cond>` 为 bool 值，为真时跳转到 `<then-label>`，
否则跳转到 `<else-label>`。

```scheme
(branch is-positive (label positive) (label non-positive))
```

# 整数运算

操作数必须是 int 值（`value_t` 的 tag 为 int），否则运行时报错。
结果写入 `<dest>`，为 int 值。

| 指令                     | 语法                              | 操作数约束              | 描述         |
|--------------------------|-----------------------------------|-------------------------|--------------|
| `iadd` `isub` `imul` `idiv` `imod` | `(iadd <dest> <a> <b>)` | `<dest> := <var>`；`<a> <b>` 为两个输入槽 | 整数二元运算 |
| `ineg`                   | `(ineg <dest> <src>)`             | `<dest> := <var>`；`<src> := <var>` | 整数取负     |
| `int-greater` `int-less` `int-greater-or-equal` `int-less-or-equal` | `(int-less <dest> <a> <b>)` | `<dest> := <var>`；`<a> <b>` 为两个输入槽 | 整数有序比较，结果为 bool 值 |
| `int-is-positive` `int-is-non-negative` `int-is-non-zero` | `(int-is-positive <dest> <src>)` | `<dest> := <var>`；`<src> := <var>` | 整数一元谓词，结果为 bool 值 |

# 浮点运算

操作数必须是 float 值（`value_t` 的 tag 为 float），否则运行时报错。
结果写入 `<dest>`，为 float 值（比较指令为 bool 值）。

> 注：`.xvm.basic` 当前的浮点运算走 builtin 调用，尚未映射为指令；
> 以下指令为 xvm-lisp 预定义的指令形式，供翻译层直译时使用。

| 指令                     | 语法                              | 操作数约束              | 描述         |
|--------------------------|-----------------------------------|-------------------------|--------------|
| `fadd` `fsub` `fmul` `fdiv` | `(fadd <dest> <a> <b>)`         | `<dest> := <var>`；`<a> <b>` 为两个输入槽 | 浮点二元运算 |
| `fneg`                   | `(fneg <dest> <src>)`             | `<dest> := <var>`；`<src> := <var>` | 浮点取负     |
| `float-greater` `float-less` `float-greater-or-equal` `float-less-or-equal` | `(float-less <dest> <a> <b>)` | `<dest> := <var>`；`<a> <b>` 为两个输入槽 | 浮点有序比较，结果为 bool 值 |
| `float-is-positive` `float-is-non-negative` `float-is-non-zero` | `(float-is-positive <dest> <src>)` | `<dest> := <var>`；`<src> := <var>` | 浮点一元谓词，结果为 bool 值 |