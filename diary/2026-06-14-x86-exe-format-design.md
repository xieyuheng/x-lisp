---
title: x86.exe — 自研可执行文件格式设计
author: deepseek-v4-pro
date: 2026-06-14
---

# 前言

基于 2026-06-10 的汇编语言设计文档，设计 x86.exe 可执行文件格式。

目标：
- 极简、清晰、优雅的设计
- 功能足以支撑 meta-lisp 编译器
- 不依赖 ELF / PE 等已有格式
- 支持代码和数据分页，避免 W^X 冲突
- 支持内部重定位（pointer-t / string-t / metadata）
- 外部重定位预留
- header 预留足够扩展空间

# Header

64 字节。`code` 段从偏移 `0x40` 开始。

```
Offset  Size   Field                  Description
────────────────────────────────────────────────────────────
0x00    4B     magic                  'X' '8' '6' 0x00  (version 0)
0x04    4B     flags                  保留 (当前 0)
0x08    4B     code_size              代码段字节数
0x0c    4B     data_size              数据段字节数
0x10    4B     space_size             space 段字节数 (0 = 无)
0x14    4B     internal_reloc_count   internal relocation 条目数
0x18    4B     external_reloc_count   external relocation 条目数
0x1c    4B     entry_offset           入口相对 code 段首的偏移 (当前 0)
0x20    4B     value_reloc_count      value relocation 条目数
0x24   28B     reserved               预留，必须为 0
────────────────────────────────────────────────────────────
                                     → 64B total
```

**magic**：`'X' '8' '6'` + 1-byte version。version=0 表示当前格式。格式不兼容时递增。loader 检查 magic 和 version，不匹配则拒绝。

**flags**：4B 保留字段，当前必须为 0。未来用于声明可选特性（debug info、safepoint table、GC liveness map 等）。loader 遇非零 flags 时拒绝执行——保守策略确保未知特性不会被静默忽略。

**entry_offset**：`define-code` 可能有多个，入口默认为 code 段首 (`entry_offset=0`)。若编译器需要从非首函数入口，设置此字段。

**reserved**：28B，必须全零。未来可重新定义为新字段。loader 检查 reserved 全零，否则拒绝执行。

**向后兼容规则**：
- magic 不匹配 → 拒绝，报 `bad magic`
- flags 非零 → 拒绝，报 `unsupported flags`
- reserved（0x24..0x3F）非全零 → 拒绝，报 `unsupported version`

# 二进制布局

文件内容 = header + code + data + internal_relocs + external_relocs + value_relocs：

```
┌──────────┬─────────────────────────────────────────────────┐
│ 0x00..3f │ header (64B)                                   │
├──────────┼─────────────────────────────────────────────────┤
│ 0x40..   │ code[code_size]                ── mprotect RX  │
│          │ data[data_size]                ── 保持 RW      │
│          │ internal_relocs[count] × 8B                    │
│          │   uint32 offset                                │
│          │   uint32 target      (image 内偏移)              │
│          │ external_relocs[count] × 8B                    │
│          │   uint32 offset                                │
│          │   uint32 symbol_index                           │
│          │ value_relocs[count] × 12B                      │
│          │   uint32 patch_offset                          │
│          │   uint32 class_name_off                        │
│          │   uint32 arg_off                               │
└──────────┴─────────────────────────────────────────────────┘
```

- 重定位表在文件末尾，加载后不占运行时内存
- space 段**不写入文件**——零开销，仅通过 `space_size` 声明大小
- 运行时 image = code 段 + data 段 + space 段，三个区域连续映射

# 内存布局

```
┌──────────────┬───────────────┬──────────────────────┐
│ code 区域    │ data 区域      │ space 区域            │
│ (code_size   │ (data_size)   │ (space_size)         │
│  对齐到 4K)  │ RW            │ RW (mmap 已清零)      │
│ RX           │               │                      │
└──────────────┴───────────────┴──────────────────────┘
0               code_region     code_region            code_region
                (4K-aligned)    + data_size            + data_size
                                                       + space_size
```

- `mmap` 分配 `code_region + data_size + space_size` 字节
- `MAP_ANONYMOUS` 保证新页面已清零——space 段天然零初始化
- data 和 space 权限相同（RW），无需额外的 `mprotect`

# define-space 支持

多个 `define-space` 在 space 段内连续排列，汇编器求总和写入 `space_size`：

```lisp
(define-space buf1 256)   → space 段 offset 0
(define-space buf2 1024)  → space 段 offset 256
```

