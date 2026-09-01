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
  - [0x14 fixup](#0x14-fixup)
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
| `0x14` | 修正条目               |

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
- `code` 是函数体字节码，编码见 [instructions.md](instructions.md)。
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

## 0x14 fixup

一个修正是独立的一个 TLV entry。

```
u32 type_offset
u32 name_offset
u32 dest_type_offset
u32 dest_name_offset
u32 dest_offset
```

其中：

- `type` 是修正类型字符串。
- `name` 是目标符号或字面量内容。
- `dest-type` 是目标容器类型；目前只有 `function`。
- `dest-name` 是目标容器名；当 `dest-type = function` 时，它是函数名。
- `dest-offset` 是目标容器内字节偏移；当 `dest-type = function` 时，它是该函数 `code` 内的偏移。

`dest-offset` 指向代码中一个 8 字节的占位符。
loader 根据 `type` 和 `name` 计算出要填入的值，并写入该位置。

修正类型：

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

# 加载流程

1. 扫描所有 TLV entry。
2. 找到 string table，建立 offset 映射。
3. 收集 function / variable / primitive declarations，构建 `mod_t`。
4. 收集所有修正条目。
5. 根据修正条目：
   - 找到 `dest-name` 对应的 function。
   - 在其 `code` 的 `dest-offset` 处写入：
     - 对 `fn-pointer` / `prim-pointer` / `global-pointer`：对应的 function pointer / primitive function pointer / global variable pointer。
     - 对 `string-value` / `symbol-value`：对应的 string value / symbol value。
     - `load-closure` / `make-closure` 通过 `fn-pointer` 构造 closure value。
6. 入口固定为 `main` / `test`；也可由运行时 `--entry` 显式指定。

# 设计不变量

- 所有指令的操作数个数固定。
- `apply-n` / `tail-apply-n` 的 target 必须是 closure。
- fn / prim 不作为可动态 apply 的值存在；只作为静态引用：
  - `fn-pointer` 用于 `call-n` / `tail-call-n` / `load-closure` / `make-closure`
  - `prim-pointer` 用于 `call-prim-n` / `tail-call-prim-n`
  - primitive 必须先转换为其 wrap 函数，才能作为 `load-closure` / `make-closure` 的 `fn-pointer` 来源
- 无环境 closure 用 `load-closure` 构造，可优化为修正。
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
- 修正：本例没有外部引用，所以没有修正条目。
