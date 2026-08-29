---
title: 指令参考
---

> 通用语法见 [syntax.md](syntax.md)。
> 操作数约束中，空格分隔表示“可选其一”。

## 操作数记号

| 记号         | 含义                                            |
|--------------|-------------------------------------------------|
| `<var>`      | 局部变量，裸符号（VarOperand），如 `x` `result` |
| `<dest>`     | 目标局部变量，即 `<var>`                        |
| `<value>`    | 字面量，见语法 [字面量](syntax.md#字面量)       |
| `(fn x)`     | 函数定义引用                                    |
| `(prim x)`   | primitive 函数引用                              |
| `(global x)` | 全局变量引用                                    |
| `(label x)`  | 标签引用                                        |

## 目录

- [字面量与数据传送](#字面量与数据传送)
- [引用与全局](#引用与全局)
- [函数调用](#函数调用)
- [控制流](#控制流)
- [整数运算](#整数运算)
- [浮点运算](#浮点运算)

# 字面量与数据传送

| 指令           | 语法                              | 操作数约束                                      | 描述                                                                            |
|----------------|-----------------------------------|-------------------------------------------------|---------------------------------------------------------------------------------|
| `load-int`     | `(load-int <dest> <int>)`         | `<dest> := <var>`；`<int>` 为整数               | 载入 int 值                                                                     |
| `load-float`   | `(load-float <dest> <float>)`     | `<dest> := <var>`；`<float>` 为浮点数           | 载入 float 值                                                                   |
| `load-string`  | `(load-string <dest> "<string>")` | `<dest> := <var>`；`<string>` 为字符串          | 载入 string 值                                                                  |
| `load-symbol`  | `(load-symbol <dest> '<symbol>)`  | `<dest> := <var>`；`'<symbol>` 为 symbol 字面量 | 载入 symbol 值                                                                  |
| `load-closure` | `(load-closure <dest> (fn x))`    | `<dest> := <var>`；目标为 `(fn ...)`            | 载入无环境 closure（一等公民）；`x` 可以是函数，也可以是 primitive 的 wrap 函数 |
| `move`         | `(move <dest> <src>)`             | `<dest> := <var>`；`<src> := <var>`             | 槽间拷贝                                                                        |
| `load-result`  | `(load-result <dest>)`            | `<dest> := <var>`                               | 从返回寄存器取回最近一次 `call-n` / `call-prim-n` / `apply-n` 的结果            |

载入无环境 closure：

```scheme
(load-closure f (fn square))
;; primitive 必须先由编译器转换为其 wrap 函数，再 load-closure
(load-closure p (fn meta-builtin/builtin/imul©wrap))
```

# Closure 构造

| 指令               | 语法                                                      | 操作数约束                                    | 描述                                        |
|--------------------|-----------------------------------------------------------|-----------------------------------------------|---------------------------------------------|
| `make-closure`     | `(make-closure <dest> (fn x) <size>)` | `<dest> := <var>`；目标为 `(fn ...)`；`<size>` 为环境槽数 | 分配带环境 closure，环境槽数为 `<size>`；`x` 可以是函数，也可以是 primitive 的 wrap 函数 |
| `store-closure-arg`| `(store-closure-arg <closure> <index> <value>)`           | `<closure> := <var>`；`<index>` 为下标；`<value> := <var>` | 将 `<value>` 写入 closure 的第 `<index>` 个环境槽 |

```scheme
(make-closure c (fn add-y) 1)
(store-closure-arg c 0 y)
```

# 引用与全局

| 指令           | 语法                         | 操作数约束                                   | 描述                 |
|----------------|------------------------------|----------------------------------------------|----------------------|
| `load-global`  | `(load-global <dest> (global x))` | `<dest> := <var>`                          | 读全局变量的值       |
| `store-global` | `(store-global (global x) <src>)` | `<src> := <var>`                           | 将槽的值写入全局变量 |

# 函数调用

`n` 为参数个数，取值 `0` 到 `6`（受前端 `LimitArityPass` 限制）。
每条指令定长 —— n 个参数对应 n 个参数槽操作数。

- `call-n` / `tail-call-n`：静态函数调用，目标为 `(fn ...)`。
- `call-prim-n` / `tail-call-prim-n`：静态 primitive 调用，目标为 `(prim ...)`。
- `apply-n`：动态调用，目标为 `<var>`（closure）。

调用结果进入返回寄存器，**不使用 `<dest>`**；需要结果时，
调用后跟一条 `load-result`。

| 指令                                      | 语法                                   | 操作数约束                      | 描述                                                              |
|-------------------------------------------|----------------------------------------|---------------------------------|-------------------------------------------------------------------|
| `call-0` ... `call-6`                     | `(call-n (fn f) <a0> ...)`             | 目标为 `(fn ...)`；n 个参数槽   | 静态函数调用。要求 `n` 等于 f 的 arity；结果入返回寄存器          |
| `call-prim-0` ... `call-prim-6`           | `(call-prim-n (prim p) <a0> ...)`      | 目标为 `(prim ...)`；n 个参数槽 | 静态 primitive 调用。直接调 C primitive，不压帧；结果入返回寄存器 |
| `tail-call-0` ... `tail-call-6`           | `(tail-call-n (fn f) <a0> ...)`        | 同上                            | 尾函数调用 —— 回收当前帧后进入 callee，terminator               |
| `tail-call-prim-0` ... `tail-call-prim-6` | `(tail-call-prim-n (prim p) <a0> ...)` | 同上                            | 尾 primitive 调用，terminator                                     |
| `apply-0` ... `apply-6`                   | `(apply-n <target> <a0> ...)`          | `<target> := <var>`；n 个参数槽 | 动态调用。`target` 必须是 closure；结果入返回寄存器               |
| `tail-apply-0` ... `tail-apply-6`         | `(tail-apply-n <target> <a0> ...)`     | 同上                            | 尾动态调用，terminator                                            |

## call / apply 与 load-result

需要调用结果时，在调用后使用 `load-result`：

```scheme
(call-2 (fn factorial) n)
(load-result result)
```

动态调用先装载 closure 再 `apply-n`：

```scheme
(load-closure f (fn negation))
(apply-1 f x)
(load-result result)
```

副作用调用（丢弃结果）不写 `load-result` —— 没有 dest 操作数，
"丢弃"是零成本的。

## apply 的 target

`apply-n` / `tail-apply-n` 的 `target` 必须是 closure。
运行时不再按 fn / prim / closure 分派，而是统一调用 closure。

无环境 closure 用 `load-closure` 构造；
带环境 closure 用 `make-closure` + `store-closure-arg` 构造。

```scheme
;; 无环境 closure
(load-closure f (fn square))
(apply-1 f x)

;; 带环境 closure
(make-closure c (fn add-y) 1)
(store-closure-arg c 0 y)
(apply-1 c x)
```

所有调用（含 `apply-n`）的参数个数都由编译期保证与目标函数的 arity
一致 —— 编译时已消除 auto currying 与 over-application，运行时无需
curry 机制。`call-n` / `call-prim-n` / `apply-n` 的 `n == arity` 由翻译层保证。

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

| 指令                                                                | 语法                             | 操作数约束                                | 描述                         |
|---------------------------------------------------------------------|----------------------------------|-------------------------------------------|------------------------------|
| `iadd` `isub` `imul` `idiv` `imod`                                  | `(iadd <dest> <a> <b>)`          | `<dest> := <var>`；`<a> <b>` 为两个输入槽 | 整数二元运算                 |
| `ineg`                                                              | `(ineg <dest> <src>)`            | `<dest> := <var>`；`<src> := <var>`       | 整数取负                     |
| `int-greater` `int-less` `int-greater-or-equal` `int-less-or-equal` | `(int-less <dest> <a> <b>)`      | `<dest> := <var>`；`<a> <b>` 为两个输入槽 | 整数有序比较，结果为 bool 值 |
| `int-is-positive` `int-is-non-negative` `int-is-non-zero`           | `(int-is-positive <dest> <src>)` | `<dest> := <var>`；`<src> := <var>`       | 整数一元谓词，结果为 bool 值 |

# 浮点运算

操作数必须是 float 值（`value_t` 的 tag 为 float），否则运行时报错。
结果写入 `<dest>`，为 float 值（比较指令为 bool 值）。

> 注：`.xvm.basic` 当前的浮点运算走 builtin 调用，尚未映射为指令；
> 以下指令为 xvm-lisp 预定义的指令形式，供翻译层直译时使用。

| 指令                                                                        | 语法                               | 操作数约束                                | 描述                         |
|-----------------------------------------------------------------------------|------------------------------------|-------------------------------------------|------------------------------|
| `fadd` `fsub` `fmul` `fdiv`                                                 | `(fadd <dest> <a> <b>)`            | `<dest> := <var>`；`<a> <b>` 为两个输入槽 | 浮点二元运算                 |
| `fneg`                                                                      | `(fneg <dest> <src>)`              | `<dest> := <var>`；`<src> := <var>`       | 浮点取负                     |
| `float-greater` `float-less` `float-greater-or-equal` `float-less-or-equal` | `(float-less <dest> <a> <b>)`      | `<dest> := <var>`；`<a> <b>` 为两个输入槽 | 浮点有序比较，结果为 bool 值 |
| `float-is-positive` `float-is-non-negative` `float-is-non-zero`             | `(float-is-positive <dest> <src>)` | `<dest> := <var>`；`<src> := <var>`       | 浮点一元谓词，结果为 bool 值 |

# 设计不变量

- 所有指令的操作数个数固定。
- `apply-n` / `tail-apply-n` 的 target 必须是 closure。
- fn / prim 不作为可动态 apply 的值存在；它们只作为静态引用：
  - `call-n` / `tail-call-n` 使用 `(fn ...)`
  - `call-prim-n` / `tail-call-prim-n` 使用 `(prim ...)`
  - `load-closure` / `make-closure` 使用 `(fn ...)` 作为 closure 的来源；primitive 必须先转换为其 wrap 函数
- 无环境 closure 用 `load-closure` 构造，可以优化为 relocation。
- 带环境 closure 用 `make-closure` + `store-closure-arg` 构造。
- `make-closure` 不接受可变数量的 env 参数，环境通过 `store-closure-arg` 逐个填充。
