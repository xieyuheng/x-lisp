# 实现浮点支持

## 概述

为 [meta-lisp.js] 的 `190-SelectInstructionPass`（basic-lisp → assembly-lisp）
和 assembly-lisp 的 x86 编码层添加浮点数（float64）支持。

## 当前状态

`190-SelectInstructionPass.ts` 已实现大部分 basic-lisp 指令的翻译，
浮点相关指令在 `selectInstr` 的 `default` case 中以 unhandled log 输出：

```
[selectInstr] unhandled instr: (= %f64.1 (float64 :content 3.14))
[selectInstr] unhandled instr: (= %float.1 (tag-float %f64.1))
```

## Tag Scheme

定义见 `packages/meta-runtime.c/src/value/types.h`：

```
value_t = 64 bits = [61 bits payload] [3 bits tag]

X_INT       = 0b000
X_FLOAT     = 0b001
X_IMMEDIATE = 0b110  (bool/void 复用)
X_OBJECT    = 0b111
```

`190-SelectInstructionPass.ts` 顶部已有对应常量：

```typescript
const TAG_BITS = 3n
const INT_TAG = 0b000n
const FLOAT_TAG = 0b001n    // 已定义，未使用
const IMMEDIATE_TAG = 0b110n
const OBJECT_TAG = 0b111n
```

## Float Low-bit Tagging

浮点数使用 Low-bit Tagging（`packages/meta-runtime.c/src/value/float.c`）：

```c
inline value_t x_float(double target) {
  double_or_uint64_t the_union = { .as_double = target };
  return (the_union.as_uint64 & PAYLOAD_MASK) | X_FLOAT;
}

inline double to_double(value_t value) {
  assert(float_p(value));
  double_or_uint64_t the_union = {
    .as_uint64 = ((uint64_t) value) & PAYLOAD_MASK
  };
  return the_union.as_double;
}
```

- **Box**: 取 double 的 64-bit 位表示，清低 3 位，OR X_FLOAT (0b001)
- **Unbox**: 清低 3 位（AND `PAYLOAD_MASK = 0xfffffffffffffff8`），解释为 double
- 精度损失：double 低 3 位被 tag 覆盖，约损失 3 bits 精度

## 需要实现的内容

### 1. assembly-lisp x86 编码层新增 SSE 指令

所有新文件在 `packages/meta-lisp.js/src/x86/encode/` 下：

| 指令 | 用途 | x86-64 编码 |
|---|---|---|
| `movsd` | 移动标量双精度浮点 (XMM ↔ mem/reg) | F2 0F 10 /r (load), F2 0F 11 /r (store) |
| `addsd` | 标量双精度加法 | F2 0F 58 /r |
| `subsd` | 标量双精度减法 | F2 0F 5C /r |
| `mulsd` | 标量双精度乘法 | F2 0F 59 /r |
| `divsd` | 标量双精度除法 | F2 0F 5E /r |
| `comisd` | 标量双精度比较（影响 FLAGS） | 66 0F 2F /r |
| `cvtsi2sd` | int64 → double 转换 | F2 REX.W 0F 2A /r |
| `cvttsd2si` | double → int64 转换（截断） | F2 REX.W 0F 2C /r |

以上 SSE 指令**仅需**实现 XMM 寄存器 ↔ 通用寄存器 / XMM 寄存器 ↔ 内存的操作数组合。

XMM 寄存器也需要加入 `reg.ts` 的 `REG_TABLE`：
```
xmm0 ～ xmm7:  code 0-7,  isExtended=false
xmm8 ～ xmm15: code 0-7,  isExtended=true
```

### 2. 设计文档

每个新指令需要对应的 `docs/zh/assembly-lisp/instructions/<name>.md`，
并更新 `docs/zh/assembly-lisp/instructions/index.md`。

参考已有文档格式：`set.md`, `movzx.md`, `sar.md`。

### 3. 语义测试和编码测试

- `packages/meta-lisp.js/lib/x86/encoding/` — 编码测试（验证机器码）
- `packages/meta-lisp.js/lib/x86/semantics/` — 语义测试（验证运行结果）

参考已有测试：`sar.x86.asm`, `set-movzx.x86.asm`。

### 4. `190-SelectInstructionPass` — 浮点指令 case

在 `packages/meta-lisp.js/src/meta/passes/190-SelectInstructionPass.ts` 的 `selectInstr` 中添加：

| basic-lisp 指令 | x86 伪代码 | SSE 指令序列 |
|---|---|---|
| `float64 :content N → %out` | `(mov (var out) <imm64>)` | `movabs out, N`（将 double 的位表示作为 imm64） |
| `tag-float %x → %out` | `(out & PAYLOAD_MASK) \| FLOAT_TAG` | `mov out x; and out PAYLOAD_MASK; or out FLOAT_TAG` |
| `to-float64 %x → %out` | 从 value-t 恢复 double | `mov out x; and out PAYLOAD_MASK`（清 tag 位，结果即 double 位表示） |
| `fadd %a %b → %out` | `out = a + b` (as double) | unbox a → xmm0, unbox b → xmm1, addsd, box result |
| `fsub / fmul / fdiv` | 同上 | 同上 |
| `fcmp-eq/ne/lt/le/gt/ge` | `cmp a b; setcc` | unbox a,b → xmm, comisd, setcc al, movzx out al |

**Box/Unbox 需要用通用寄存器中转**（movsd 在 XMM 和内存/通用寄存器间移动，movq 在通用寄存器和 XMM 间移动位表示）。

实际实现参考现有 int 的 tag/to 模式，但使用 XMM 寄存器做运算。

### 5. Exception: `tag-float` 的 `PAYLOAD_MASK`

```typescript
const PAYLOAD_MASK = 0xfffffffffffffff8n  // ~0n << 3n
```

`tag-float` 的 x86 序列：
```
mov out x
and out PAYLOAD_MASK
or  out FLOAT_TAG
```

## 注意事项

- 浮点比较后的条件码**与整数比较完全相同**（comisd 影响 CF/ZF/PF，setcc 的语义相同）
  — 所以浮点比较和已有 int 比较可以**复用同一个 cmpCc 表**
- 浮点比较结果也是 bool-t，同样可以**融入 branch 融合**（S4 已有的 ssaGetSoleUser 逻辑）
- `float64` 字面量需要将 double 的 IEEE 754 位表示直接作为 imm64 加载：
  ```typescript
  const value = B.expectFloat(instr.attributes, "content")
  const bits = new BigInt64Array(new Float64Array([value]).buffer)[0]
  ```
- SSE 指令**必须**加 F2（或 66/F3）前缀
- XMM 寄存器名称如 `xmm0` 需要加入 `reg.ts` 的 `REG_TABLE`

## 参考文件

| 文件 | 说明 |
|---|---|
| `packages/meta-lisp.js/src/meta/passes/190-SelectInstructionPass.ts` | 需要添加浮点 case |
| `packages/meta-runtime.c/src/value/float.c` | 浮点 box/unbox 参考实现 |
| `packages/meta-runtime.c/src/value/types.h` | Tag scheme 定义 |
| `packages/meta-lisp.js/src/x86/encode/` | x86 编码器（mov.ts, arithmetic.ts, reg.ts 等） |
| `packages/meta-lisp.js/src/x86/encode/reg.ts` | 寄存器 REG_TABLE |
| `packages/meta-lisp.js/src/x86/encode/encode.ts` | 指令分发器 |
| `docs/zh/assembly-lisp/instructions/` | 设计文档 |
| `packages/meta-lisp.js/lib/x86/` | lib 测试文件 |
