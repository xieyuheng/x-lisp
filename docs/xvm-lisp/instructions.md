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
0x01 move              u16 dest u16 src
0x02 load-int          u16 dest u64 value
0x03 load-float        u16 dest u64 value
0x04 load-string       u16 dest u64 value
0x05 load-symbol       u16 dest u64 value
```

修正说明：

- `load-string`：`value` 产生 `(fixup string-value <name>)`
- `load-symbol`：`value` 产生 `(fixup symbol-value <name>)`

# 闭包

```xvm-lisp
(load-closure <dest> (fn <name>))
(make-closure <dest> (fn <name>) <size>)
(store-closure-arg <closure> <index> <src>)
```

- `load-closure`：加载无环境的 closure。
- `make-closure`：创建带环境的 closure，参数个数为 `<size>`。
- `store-closure-arg`：存 closure 的参数。

编码：

```text
0x06 load-closure      u16 dest u64 target
0x07 make-closure      u16 dest u64 target u16 size
0x08 store-closure-arg u16 closure u16 index u16 value
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
0x0a load-global       u16 dest u64 target
0x0b store-global      u64 target u16 src
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
0x10 call-0             u64 target
0x11 call-1             u64 target u16 arg1
0x12 call-2             u64 target u16 arg1 u16 arg2
0x13 call-3             u64 target u16 arg1 u16 arg2 u16 arg3
0x14 call-4             u64 target u16 arg1 u16 arg2 u16 arg3 u16 arg4
0x15 call-5             u64 target u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5
0x16 call-6             u64 target u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5 u16 arg6
0x17 call-prim-0        u64 target
0x18 call-prim-1        u64 target u16 arg1
0x19 call-prim-2        u64 target u16 arg1 u16 arg2
0x1a call-prim-3        u64 target u16 arg1 u16 arg2 u16 arg3
0x1b call-prim-4        u64 target u16 arg1 u16 arg2 u16 arg3 u16 arg4
0x1c call-prim-5        u64 target u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5
0x1d call-prim-6        u64 target u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5 u16 arg6
0x1e tail-call-0        u64 target
0x1f tail-call-1        u64 target u16 arg1
0x20 tail-call-2        u64 target u16 arg1 u16 arg2
0x21 tail-call-3        u64 target u16 arg1 u16 arg2 u16 arg3
0x22 tail-call-4        u64 target u16 arg1 u16 arg2 u16 arg3 u16 arg4
0x23 tail-call-5        u64 target u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5
0x24 tail-call-6        u64 target u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5 u16 arg6
0x25 tail-call-prim-0   u64 target
0x26 tail-call-prim-1   u64 target u16 arg1
0x27 tail-call-prim-2   u64 target u16 arg1 u16 arg2
0x28 tail-call-prim-3   u64 target u16 arg1 u16 arg2 u16 arg3
0x29 tail-call-prim-4   u64 target u16 arg1 u16 arg2 u16 arg3 u16 arg4
0x2a tail-call-prim-5   u64 target u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5
0x2b tail-call-prim-6   u64 target u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5 u16 arg6
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
0x2c apply-0            u16 target
0x2d apply-1            u16 target u16 arg1
0x2e apply-2            u16 target u16 arg1 u16 arg2
0x2f apply-3            u16 target u16 arg1 u16 arg2 u16 arg3
0x30 apply-4            u16 target u16 arg1 u16 arg2 u16 arg3 u16 arg4
0x31 apply-5            u16 target u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5
0x32 apply-6            u16 target u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5 u16 arg6
0x33 tail-apply-0       u16 target
0x34 tail-apply-1       u16 target u16 arg1
0x35 tail-apply-2       u16 target u16 arg1 u16 arg2
0x36 tail-apply-3       u16 target u16 arg1 u16 arg2 u16 arg3
0x37 tail-apply-4       u16 target u16 arg1 u16 arg2 u16 arg3 u16 arg4
0x38 tail-apply-5       u16 target u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5
0x39 tail-apply-6       u16 target u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5 u16 arg6
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
0x09 load-result       u16 dest
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
0x40 goto              i32 label
0x41 branch            u16 cond i32 then-label i32 else-label
0x42 return            u16 src
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
0x50 iadd                 u16 dest u16 src1 u16 src2
0x51 isub                 u16 dest u16 src1 u16 src2
0x52 imul                 u16 dest u16 src1 u16 src2
0x53 idiv                 u16 dest u16 src1 u16 src2
0x54 imod                 u16 dest u16 src1 u16 src2
0x55 ineg                 u16 dest u16 src
0x58 int-greater          u16 dest u16 src1 u16 src2
0x59 int-less             u16 dest u16 src1 u16 src2
0x5a int-greater-or-equal u16 dest u16 src1 u16 src2
0x5b int-less-or-equal    u16 dest u16 src1 u16 src2
0x5c int-is-positive      u16 dest u16 src
0x5d int-is-non-negative  u16 dest u16 src
0x5e int-is-non-zero      u16 dest u16 src
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
0x70 fadd                   u16 dest u16 src1 u16 src2
0x71 fsub                   u16 dest u16 src1 u16 src2
0x72 fmul                   u16 dest u16 src1 u16 src2
0x73 fdiv                   u16 dest u16 src1 u16 src2
0x74 fneg                   u16 dest u16 src
0x78 float-greater          u16 dest u16 src1 u16 src2
0x79 float-less             u16 dest u16 src1 u16 src2
0x7a float-greater-or-equal u16 dest u16 src1 u16 src2
0x7b float-less-or-equal    u16 dest u16 src1 u16 src2
0x7c float-is-positive      u16 dest u16 src
0x7d float-is-non-negative  u16 dest u16 src
0x7e float-is-non-zero      u16 dest u16 src
```
