---
title: 可执行文件格式
---

# 前言

本文定义 `.xvm2.exe` 可执行文件格式。

- 基于 [TLV](../../diary/2026-08-27-tlv.md)。
- loader 按 tag 收集已知 entry，忽略未知 entry。

# 目录

- [TLV 文件结构](#tlv-文件结构)
- [Tag 分配](#tag-分配)
- [Entry 格式](#entry-格式)
  - [0x01 string table](#0x01-string-table)
  - [0x10 function definition](#0x10-function-definition)
  - [0x11 variable declaration](#0x11-variable-declaration)
  - [0x12 primitive function declaration](#0x12-primitive-function-declaration)
  - [0x13 primitive variable declaration](#0x13-primitive-variable-declaration)
  - [0x14 default entry](#0x14-default-entry)
  - [0x15 relocation](#0x15-relocation)
- [指令集编码](#指令集编码)
- [加载流程](#加载流程)
- [示例](#示例)

# TLV 文件结构

一个 `.xvm2.exe` 可执行文件由 TLV entry 序列组成。

一个 TLV entry 的格式如下：

```
u8  tag
u32 length
u8  value[length]
```

# Tag 分配

| tag    | 含义                           |
|--------|--------------------------------|
| `0x01` | string table                   |
| `0x10` | function definition            |
| `0x11` | variable declaration           |
| `0x12` | primitive function declaration |
| `0x13` | primitive variable declaration |
| `0x14` | default entry                  |
| `0x15` | relocation entry               |

说明：

- `0x00` 到 `0x0f` 保留；其中 `0x01` 为通用 string table。
- xvm2 自定义 tag 从 `0x10` 开始。

# Entry 格式

## 0x01 string table

value 是若干 C string 的连续拼接。
所有字符串在表内唯一。
其他 entry 使用 `u32 offset` 指向字符串在 string table 中的起始字节偏移。
loader 加载时先建立 `offset -> string` 映射。

## 0x10 function definition

```
u32 name_offset
u16 arity
u16 local_count
u32 code_length
u8  code[code_length]
```

- `name_offset` 指向 string table 中的函数名。
- `arity` 是参数个数。
- `local_count` 是局部槽位数。
- `code` 是函数体字节码，编码见[指令集编码](#指令集编码)。
- 函数的入口是 `code` 的第一个字节。

## 0x11 variable declaration

```
u32 name_offset
```

声明全局变量。变量初值不在此处编码，由 setup 函数在运行时初始化。

## 0x12 primitive function declaration

```
u32 name_offset
```

## 0x13 primitive variable declaration

```
u32 name_offset
```

## 0x14 default entry

```
u32 name_offset
```

指定程序入口函数名。

## 0x15 relocation

一个 relocation 是独立的一个 TLV entry。

```
u32 type_offset
u32 name_offset
u32 dest_type_offset
u32 dest_name_offset
u32 dest_offset
```

其中：

- `type` 是 relocation 类型字符串。
- `name` 是目标符号或字面量内容。
- `dest-type` 是目标容器类型；目前只有 `function`。
- `dest-name` 是目标容器名；当 `dest-type = function` 时，它是函数名。
- `dest-offset` 是目标容器内字节偏移；当 `dest-type = function` 时，它是该函数 `code` 内的偏移。

`dest-offset` 指向代码中一个 8 字节的占位符。
loader 根据 `type` 和 `name` 计算出要填入的值，并写入该位置。

Relocation 类型：

| type             | name 的含义  | loader 填入                      |
|------------------|--------------|----------------------------------|
| `string-value`   | 字符串内容   | string value，用于 `load-string` |
| `symbol-value`   | symbol 名    | symbol value，用于 `load-symbol` |
| `fn-pointer`     | 函数名       | function pointer                 |
| `prim-pointer`   | primitive 名 | primitive function pointer       |
| `global-pointer` | 全局变量名   | global variable pointer          |

`fn-pointer` 用于：

- `call-n` / `tail-call-n` 的 target
- `load-closure` / `make-closure` 的 target

`prim-pointer` 用于：

- `call-prim-n` / `tail-call-prim-n` 的 target

primitive 不能直接作为 closure 的来源；必须先转换为其 wrap 函数，再使用 `fn-pointer`。

# 指令集编码

## 通用规则

- 局部槽号一律为 `u16`。
- TLV entry 内的 `name_offset` / `type_offset` 等字符串引用使用 string table 的 `u32 offset`。
- 指令中的可重定位字段在文件里是 8 字节占位符；loader patch 后变成运行时指针或 `value_t`。
- label 偏移已在汇编时解析为 `i32`，不通过 relocation 解析。
- **每个指令的操作数个数固定**；`call-n`、`call-prim-n`、`apply-n` 等指令的 arity 由 opcode 决定，不在指令内额外保存 `argc`。

## opcode 表

| `0x01` | `move`                   | `u16 dest` `u16 src`                                                           |
| `0x02` | `load-int`               | `u16 dest` `i64 value`                                                         |
| `0x03` | `load-float`             | `u16 dest` `f64 value`                                                         |
| `0x04` | `load-string`            | `u16 dest` `u64 value`                                                         |
| `0x05` | `load-symbol`            | `u16 dest` `u64 value`                                                         |
| `0x06` | `load-closure`           | `u16 dest` `u64 target`                                                        |
| `0x07` | `make-closure`           | `u16 dest` `u64 target` `u16 size`                                             |
| `0x08` | `store-closure-arg`      | `u16 closure` `u16 index` `u16 value`                                          |
| `0x09` | `load-result`            | `u16 dest`                                                                     |
| `0x0a` | `load-global`            | `u16 dest` `u64 target`                                                        |
| `0x0b` | `store-global`           | `u64 target` `u16 src`                                                         |
| `0x10` | `call-0`                 | `u64 target`                                                                   |
| `0x11` | `call-1`                 | `u64 target` `u16 arg0`                                                        |
| `0x12` | `call-2`                 | `u64 target` `u16 arg0` `u16 arg1`                                             |
| `0x13` | `call-3`                 | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2`                                  |
| `0x14` | `call-4`                 | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3`                       |
| `0x15` | `call-5`                 | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3` `u16 arg4`            |
| `0x16` | `call-6`                 | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3` `u16 arg4` `u16 arg5` |
| `0x17` | `call-prim-0`            | `u64 target`                                                                   |
| `0x18` | `call-prim-1`            | `u64 target` `u16 arg0`                                                        |
| `0x19` | `call-prim-2`            | `u64 target` `u16 arg0` `u16 arg1`                                             |
| `0x1a` | `call-prim-3`            | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2`                                  |
| `0x1b` | `call-prim-4`            | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3`                       |
| `0x1c` | `call-prim-5`            | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3` `u16 arg4`            |
| `0x1d` | `call-prim-6`            | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3` `u16 arg4` `u16 arg5` |
| `0x1e` | `tail-call-0`            | `u64 target`                                                                   |
| `0x1f` | `tail-call-1`            | `u64 target` `u16 arg0`                                                        |
| `0x20` | `tail-call-2`            | `u64 target` `u16 arg0` `u16 arg1`                                             |
| `0x21` | `tail-call-3`            | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2`                                  |
| `0x22` | `tail-call-4`            | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3`                       |
| `0x23` | `tail-call-5`            | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3` `u16 arg4`            |
| `0x24` | `tail-call-6`            | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3` `u16 arg4` `u16 arg5` |
| `0x25` | `tail-call-prim-0`       | `u64 target`                                                                   |
| `0x26` | `tail-call-prim-1`       | `u64 target` `u16 arg0`                                                        |
| `0x27` | `tail-call-prim-2`       | `u64 target` `u16 arg0` `u16 arg1`                                             |
| `0x28` | `tail-call-prim-3`       | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2`                                  |
| `0x29` | `tail-call-prim-4`       | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3`                       |
| `0x2a` | `tail-call-prim-5`       | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3` `u16 arg4`            |
| `0x2b` | `tail-call-prim-6`       | `u64 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3` `u16 arg4` `u16 arg5` |
| `0x2c` | `apply-0`                | `u16 target`                                                                   |
| `0x2d` | `apply-1`                | `u16 target` `u16 arg0`                                                        |
| `0x2e` | `apply-2`                | `u16 target` `u16 arg0` `u16 arg1`                                             |
| `0x2f` | `apply-3`                | `u16 target` `u16 arg0` `u16 arg1` `u16 arg2`                                  |
| `0x30` | `apply-4`                | `u16 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3`                       |
| `0x31` | `apply-5`                | `u16 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3` `u16 arg4`            |
| `0x32` | `apply-6`                | `u16 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3` `u16 arg4` `u16 arg5` |
| `0x33` | `tail-apply-0`           | `u16 target`                                                                   |
| `0x34` | `tail-apply-1`           | `u16 target` `u16 arg0`                                                        |
| `0x35` | `tail-apply-2`           | `u16 target` `u16 arg0` `u16 arg1`                                             |
| `0x36` | `tail-apply-3`           | `u16 target` `u16 arg0` `u16 arg1` `u16 arg2`                                  |
| `0x37` | `tail-apply-4`           | `u16 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3`                       |
| `0x38` | `tail-apply-5`           | `u16 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3` `u16 arg4`            |
| `0x39` | `tail-apply-6`           | `u16 target` `u16 arg0` `u16 arg1` `u16 arg2` `u16 arg3` `u16 arg4` `u16 arg5` |
| `0x40` | `goto`                   | `i32 offset`                                                                   |
| `0x41` | `branch`                 | `u16 cond` `i32 then` `i32 else`                                               |
| `0x42` | `return`                 | `u16 src`                                                                      |
| `0x43` | `return-void`            | 无                                                                             |
| `0x50` | `iadd`                   | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x51` | `isub`                   | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x52` | `imul`                   | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x53` | `idiv`                   | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x54` | `imod`                   | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x55` | `ineg`                   | `u16 dest` `u16 src`                                                           |
| `0x58` | `int-greater`            | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x59` | `int-less`               | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x5a` | `int-greater-or-equal`   | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x5b` | `int-less-or-equal`      | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x5c` | `int-is-positive`        | `u16 dest` `u16 src`                                                           |
| `0x5d` | `int-is-non-negative`    | `u16 dest` `u16 src`                                                           |
| `0x5e` | `int-is-non-zero`        | `u16 dest` `u16 src`                                                           |
| `0x70` | `fadd`                   | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x71` | `fsub`                   | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x72` | `fmul`                   | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x73` | `fdiv`                   | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x74` | `fneg`                   | `u16 dest` `u16 src`                                                           |
| `0x78` | `float-greater`          | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x79` | `float-less`             | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x7a` | `float-greater-or-equal` | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x7b` | `float-less-or-equal`    | `u16 dest` `u16 src1` `u16 src2`                                               |
| `0x7c` | `float-is-positive`      | `u16 dest` `u16 src`                                                           |
| `0x7d` | `float-is-non-negative`  | `u16 dest` `u16 src`                                                           |
| `0x7e` | `float-is-non-zero`      | `u16 dest` `u16 src`                                                           |

## `load-int`

```text
u16 dest
i64 value
```

`value` 是立即数，不产生 relocation。

## `load-float`

```text
u16 dest
f64 value
```

`value` 是立即数，不产生 relocation。

## `load-string`

```text
u16 dest
u64 value
```

`value` 产生 `type = string-value` 的 relocation。

## `load-symbol`

```text
u16 dest
u64 value
```

`value` 产生 `type = symbol-value` 的 relocation。

## `load-closure`

```text
u16 dest
u64 target
```

`target` 产生 `type = fn-pointer` 的 relocation。
loader 直接构造无环境 closure。
primitive 必须先转换为其 wrap 函数，再作为 `(fn ...)` 传入。

## `make-closure`

```text
u16 dest
u64 target
u16 size
```

- `target` 产生 `type = fn-pointer` 的 relocation。
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

- `call-n` 的 `target` 是函数名，产生 `type = fn-pointer` 的 relocation。
- `call-prim-n` 的 `target` 是 primitive 函数名，产生 `type = prim-pointer` 的 relocation。
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

`target` 是局部槽号，不产生 relocation。
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
- 偏移在汇编时解析，不产生 relocation。

# 加载流程

1. 扫描所有 TLV entry。
2. 找到 string table，建立 offset 映射。
3. 收集 function / variable / primitive declarations，构建 `mod_t`。
4. 收集所有 relocation entry。
5. 根据 relocation entry：
   - 找到 `dest-name` 对应的 function。
   - 在其 `code` 的 `dest-offset` 处写入：
     - 对 `fn-pointer` / `prim-pointer` / `global-pointer`：对应的 function pointer / primitive function pointer / global variable pointer。
     - 对 `string-value` / `symbol-value`：对应的 string value / symbol value。
     - `load-closure` / `make-closure` 通过 `fn-pointer` 构造 closure value。
6. 找到 default entry，设置程序入口。

# 设计不变量

- 所有指令的操作数个数固定。
- `apply-n` / `tail-apply-n` 的 target 必须是 closure。
- fn / prim 不作为可动态 apply 的值存在；只作为静态引用：
  - `fn-pointer` 用于 `call-n` / `tail-call-n` / `load-closure` / `make-closure`
  - `prim-pointer` 用于 `call-prim-n` / `tail-call-prim-n`
  - primitive 必须先转换为其 wrap 函数，才能作为 `load-closure` / `make-closure` 的 `fn-pointer` 来源
- 无环境 closure 用 `load-closure` 构造，可优化为 relocation。
- 带环境 closure 用 `make-closure` + `store-closure-arg` 构造。
- `make-closure` 不接受可变数量 env 参数，环境通过 `store-closure-arg` 逐个填充。

# 示例

假设 xvm-lisp：

```scheme
(define-function (main)
  (load-int x 1)
  (return x))
```

对应：

- string table：`"main"`、`"x"` 等。
- function definition：
  - `name = "main"`
  - `arity = 0`
  - `local_count = 1`
  - code 包含 `load-int` 和 `return`
- default entry：`"main"`
- relocation：本例没有外部引用，所以没有 relocation entry。