输出时 `space_size = 1280`，符号 `buf1` 和 `buf2` 作为 data label 记录对应偏移。

若 `buf1` 被 `pointer-t` 字段引用，生成 internal relocation：
```
target = code_region + data_size + 0   ← buf1 的绝对偏移
```

# 三类重定位

| | internal | external | value |
|---|---|---|---|
| 条目大小 | 8B (offset + target) | 8B (offset + index) | **12B (patch + class + arg)** |
| target 含义 | image 内偏移 | C 符号表索引 | **class name + 构造参数** |
| 汇编时解析 | 能（所有 symbol 位置已知） | 不能（C 函数地址未知） | 能（class name 和 arg 在汇编时已知） |
| 产生场景 | pointer-t / string-t 字段 / -8 slot | C 函数地址引用 | **symbol / keyword / string / definition 的 value_t** |
| loader 操作 | `base + target` | `symtab[index].addr` | **`make_value(class, arg)`** |

**三张独立 table，各自类型天然分离** — 不需要 kind 字段区分。

# Value Relocation Table

运行时才存在的 object value —— 如 `xstring`、`symbol`、`keyword`、`definition` ——
其 `value_t` 在编译时未知。value relocation table 让 loader 在加载阶段
根据 class name 和字符串参数创建这些 object，patch 到 data 段的 8 字节 slot 中。

**Entry 结构**（每条 12 字节）：

```
uint32 patch_offset      — 写入 value_t 的位置（image 内偏移）
uint32 class_name_off    — class 名字符串在 string table 中的偏移
uint32 arg_off           — 构造参数字符串在 string table 中的偏移
```

**支持的 class**：

| class name | loader 构造方式 |
|---|---|
| `"symbol"` | `x_object(intern_symbol(arg))` |
| `"keyword"` | `x_object(intern_keyword(arg))` |
| `"string"` | `x_object(make_static_xstring(arg))` |
| `"definition"` | `mod_lookup(arg)` → `x_object(def)`，若为 variable 则取 `def→variable.value` |

**Codegen 侧使用方式**：汇编器为每个 value reloc 在 data 段分配一个 8 字节 slot（初始为 0）。
代码中通过 `label-deref`（RIP-relative load）从 slot 中加载 `value_t`。

与 external reloc 的区别：
- `external-label` → 引用**已知地址的 C 符号**（函数指针、全局变量地址）→ external reloc
- `value reloc` → 需要**运行时创建的 tagged value_t** → value reloc

# 加载流程

```c
read_header() → code_size, data_size, space_size, internal_n, external_n, value_n

code_region = PAGE_ALIGN(code_size);
image_size  = code_region + data_size + space_size;
base        = mmap(image_size, RW);

memcpy(base,                code, code_size);
memcpy(base + code_region,  data, data_size);
// space: 无需操作 —— mmap 已清零

for internal_n:
    *(uint64*)(base + offset) = (uint64)(base + target);

for value_n:
    class = strtab[class_name_off]
    arg   = strtab[arg_off]
    if (string_equal(class, "symbol")) v = x_object(intern_symbol(arg))
    else if (string_equal(class, "keyword")) v = x_object(intern_keyword(arg))
    else if (string_equal(class, "string")) v = x_object(make_static_xstring(arg))
    else if (string_equal(class, "definition")) v = lookup_definition(mod, arg)
    *(uint64*)(base + patch_offset) = (uint64)v

for external_n:
    *(uint64*)(base + offset) = (uint64)symtab[index].addr;

// backward compat checks
if (flags != 0 || reserved_not_zero) error_and_exit();

code_pages = CEIL(code_size, PAGE_SIZE);
mprotect(base, code_pages * PAGE_SIZE, RX);

entry(base + entry_offset);
```

# 符号表

`meta-runtime.c` 中维护：

```c
typedef struct { const char *name; void *addr; } x86_extern_t;

x86_extern_t x86_extern_symbols[] = {
    { "x_cons",        &x_cons },
    { "x_car",         &x_car },
    { "x_less_or_eq",  &x_less_or_eq },
    ...
    { NULL, NULL },
};
```

汇编时解析 `external-label x-cons` → 在 mod 中记录符号名，输出时查符号表找索引写入 external_reloc table。

（当前版本先实现内部符号链路，外部符号预留。）

# 指令编码与重定位

