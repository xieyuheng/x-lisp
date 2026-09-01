---
title: 指令编码
---

## 通用规则

- 局部槽号一律为 `u16`。
- TLV entry 内的 `name_offset` / `type_offset` 等字符串引用使用 string table 的 `u32 offset`。
- 指令中的可修正字段在文件里是 8 字节占位符；loader patch 后变成运行时指针或 `value_t`。
- label 偏移已在汇编时解析为 `i32`，不通过修正。
- **每个指令的操作数个数固定**；`call-n`、`call-prim-n`、`apply-n` 等指令的 arity 由 opcode 决定，不在指令内额外保存 `argc`。

## opcode 表

### 数据传送

```text
0x01 move              u16 dest u16 src
0x02 load-int          u16 dest i64 value
0x03 load-float        u16 dest f64 value
0x04 load-string       u16 dest u64 value
0x05 load-symbol       u16 dest u64 value
0x09 load-result       u16 dest
0x0a load-global       u16 dest u64 target
0x0b store-global      u64 target u16 src
```

### Closure

```text
0x06 load-closure      u16 dest u64 target
0x07 make-closure      u16 dest u64 target u16 size
0x08 store-closure-arg u16 closure u16 index u16 value
```

### 静态调用

```text
0x10 call-0             u64 target
0x11 call-1             u64 target u16 arg0
0x12 call-2             u64 target u16 arg0 u16 arg1
0x13 call-3             u64 target u16 arg0 u16 arg1 u16 arg2
0x14 call-4             u64 target u16 arg0 u16 arg1 u16 arg2 u16 arg3
0x15 call-5             u64 target u16 arg0 u16 arg1 u16 arg2 u16 arg3 u16 arg4
0x16 call-6             u64 target u16 arg0 u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5
0x17 call-prim-0        u64 target
0x18 call-prim-1        u64 target u16 arg0
0x19 call-prim-2        u64 target u16 arg0 u16 arg1
0x1a call-prim-3        u64 target u16 arg0 u16 arg1 u16 arg2
0x1b call-prim-4        u64 target u16 arg0 u16 arg1 u16 arg2 u16 arg3
0x1c call-prim-5        u64 target u16 arg0 u16 arg1 u16 arg2 u16 arg3 u16 arg4
0x1d call-prim-6        u64 target u16 arg0 u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5
0x1e tail-call-0        u64 target
0x1f tail-call-1        u64 target u16 arg0
0x20 tail-call-2        u64 target u16 arg0 u16 arg1
0x21 tail-call-3        u64 target u16 arg0 u16 arg1 u16 arg2
0x22 tail-call-4        u64 target u16 arg0 u16 arg1 u16 arg2 u16 arg3
0x23 tail-call-5        u64 target u16 arg0 u16 arg1 u16 arg2 u16 arg3 u16 arg4
0x24 tail-call-6        u64 target u16 arg0 u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5
0x25 tail-call-prim-0   u64 target
0x26 tail-call-prim-1   u64 target u16 arg0
0x27 tail-call-prim-2   u64 target u16 arg0 u16 arg1
0x28 tail-call-prim-3   u64 target u16 arg0 u16 arg1 u16 arg2
0x29 tail-call-prim-4   u64 target u16 arg0 u16 arg1 u16 arg2 u16 arg3
0x2a tail-call-prim-5   u64 target u16 arg0 u16 arg1 u16 arg2 u16 arg3 u16 arg4
0x2b tail-call-prim-6   u64 target u16 arg0 u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5
```

### 动态调用

```text
0x2c apply-0            u16 target
0x2d apply-1            u16 target u16 arg0
0x2e apply-2            u16 target u16 arg0 u16 arg1
0x2f apply-3            u16 target u16 arg0 u16 arg1 u16 arg2
0x30 apply-4            u16 target u16 arg0 u16 arg1 u16 arg2 u16 arg3
0x31 apply-5            u16 target u16 arg0 u16 arg1 u16 arg2 u16 arg3 u16 arg4
0x32 apply-6            u16 target u16 arg0 u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5
0x33 tail-apply-0       u16 target
0x34 tail-apply-1       u16 target u16 arg0
0x35 tail-apply-2       u16 target u16 arg0 u16 arg1
0x36 tail-apply-3       u16 target u16 arg0 u16 arg1 u16 arg2
0x37 tail-apply-4       u16 target u16 arg0 u16 arg1 u16 arg2 u16 arg3
0x38 tail-apply-5       u16 target u16 arg0 u16 arg1 u16 arg2 u16 arg3 u16 arg4
0x39 tail-apply-6       u16 target u16 arg0 u16 arg1 u16 arg2 u16 arg3 u16 arg4 u16 arg5
```

### 控制流

```text
0x40 goto              i32 offset
0x41 branch            u16 cond i32 then i32 else
0x42 return            u16 src
0x43 return-void       -
```

### 整数运算

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

### 浮点运算

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

## `load-int`

```text
u16 dest
i64 value
```

`value` 是立即数，不产生修正。

## `load-float`

```text
u16 dest
f64 value
```

`value` 是立即数，不产生修正。

## `load-string`

```text
u16 dest
u64 value
```

`value` 产生 `type = string-value` 的修正。

## `load-symbol`

```text
u16 dest
u64 value
```

`value` 产生 `type = symbol-value` 的修正。

## `load-closure`

```text
u16 dest
u64 target
```

`target` 产生 `type = fn-pointer` 的修正。
loader 直接构造无环境 closure。
primitive 必须先转换为其 wrap 函数，再作为 `(fn ...)` 传入。

## `make-closure`

```text
u16 dest
u64 target
u16 size
```

- `target` 产生 `type = fn-pointer` 的修正。
- `size` 是环境槽数。
- primitive 必须先转换为其 wrap 函数，再作为 `(fn ...)` 传入。
- `make-closure` 只分配 closure，不填充环境；环境由 `store-closure-arg` 填充。

## `store-closure-arg`

```text
u16 closure
u16 index
u16 value
```

- `closure` 是 closure 所在槽。
- `index` 是环境槽下标。
- `value` 是要写入环境的值。
- 通过多次 `store-closure-arg` 填充环境，不引入可变操作数。

## `call-n` / `call-prim-n`

`call-n` 和 `call-prim-n` 的 operands 模式相同：

```text
u64 target
u16 arg0
...
u16 arg{n-1}
```

- `call-n` 的 `target` 是函数名，产生 `type = fn-pointer` 的修正。
- `call-prim-n` 的 `target` 是 primitive 函数名，产生 `type = prim-pointer` 的修正。
- 参数个数 `n` 由 opcode 决定。

## `tail-call-n` / `tail-call-prim-n`

```text
u64 target
u16 arg0
...
u16 arg{n-1}
```

- `tail-call-n` 的 `target` 产生 `type = fn-pointer`。
- `tail-call-prim-n` 的 `target` 产生 `type = prim-pointer`。
- 参数个数 `n` 由 opcode 决定。

## `apply-n` / `tail-apply-n`

```text
u16 target
u16 arg0
...
u16 arg{n-1}
```

`target` 是局部槽号，不产生修正。
`target` 必须是 closure，运行时不再分派 fn / prim / closure。
参数个数 `n` 由 opcode 决定。

## `branch`

```text
u16 cond
i32 then
i32 else
```

- `cond` 为 bool 值所在槽。
- `then` / `else` 是相对当前指令结束位置的偏移。
- 偏移在汇编时解析，不产生修正。
