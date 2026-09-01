---
title: 指令
---

# 加载

```xvm-lisp
(load-int <dest> <int>)
(load-float <dest> <float>)
(load-string <dest> <string>)
(load-symbol <dest> <symbol>)
(move <dest> <src>)
```

操作数 `<dest>` 和 `<src>` 都代表局部变量。

# 闭包

```xvm-lisp
(load-closure <dest> (fn <name>))
(make-closure <dest> (fn <name>) <size>)
(store-closure-arg <dest-closure> <index> <src>)
```

- `load-closure`：加载无环境的 closure，可以实现为 fixup。
- `make-closure`：创建带环境的 closure，参数个数为 `<size>`。
- `store-closure-arg`：存 closure 的参数。

# 全局变量

```xvm-lisp
(load-global <dest> (global <name>))
(store-global (global <name>) <src>)
```

# 函数调用

模仿 System V AMD64 ABI 函数调用参数个数的限制，
参数个数最多为 6。

调用结果返回「结果寄存器」，调用后跟一条 `load-result`。

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

# 控制流

```xvm-lisp
(goto (label <name>))
(branch <cond> (label <name>) (label <name>))
(return <src>)
(return-void)
```

操作数 `<cond>` 是局部变量，且所保存的必须是 bool 值。

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
