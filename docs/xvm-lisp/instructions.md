---
title: 指令参考
---

# 加载

```xvm-lisp
(load-int <dest> <int>)
(load-float <dest> <float>)
(load-string <dest> <string>)
(load-symbol <dest> <symbol>)
(move <dest> <src>)
(load-result <dest>)
```

- `load-int`：加载 int 值。
- `load-float`：加载 float 值。
- `load-string`：加载 string 值，需要 fixup。
- `load-symbol`：加载 symbol 值，需要 fixup。
- `load-result`：从返回寄存器取回最近一次 `call-n` / `call-prim-n` / `apply-n` 的结果。

# 闭包

```xvm-lisp
(load-closure <dest> (fn <name>))
(make-closure <dest> (fn <name>) <size>)
(store-closure-arg <dest-closure> <index> <src>)
```

- `load-closure`：加载无环境 closure，可以实现为 fixup。
- `make-closure`：作带环境的 closure，参数个数为 `<size>`。
- `store-closure-arg`：存 closure 的参数。

# 全局变量

```xvm-lisp
(load-global <dest> (global <name>))
(store-global (global <name>) <src>)
```

- `load-global`：读全局变量的值。
- `store-global`：将槽的值写入全局变量。

# 函数调用

`n` 为参数个数，取值 `0` 到 `6`（受前端 `LimitArityPass` 限制）。
每条指令定长 —— n 个参数对应 n 个参数槽操作数。

- `call-n` / `tail-call-n`：静态函数调用，目标为 `(fn ...)`。
- `call-prim-n` / `tail-call-prim-n`：静态 primitive 调用，目标为 `(prim ...)`。
- `apply-n`：动态调用，目标为 `<var>`（closure）。

调用结果进入返回寄存器，**不使用 `<dest>`**；需要结果时，
调用后跟一条 `load-result`。

```xvm-lisp
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

```xvm-lisp
(call-2 (fn factorial) n)
(load-result result)
```

动态调用先装载 closure 再 `apply-n`：

```xvm-lisp
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

```xvm-lisp
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

```xvm-lisp
(goto (label l))
(branch <cond> (label t) (label e))
(return <src>)
(return-void)
```

- `goto`：无条件跳转，terminator；`<label>` 为标签引用。
- `branch`：条件分支，terminator；`<cond> := <var>`（cond 为 bool 值），两个 `<label>` 分别为真、假分支。
- `return`：带值返回，terminator。
- `return-void`：void 返回，terminator。

## branch

`branch` 的 `<cond>` 为 bool 值，为真时跳转到 `<then-label>`，
否则跳转到 `<else-label>`。

```xvm-lisp
(branch is-positive (label positive) (label non-positive))
```

# 整数运算

操作数必须是 int 值（`value_t` 的 tag 为 int），否则运行时报错。
结果写入 `<dest>`，为 int 值。

```xvm-lisp
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

# 浮点运算

操作数必须是 float 值（`value_t` 的 tag 为 float），否则运行时报错。
结果写入 `<dest>`，为 float 值（比较指令为 bool 值）。

> 注：`.xvm.basic` 当前的浮点运算走 builtin 调用，尚未映射为指令；
> 以下指令为 xvm-lisp 预定义的指令形式，供翻译层直译时使用。

```xvm-lisp
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
