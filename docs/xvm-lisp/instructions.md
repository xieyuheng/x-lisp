---
title: 指令参考
---

> 通用语法见 [syntax.md](syntax.md)。

## 操作数记号

```text
<var>      局部变量
<dest>     目标局部变量
<value>    字面量
(fn x)     函数定义引用
(prim x)   primitive 函数引用
(global x) 全局变量引用
(label x)  标签引用
```

- `<var>` 是局部变量，裸符号（VarOperand），如 `x` `result`。
- `<dest>` 是目标局部变量，即 `<var>`。
- `<value>` 是字面量，见语法 [字面量](syntax.md#字面量)。
- `(fn x)` 是函数定义引用。
- `(prim x)` 是 primitive 函数引用。
- `(global x)` 是全局变量引用。
- `(label x)` 是标签引用。

## 目录

- [字面量与数据传送](#字面量与数据传送)
- [引用与全局](#引用与全局)
- [函数调用](#函数调用)
- [控制流](#控制流)
- [整数运算](#整数运算)
- [浮点运算](#浮点运算)

# 字面量与数据传送

```text
(load-int <dest> <int>)
(load-float <dest> <float>)
(load-string <dest> "<string>")
(load-symbol <dest> '<symbol>)
(load-closure <dest> (fn x))
(move <dest> <src>)
(load-result <dest>)
```

- `load-int`：载入 int 值；`<int>` 为整数。
- `load-float`：载入 float 值；`<float>` 为浮点数。
- `load-string`：载入 string 值；`<string>` 为字符串。
- `load-symbol`：载入 symbol 值；`'<symbol>` 为 symbol 字面量。
- `load-closure`：载入无环境 closure（一等公民）；目标为 `(fn ...)`；`x` 可以是函数，也可以是 primitive 的 wrap 函数。
- `move`：槽间拷贝；`<dest> := <var>`，`<src> := <var>`。
- `load-result`：从返回寄存器取回最近一次 `call-n` / `call-prim-n` / `apply-n` 的结果；`<dest> := <var>`。

载入无环境 closure：

```scheme
(load-closure f (fn square))
;; primitive 必须先由编译器转换为其 wrap 函数，再 load-closure
(load-closure p (fn meta-builtin/builtin/imul©wrap))
```

# Closure 构造

```text
(make-closure <dest> (fn x) <size>)
(store-closure-arg <closure> <index> <value>)
```

- `make-closure`：分配带环境 closure，环境槽数为 `<size>`；`<dest> := <var>`，目标为 `(fn ...)`；`x` 可以是函数，也可以是 primitive 的 wrap 函数。
- `store-closure-arg`：将 `<value>` 写入 closure 的第 `<index>` 个环境槽；`<closure> := <var>`，`<index>` 为下标，`<value> := <var>`。

```scheme
(make-closure c (fn add-y) 1)
(store-closure-arg c 0 y)
```

# 引用与全局

```text
(load-global <dest> (global x))
(store-global (global x) <src>)
```

- `load-global`：读全局变量的值；`<dest> := <var>`。
- `store-global`：将槽的值写入全局变量；`<src> := <var>`。

# 函数调用

`n` 为参数个数，取值 `0` 到 `6`（受前端 `LimitArityPass` 限制）。
每条指令定长 —— n 个参数对应 n 个参数槽操作数。

- `call-n` / `tail-call-n`：静态函数调用，目标为 `(fn ...)`。
- `call-prim-n` / `tail-call-prim-n`：静态 primitive 调用，目标为 `(prim ...)`。
- `apply-n`：动态调用，目标为 `<var>`（closure）。

调用结果进入返回寄存器，**不使用 `<dest>`**；需要结果时，
调用后跟一条 `load-result`。

```text
(call-0 (fn f))
(call-1 (fn f) <a0>)
(call-2 (fn f) <a0> <a1>)
(call-3 (fn f) <a0> <a1> <a2>)
(call-4 (fn f) <a0> <a1> <a2> <a3>)
(call-5 (fn f) <a0> <a1> <a2> <a3> <a4>)
(call-6 (fn f) <a0> <a1> <a2> <a3> <a4> <a5>)

(call-prim-0 (prim p))
(call-prim-1 (prim p) <a0>)
(call-prim-2 (prim p) <a0> <a1>)
(call-prim-3 (prim p) <a0> <a1> <a2>)
(call-prim-4 (prim p) <a0> <a1> <a2> <a3>)
(call-prim-5 (prim p) <a0> <a1> <a2> <a3> <a4>)
(call-prim-6 (prim p) <a0> <a1> <a2> <a3> <a4> <a5>)

(tail-call-0 (fn f))
(tail-call-1 (fn f) <a0>)
(tail-call-2 (fn f) <a0> <a1>)
(tail-call-3 (fn f) <a0> <a1> <a2>)
(tail-call-4 (fn f) <a0> <a1> <a2> <a3>)
(tail-call-5 (fn f) <a0> <a1> <a2> <a3> <a4>)
(tail-call-6 (fn f) <a0> <a1> <a2> <a3> <a4> <a5>)

(tail-call-prim-0 (prim p))
(tail-call-prim-1 (prim p) <a0>)
(tail-call-prim-2 (prim p) <a0> <a1>)
(tail-call-prim-3 (prim p) <a0> <a1> <a2>)
(tail-call-prim-4 (prim p) <a0> <a1> <a2> <a3>)
(tail-call-prim-5 (prim p) <a0> <a1> <a2> <a3> <a4>)
(tail-call-prim-6 (prim p) <a0> <a1> <a2> <a3> <a4> <a5>)

(apply-0 <target>)
(apply-1 <target> <a0>)
(apply-2 <target> <a0> <a1>)
(apply-3 <target> <a0> <a1> <a2>)
(apply-4 <target> <a0> <a1> <a2> <a3>)
(apply-5 <target> <a0> <a1> <a2> <a3> <a4>)
(apply-6 <target> <a0> <a1> <a2> <a3> <a4> <a5>)

(tail-apply-0 <target>)
(tail-apply-1 <target> <a0>)
(tail-apply-2 <target> <a0> <a1>)
(tail-apply-3 <target> <a0> <a1> <a2>)
(tail-apply-4 <target> <a0> <a1> <a2> <a3>)
(tail-apply-5 <target> <a0> <a1> <a2> <a3> <a4>)
(tail-apply-6 <target> <a0> <a1> <a2> <a3> <a4> <a5>)
```

- `call-n`：静态函数调用。要求 `n` 等于 f 的 arity；结果入返回寄存器。
- `call-prim-n`：静态 primitive 调用。直接调 C primitive，不压帧；结果入返回寄存器。
- `tail-call-n`：尾函数调用 —— 回收当前帧后进入 callee，terminator。
- `tail-call-prim-n`：尾 primitive 调用，terminator。
- `apply-n`：动态调用。`target` 必须是 closure；结果入返回寄存器。
- `tail-apply-n`：尾动态调用，terminator。

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

```text
(goto (label l))
(branch <cond> (label t) (label e))
(return <src>)
(return-void)
```

- `goto`：无条件跳转，terminator；`<label>` 为标签引用。
- `branch`：条件分支，terminator；`<cond> := <var>`（cond 为 bool 值），两个 `<label>` 分别为真、假分支。
- `return`：带值返回，terminator；`<src> := <var>`。
- `return-void`：void 返回，terminator。

## branch

`branch` 的 `<cond>` 为 bool 值，为真时跳转到 `<then-label>`，
否则跳转到 `<else-label>`。

```scheme
(branch is-positive (label positive) (label non-positive))
```

# 整数运算

操作数必须是 int 值（`value_t` 的 tag 为 int），否则运行时报错。
结果写入 `<dest>`，为 int 值。

```text
(iadd <dest> <a> <b>)
(isub <dest> <a> <b>)
(imul <dest> <a> <b>)
(idiv <dest> <a> <b>)
(imod <dest> <a> <b>)
(ineg <dest> <src>)
(int-greater <dest> <a> <b>)
(int-less <dest> <a> <b>)
(int-greater-or-equal <dest> <a> <b>)
(int-less-or-equal <dest> <a> <b>)
(int-is-positive <dest> <src>)
(int-is-non-negative <dest> <src>)
(int-is-non-zero <dest> <src>)
```

- `iadd` `isub` `imul` `idiv` `imod`：整数二元运算；`<dest> := <var>`，`<a> <b>` 为两个输入槽。
- `ineg`：整数取负；`<dest> := <var>`，`<src> := <var>`。
- `int-greater` `int-less` `int-greater-or-equal` `int-less-or-equal`：整数有序比较，结果为 bool 值；`<dest> := <var>`，`<a> <b>` 为两个输入槽。
- `int-is-positive` `int-is-non-negative` `int-is-non-zero`：整数一元谓词，结果为 bool 值；`<dest> := <var>`，`<src> := <var>`。

# 浮点运算

操作数必须是 float 值（`value_t` 的 tag 为 float），否则运行时报错。
结果写入 `<dest>`，为 float 值（比较指令为 bool 值）。

> 注：`.xvm.basic` 当前的浮点运算走 builtin 调用，尚未映射为指令；
> 以下指令为 xvm-lisp 预定义的指令形式，供翻译层直译时使用。

```text
(fadd <dest> <a> <b>)
(fsub <dest> <a> <b>)
(fmul <dest> <a> <b>)
(fdiv <dest> <a> <b>)
(fneg <dest> <src>)
(float-greater <dest> <a> <b>)
(float-less <dest> <a> <b>)
(float-greater-or-equal <dest> <a> <b>)
(float-less-or-equal <dest> <a> <b>)
(float-is-positive <dest> <src>)
(float-is-non-negative <dest> <src>)
(float-is-non-zero <dest> <src>)
```

- `fadd` `fsub` `fmul` `fdiv`：浮点二元运算；`<dest> := <var>`，`<a> <b>` 为两个输入槽。
- `fneg`：浮点取负；`<dest> := <var>`，`<src> := <var>`。
- `float-greater` `float-less` `float-greater-or-equal` `float-less-or-equal`：浮点有序比较，结果为 bool 值；`<dest> := <var>`，`<a> <b>` 为两个输入槽。
- `float-is-positive` `float-is-non-negative` `float-is-non-zero`：浮点一元谓词，结果为 bool 值；`<dest> := <var>`，`<src> := <var>`。

# 设计不变量

- 所有指令的操作数个数固定。
- `apply-n` / `tail-apply-n` 的 target 必须是 closure。
- fn / prim 不作为可动态 apply 的值存在；它们只作为静态引用：
  - `call-n` / `tail-call-n` 使用 `(fn ...)`
  - `call-prim-n` / `tail-call-prim-n` 使用 `(prim ...)`
  - `load-closure` / `make-closure` 使用 `(fn ...)` 作为 closure 的来源；primitive 必须先转换为其 wrap 函数
- 无环境 closure 用 `load-closure` 构造，可以优化为修正。
- 带环境 closure 用 `make-closure` + `store-closure-arg` 构造。
- `make-closure` 不接受可变数量的 env 参数，环境通过 `store-closure-arg` 逐个填充。