| 场景 | 机器码 | 重定位? | 字节 |
|------|--------|---------|------|
| `mov reg, label-imm(internal)` | LEA rip-relative | 无 | 7 |
| `mov reg, label-deref(any)` | MOV rip-relative | 无 | 7 |
| `call/jmp label(internal)` | E8/E9 rel32 | 无 | 5 |
| `mov reg, label-imm(external)` | movabs B8+r + imm64 | external abs64 | 10 |
| `call external-label` | movabs reg + call reg | external abs64 | 12 |
| `tail-call external-label` | movabs reg + jmp reg | external abs64 | 12 |
| `pointer-t` 字段值 | data 中 8B 全零占位 | internal | 8 (data) |
| `string-t` 字段值 | data 中 8B 全零占位 | internal | 8 (data) |
| `-8` metadata slot | code label 前 8B 占位 | internal | 8 (data) |

关键区分：
- 代码内部的 label 引用（`label-deref`）使用 RIP-relative — 天然位置无关，不产生重定位
- data 段中的指针字段和 metadata slot 使用 absolute64 占位 — 产生 internal 重定位
- 外部符号的调用使用 movabs + indirect call/jmp — 产生 external 重定位

# metadata `-8` slot

汇编器负责布局。对于 `define-code foo` 和 `define-metadata foo`：

```
data 段:
  [0x00..]   <foo 的 metadata struct 内联字节>
  [0x30..]   <其他 data>

code 段:
  [0x00..]   00 00 00 00 00 00 00 00   ← -8 slot 占位 (internal reloc → metadata offset)
  [0x08..]   <foo 的第一条指令>
```

运行时 `*(foo - 8)` 拿到 metadata 指针，O(1) 访问。

# 汇编器结构

两个汇编函数复用代码布局和数据求值逻辑，区别在输出阶段：

```
assembleFlat(mod):
    → 平坦字节码
    → label-deref 用 RIP-relative
    → 无重定位
    → 无 metadata -8 slot
    → 不支持 pointer-t / string-t / space 字段

assembleExe(mod):
    → x86.exe 格式
    → 收集 internal、external、value 重定位
    → metadata -8 slot 用 internal reloc
    → pointer-t / string-t 字段值初始化为 0，loader 填充
    → space_size 来自所有 define-space 的总和
    → code 段 label-deref 仍用 RIP-relative
    → 产生 value reloc 对应 symbol/keyword/string/definition 引用
```

# 需新增/改动的文件

| 模块 | 文件 | 说明 |
|------|------|------|
| **汇编器** | `assemble/assembleExe.ts` | 新增 — 输出 x86.exe 格式 |
| **汇编器** | `assemble/assembleFlat.ts` | 提取 code/data/space 布局共用逻辑 |
| **操作数** | `operand/Operand.ts` | 新增 `ExternalLabelOperand` |
| **解析器** | `parse/parseOperand.ts` | 解析 `(external-label name)` |
| **编码器** | `encode/types.ts` | `EncodedInstruction` 增加 reloc 标记 |
| **编码器** | `encode/control.ts` | call/jmp 支持 external-label |
| **CLI** | `main.ts` | 新增 `assemble-x86-exe` 命令 |
| **C runtime** | `x86/x86.c` | 新增 `x86_execute_exe()` |
| **C runtime** | `x86/symtab.c` | 新增外部符号表 |
| **C CLI** | `meta.exe.c` | 新增 `run-x86 file.x86.exe` |
| **元数据** | `mod/Mod.ts` | 新增 `externalSymbols` 映射 |
| **测试** | `lib/x86/exe/` | 新目录 — x86.exe 格式专项测试 |
| **测试脚本** | `scripts/test-x86-exe.sh` | assemble + run-x86 + snapshots |

# 测试计划

```
lib/x86/exe/
  pointer-field.x86.asm
    define-struct → claim → define-data 含 (pointer (struct ...))
    define-code 通过 label-deref 读取 pointer 指向的嵌套字段
    .out → 嵌套 struct 的字段值

  metadata-slot.x86.asm
    define-code + define-metadata
    define-code 内读取自身 -8 slot 的 metadata 字段
    .out → metadata 字段值

  string-field.x86.asm
    define-data 含 (pointer "abc")
    define-code 通过 label-deref 间接读取字符串首字节
    .out → 'a' = 97

  data-write.x86.asm             (从 semantics/ 迁移)
    LEA + MOV [reg], imm 写入 data 字段后读回验证
    .out → 写入值

  data-write-nested.x86.asm      (从 semantics/ 迁移)
    写入嵌套 struct 子字段后读回验证
    .out → 写入值
```

# 暂不实现

- gdb 兼容
- define-code 对齐到特定偏移 — 当前对齐到 4K 页边界已满足需求
