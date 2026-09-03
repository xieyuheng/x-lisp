---
title: 指令
---

# 目录

- [加载](#加载)
- [闭包](#闭包)
- [全局变量](#全局变量)
- [函数调用](#函数调用)
  - [静态调用](#静态调用)
  - [动态调用](#动态调用)
- [结果寄存器](#结果寄存器)
- [控制流](#控制流)
- [整数运算](#整数运算)
- [浮点运算](#浮点运算)

# 加载

```xvm-lisp
(move <dest> <src>)
(load-int <dest> <int>)
(load-float <dest> <float>)
(load-string <dest> <string>)
(load-symbol <dest> <symbol>)
```

操作数 `<dest>` 和 `<src>` 都代表局部变量。

编码：

```text
0x01 move              dest <var> src <var>
0x02 load-int          dest <var> content <int>
0x03 load-float        dest <var> content <float>
0x04 load-string       dest <var> content <string>
0x05 load-symbol       dest <var> content <symbol>
```

修正说明：

- `load-string`：`value` 产生 `(fixup string-value <name>)`
- `load-symbol`：`value` 产生 `(fixup symbol-value <name>)`

# 闭包

```xvm-lisp
(load-closure <dest> (fn <name>))
(make-closure <dest> (fn <name>) (u16 <size>))
(store-closure-arg <closure> (u16 <index>) <src>)
```

- `load-closure`：加载无环境的 closure。
- `make-closure`：创建带环境的 closure，参数个数为 `(u16 <size>)`。
- `store-closure-arg`：存 closure 的参数，下标为 `(u16 <index>)`。

编码：

```text
0x06 load-closure      dest <var> target <fn>
0x07 make-closure      dest <var> target <fn> size <u16>
0x08 store-closure-arg closure <var> index <u16> src <var>
```

修正说明：

- `load-closure`：`target` 产生 `(fixup fn-pointer <name>)`
- `make-closure`：`target` 产生 `(fixup fn-pointer <name>)`

# 全局变量

```xvm-lisp
(load-global <dest> (global <name>))
(store-global (global <name>) <src>)
```

编码：

```text
0x0a load-global       dest <var> target <global>
0x0b store-global      target <global> src <var>
```

修正说明：

- `load-global`：`target` 产生 `(fixup global-pointer <name>)`
- `store-global`：`target` 产生 `(fixup global-pointer <name>)`

# 函数调用

模仿 System V AMD64 ABI 函数调用参数个数的限制，
参数个数最多为 6。

调用结果返回「结果寄存器」，调用后跟一条 `load-result`。

## 静态调用

```xvm-lisp
(call-0 (fn <name>))
(call-1 (fn <name>) <arg1>)
(call-2 (fn <name>) <arg1> <arg2>)
(call-3 (fn <name>) <arg1> <arg2> <arg3>)
(call-4 (fn <name>) <arg1> <arg2> <arg3> <arg4>)
(call-5 (fn <name>) <arg1> <arg2> <arg3> <arg4> <arg5>)
(call-6 (fn <name>) <arg1> <arg2> <arg3> <arg4> <arg5> <arg6>)

(call-prim-0 (prim <name>))
(call-prim-1 (prim <name>) <arg1>)
(call-prim-2 (prim <name>) <arg1> <arg2>)
(call-prim-3 (prim <name>) <arg1> <arg2> <arg3>)
(call-prim-4 (prim <name>) <arg1> <arg2> <arg3> <arg4>)
(call-prim-5 (prim <name>) <arg1> <arg2> <arg3> <arg4> <arg5>)
(call-prim-6 (prim <name>) <arg1> <arg2> <arg3> <arg4> <arg5> <arg6>)

(tail-call-0 (fn <name>))
(tail-call-1 (fn <name>) <arg1>)
(tail-call-2 (fn <name>) <arg1> <arg2>)
(tail-call-3 (fn <name>) <arg1> <arg2> <arg3>)
(tail-call-4 (fn <name>) <arg1> <arg2> <arg3> <arg4>)
(tail-call-5 (fn <name>) <arg1> <arg2> <arg3> <arg4> <arg5>)
(tail-call-6 (fn <name>) <arg1> <arg2> <arg3> <arg4> <arg5> <arg6>)

(tail-call-prim-0 (prim <name>))
(tail-call-prim-1 (prim <name>) <arg1>)
(tail-call-prim-2 (prim <name>) <arg1> <arg2>)
(tail-call-prim-3 (prim <name>) <arg1> <arg2> <arg3>)
(tail-call-prim-4 (prim <name>) <arg1> <arg2> <arg3> <arg4>)
(tail-call-prim-5 (prim <name>) <arg1> <arg2> <arg3> <arg4> <arg5>)
(tail-call-prim-6 (prim <name>) <arg1> <arg2> <arg3> <arg4> <arg5> <arg6>)
```

编码：

```text
0x10 call-0             target <fn>
0x11 call-1             target <fn> arg1 <var>
0x12 call-2             target <fn> arg1 <var> arg2 <var>
0x13 call-3             target <fn> arg1 <var> arg2 <var> arg3 <var>
0x14 call-4             target <fn> arg1 <var> arg2 <var> arg3 <var> arg4 <var>
0x15 call-5             target <fn> arg1 <var> arg2 <var> arg3 <var> arg4 <var> arg5 <var>
0x16 call-6             target <fn> arg1 <var> arg2 <var> arg3 <var> arg4 <var> arg5 <var> arg6 <var>
0x17 call-prim-0        target <prim>
0x18 call-prim-1        target <prim> arg1 <var>
0x19 call-prim-2        target <prim> arg1 <var> arg2 <var>
0x1a call-prim-3        target <prim> arg1 <var> arg2 <var> arg3 <var>
0x1b call-prim-4        target <prim> arg1 <var> arg2 <var> arg3 <var> arg4 <var>
0x1c call-prim-5        target <prim> arg1 <var> arg2 <var> arg3 <var> arg4 <var> arg5 <var>
0x1d call-prim-6        target <prim> arg1 <var> arg2 <var> arg3 <var> arg4 <var> arg5 <var> arg6 <var>
0x1e tail-call-0        target <fn>
0x1f tail-call-1        target <fn> arg1 <var>
0x20 tail-call-2        target <fn> arg1 <var> arg2 <var>
0x21 tail-call-3        target <fn> arg1 <var> arg2 <var> arg3 <var>
0x22 tail-call-4        target <fn> arg1 <var> arg2 <var> arg3 <var> arg4 <var>
0x23 tail-call-5        target <fn> arg1 <var> arg2 <var> arg3 <var> arg4 <var> arg5 <var>
0x24 tail-call-6        target <fn> arg1 <var> arg2 <var> arg3 <var> arg4 <var> arg5 <var> arg6 <var>
0x25 tail-call-prim-0   target <prim>
0x26 tail-call-prim-1   target <prim> arg1 <var>
0x27 tail-call-prim-2   target <prim> arg1 <var> arg2 <var>
0x28 tail-call-prim-3   target <prim> arg1 <var> arg2 <var> arg3 <var>
0x29 tail-call-prim-4   target <prim> arg1 <var> arg2 <var> arg3 <var> arg4 <var>
0x2a tail-call-prim-5   target <prim> arg1 <var> arg2 <var> arg3 <var> arg4 <var> arg5 <var>
0x2b tail-call-prim-6   target <prim> arg1 <var> arg2 <var> arg3 <var> arg4 <var> arg5 <var> arg6 <var>
```

修正说明：

- `call-n` / `tail-call-n`：`target` 产生 `(fixup fn-pointer <name>)`
- `call-prim-n` / `tail-call-prim-n`：`target` 产生 `(fixup prim-pointer <name>)`

## 动态调用

```xvm-lisp
(apply-0 <target>)
(apply-1 <target> <arg1>)
(apply-2 <target> <arg1> <arg2>)
(apply-3 <target> <arg1> <arg2> <arg3>)
(apply-4 <target> <arg1> <arg2> <arg3> <arg4>)
(apply-5 <target> <arg1> <arg2> <arg3> <arg4> <arg5>)
(apply-6 <target> <arg1> <arg2> <arg3> <arg4> <arg5> <arg6>)

(tail-apply-0 <target>)
(tail-apply-1 <target> <arg1>)
(tail-apply-2 <target> <arg1> <arg2>)
(tail-apply-3 <target> <arg1> <arg2> <arg3>)
(tail-apply-4 <target> <arg1> <arg2> <arg3> <arg4>)
(tail-apply-5 <target> <arg1> <arg2> <arg3> <arg4> <arg5>)
(tail-apply-6 <target> <arg1> <arg2> <arg3> <arg4> <arg5> <arg6>)
```

操作数 `<target>` 和 `<arg{n}>` 都代表局部变量，
且 `<target>` 所保存的必须是 closure。

编码：

```text
0x2c apply-0            target <var>
0x2d apply-1            target <var> arg1 <var>
0x2e apply-2            target <var> arg1 <var> arg2 <var>
0x2f apply-3            target <var> arg1 <var> arg2 <var> arg3 <var>
0x30 apply-4            target <var> arg1 <var> arg2 <var> arg3 <var> arg4 <var>
0x31 apply-5            target <var> arg1 <var> arg2 <var> arg3 <var> arg4 <var> arg5 <var>
0x32 apply-6            target <var> arg1 <var> arg2 <var> arg3 <var> arg4 <var> arg5 <var> arg6 <var>
0x33 tail-apply-0       target <var>
0x34 tail-apply-1       target <var> arg1 <var>
0x35 tail-apply-2       target <var> arg1 <var> arg2 <var>
0x36 tail-apply-3       target <var> arg1 <var> arg2 <var> arg3 <var>
0x37 tail-apply-4       target <var> arg1 <var> arg2 <var> arg3 <var> arg4 <var>
0x38 tail-apply-5       target <var> arg1 <var> arg2 <var> arg3 <var> arg4 <var> arg5 <var>
0x39 tail-apply-6       target <var> arg1 <var> arg2 <var> arg3 <var> arg4 <var> arg5 <var> arg6 <var>
```

# 结果寄存器

```xvm-lisp
(load-result <dest>)
```

从返回寄存器取回最近一次 `call-n` / `call-prim-n` / `apply-n` 的结果。

例如：

```xvm-lisp
(call-1 (fn factorial) n)
(load-result result)
```

副作函数，如果想要丢弃结果，不写 `load-result` 即可。

编码：

```text
0x09 load-result       dest <var>
```

# 控制流

```xvm-lisp
(goto (label <name>))
(branch <cond> (label <name>) (label <name>))
(return <src>)
(return-void)
```

操作数 `<cond>` 是局部变量，且所保存的必须是 bool 值。

编码：

```text
0x40 goto              target <label>
0x41 branch            cond <var> then <label> else <label>
0x42 return            src <var>
0x43 return-void       -
```

`label` / `then-label` / `else-label` 都是相对当前指令结束位置的偏移；偏移在汇编时解析，不产生修正。

# 整数运算

```xvm-lisp
(iadd <dest> <src1> <src2>)
(isub <dest> <src1> <src2>)
(imul <dest> <src1> <src2>)
(idiv <dest> <src1> <src2>)
(imod <dest> <src1> <src2>)
(ineg <dest> <src>)
(int-greater <dest> <src1> <src2>)
(int-less <dest> <src1> <src2>)
(int-greater-or-equal <dest> <src1> <src2>)
(int-less-or-equal <dest> <src1> <src2>)
(int-is-positive <dest> <src>)
(int-is-non-negative <dest> <src>)
(int-is-non-zero <dest> <src>)
```

编码：

```text
0x50 iadd                 dest <var> src1 <var> src2 <var>
0x51 isub                 dest <var> src1 <var> src2 <var>
0x52 imul                 dest <var> src1 <var> src2 <var>
0x53 idiv                 dest <var> src1 <var> src2 <var>
0x54 imod                 dest <var> src1 <var> src2 <var>
0x55 ineg                 dest <var> src <var>
0x58 int-greater          dest <var> src1 <var> src2 <var>
0x59 int-less             dest <var> src1 <var> src2 <var>
0x5a int-greater-or-equal dest <var> src1 <var> src2 <var>
0x5b int-less-or-equal    dest <var> src1 <var> src2 <var>
0x5c int-is-positive      dest <var> src <var>
0x5d int-is-non-negative  dest <var> src <var>
0x5e int-is-non-zero      dest <var> src <var>
```

# 浮点运算

```xvm-lisp
(fadd <dest> <src1> <src2>)
(fsub <dest> <src1> <src2>)
(fmul <dest> <src1> <src2>)
(fdiv <dest> <src1> <src2>)
(fneg <dest> <src>)
(float-greater <dest> <src1> <src2>)
(float-less <dest> <src1> <src2>)
(float-greater-or-equal <dest> <src1> <src2>)
(float-less-or-equal <dest> <src1> <src2>)
(float-is-positive <dest> <src>)
(float-is-non-negative <dest> <src>)
(float-is-non-zero <dest> <src>)
```

编码：

```text
0x70 fadd                 dest <var> src1 <var> src2 <var>
0x71 fsub                 dest <var> src1 <var> src2 <var>
0x72 fmul                 dest <var> src1 <var> src2 <var>
0x73 fdiv                 dest <var> src1 <var> src2 <var>
0x74 fneg                 dest <var> src <var>
0x78 float-greater        dest <var> src1 <var> src2 <var>
0x79 float-less           dest <var> src1 <var> src2 <var>
0x7a float-greater-or-equal dest <var> src1 <var> src2 <var>
0x7b float-less-or-equal  dest <var> src1 <var> src2 <var>
0x7c float-is-positive    dest <var> src <var>
0x7d float-is-non-negative dest <var> src <var>
0x7e float-is-non-zero    dest <var> src <var>
```
