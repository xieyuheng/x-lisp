---
title: 可执行文件
---

# 目录

- [标长值](#标长值)
- [标签分配](#标签分配)
- [条目明细](#条目明细)
  - [0x01 name table](#0x01-name-table)
  - [0x10 function definition](#0x10-function-definition)
  - [0x11 variable declaration](#0x11-variable-declaration)
  - [0x12 primitive function declaration](#0x12-primitive-function-declaration)
  - [0x13 primitive variable declaration](#0x13-primitive-variable-declaration)
  - [0x14 fixup](#0x14-fixup)
- [加载流程](#加载流程)

# 标长值

一个 `.xvm.exe` 可执行文件由**标长值（TLV）**条目的序列组成。

- 基于 [标长值（TLV）](../../diary/2026-08-27-tlv.md)。
- 加载器按**标签（tag）**收集已知条目，忽略未知条目。

标长值条目格式如下：

```
u8  tag
u32 length
u8  value[length]
```

# 标签分配

| 标签   | 含义                           |
|--------|--------------------------------|
| `0x01` | name table                     |
| `0x10` | function definition            |
| `0x11` | variable declaration           |
| `0x12` | primitive function declaration |
| `0x13` | primitive variable declaration |
| `0x14` | fixup entry                    |

说明：

- `0x00` 到 `0x0f` 保留。
  其中：
  - `0x00` 为注释
  - `0x01` 为 name table

- xvm2 自定义 tag 从 `0x10` 开始。

# 条目明细

下面详细介绍各个条目的值。

## 0x01 name table

其值是若干字符串（C string）的连续拼接。

- 其他条目需要使用「名字」时，可以用 `u32 offset` 指向 name table 中的字符串。
- 所有字符串在表内唯一，因此可以用 `offset` 来判断 name 是否相等。
- 加载器先加载 name table，来获得「名字」的 `offset` 所对应的具体字符串。

## 0x10 function definition

```
u32 name_offset
u16 arity
u16 local_count
u32 code_length
u8  code[code_length]
```

- `name_offset` 指向 name table 中的函数名。
- `arity` 是参数个数。
- `local_count` 是局部槽位数。
- `code` 是函数体字节码，编码见 [指令](instructions.md)。
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

一个修正是独立的一个条目（而不是有一个「修正表条目」）。

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
- `dest_type` 是目标容器类型。
- `dest_name` 是目标容器名。
- `dest_offset` 是目标容器内字节偏移。

目前 `dest_type` 类型（目前只有一个）：

| `dest_type` | `dest_name` 的含义 | `dest_offset` 的含义 |
|-------------|--------------------|----------------------|
| `function`  | 函数名             | 函数 `code` 内的偏移 |

`dest_offset` 指向代码中一个 8 字节的占位符。
加载器根据 `type` 和 `name` 计算出要填入的值，并写入该位置。

修正类型：

| `type`           | `name` 的含义 | 填入                       |
|------------------|---------------|----------------------------|
| `string-value`   | 字符串内容    | string value               |
| `symbol-value`   | symbol 名     | symbol value               |
| `fn-pointer`     | 函数名        | function pointer           |
| `prim-pointer`   | primitive 名  | primitive function pointer |
| `global-pointer` | 全局变量名    | global variable pointer    |

说明：

- `string-value` 用于：`load-string` 的 `value`
- `symbol-value` 用于：`load-symbol` 的 `value`
- `fn-pointer` 用于：
  - `call-n` / `tail-call-n` 的 `target`
  - `load-closure` / `make-closure` 的 `target`
- `prim-pointer` 用于：
  - `call-prim-n` / `tail-call-prim-n` 的 `target`

# 加载流程

- 扫描所有标长值条目。
- 找到 name table，建立 offset 映射。
- 收集 primitive declaration 条目。
- 收集 function / variable definition 条目。
- 收集 fixup 条目。
- 根据修正条目：
  - 找到 `dest_name` 对应的 function。
  - 在其 `code` 的 `dest_offset` 处执行修补。
- 运行 `main` 或 `test` 函数。
