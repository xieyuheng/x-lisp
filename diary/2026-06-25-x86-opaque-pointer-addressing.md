---
title: x86 汇编的 opaque 指针与 offset-of 寻址
authors: [xieyuheng, deepseek-v4-pro]
date: 2026-06-25
---

# 前言

本文承接 2026-06-10（native x86-64 汇编语言设计），由 LLVM 的
[Opaque Pointers](https://llvm.org/docs/OpaquePointers.html) 引发，重新审视两个问题：

- IR 是否应该使用带类型的指针？
- 如果不应该，x86 汇编语言还应该支持 struct 吗？

结论先行：

- **指针应当 opaque**——`(pointer-t T)` 的 pointee 类型 `T` 在我们这里几乎无语义，应去掉，指针退化为纯 8 字节地址。
- **struct 应当保留**——它服务于内存布局与字段偏移计算，是 LLVM 在指针 opaque 化之后**依然保留**的东西。
- **把「struct 类型 + field name → offset」分离**为独立的 GEP 式算子 `(offset-of …)`，并**去掉 `(address …)` 的字段路径糖**。

# 核心教训：值携带内在属性，解释语义放到操作上

LLVM 早期指针带 pointee 类型（`i32*` 指向 `i32`）。Opaque Pointers 把所有指针统一为不带 pointee 类型的 `ptr`，把「如何解释内存」的类型信息移到**指令**上：

```llvm
load i64* %p        ; 旧：指针背着 i64
load i64, ptr %p    ; 新：ptr 是 opaque 地址，load 指令自己说读 i64
```

动机的关键一句：

> the pointee type carries no real semantics.

指针的 pointee 类型不携带真实语义——同一块内存可以被当作任意类型解释，类型是「访问操作」的视角，不是「地址」的属性。

但要特别注意：**LLVM 并没有因此放弃 struct 类型**。文档明确：

> Memory optimization algorithms, such as SROA, GVN, and AA, generally need to
> look through LLVM's struct types and reason about the underlying memory offsets.

GEP 仍然带类型（`getelementptr i8, ptr %p, ...`，`getSourceElementType()` 保留），
load/store 仍然带类型。**opaque 化的只是指针值，struct 类型作为「偏移/布局计算的依据」被保留下来**。

文档还给出一个精辟的历史类比——**整数符号性**：

> there is no distinction between signed and unsigned integer types, but rather
> each integer operation (e.g. add) contains flags to signal how to treat the integer.

两次转变是同一个哲学：

> **值只携带它内在的属性；「如何解释」的语义放到操作上。**

- 地址的内在属性 = 它是个 8 字节地址，指向什么类型无真实语义 → 从指针上拿掉。
- 整数的内在属性 = 位宽（`i32`），有符号/无符号是操作的事 → 从类型上拿掉、放到 `add` 上。
- struct 的「形状/布局」是内存访问**真正需要**的 → 保留，但类型出现在**声明**（global 的 valueType）与**操作**（GEP/load）上，而非附着在指针值上。

# 现状分析：我们的 `(pointer-t T)` 的 `T` 是冗余的

考察 [meta-lisp.js] 中 `(address <name> <field> ...)` 的实现（`computePathOffset`）：

```
currentType = claim 类型(name)            ; name 是数据块（通常 claim 成 struct，值类型）
for step in path:
    在当前 struct 的字段里找 step，累加前面字段的 typeSize() 得偏移
    若该字段是 struct → 下钻继续
```

由此得到三个事实：

1. `(address name field...)` 的偏移计算用的是 **`name` 的 claim 类型**（值类型 struct），
   **完全不碰指针的 pointee 类型**。
2. 路径**不穿透指针**——遇到 `(pointer-t …)` 字段就停（再往下会对 `pointer-t` 求 struct 定义而报错）。
3. 跨指针的字段偏移现在靠**手写魔法数字**。例如 `pointer-field` fixture：

   ```lisp
   (address my-config table)        ;; config 内偏移（用 config-t 算）
   (reg-deref (reg rax))            ;; deref → entry 地址
   (reg-deref (reg rax) 8)          ;; entry.value，这个 8 是手算的、不抗布局变化
   ```

`(pointer-t T)` 的 `T` 仅在两处被用到：check `(pointer (struct entry-t …))` 的匹配、emit 匿名
slot 的布局——而这两处的类型都能由 `(struct entry-t …)` **字面量自带的类型名**提供。

也就是说：我们独立地撞上了 LLVM 同样的发现——**指针的 pointee 类型几乎无用**；类型信息其实
已经主要落在「claim 声明」与「寻址操作」上。

# 设计决策

## 1. opaque 指针

`(pointer-t T)` → `pointer-t`（纯 8 字节地址，无 pointee 类型）。

- `(address …)` 不依赖它（偏移用 base 的 claim 类型）。
- `(pointer (struct entry-t …))` 的目标类型由 struct 字面量自带，emit/check 据此布局。

## 2. 保留 struct

`define-struct` 仍是布局与偏移计算的类型依据，与 LLVM opaque 之后保留 aggregate type 一致。
砍掉 struct 退回手算数字偏移（NASM 风格），等于把内存布局推理上移给 codegen，并丢失可读性——
而 LLVM 的经验恰恰是「这类布局推理留在 IR 层有价值」。

## 3. 引入 `(offset-of <struct-type> <field> ...)`

把「struct 类型 + field name → offset」分离成独立的**编译期常量算子**，求值为字节偏移：

```lisp
(offset-of entry-t value)          ;; → 8
(offset-of rect-t bottom-right x)  ;; → 16
```

- 在**值嵌套 struct 内**可多级，**不穿指针**（穿指针由「offset-of + deref + offset-of」链式组合）。
- 这正是 GEP 的精神：**类型是偏移操作的参数，地址是 opaque 的 base**。

## 4. 去掉 `(address name field...)` 的路径糖

`(address <name>)` 只取符号地址，不带字段路径。字段偏移一律由 `offset-of` 显式提供。

# 新寻址模型

寻址 = **base + offset**，三个正交原语：

- **base**
  - `(address <name>)`——符号（label）地址立即数，只取符号本身。
  - `(reg <r>)`——运行时寄存器。
- **offset**（编译期常量，用于 `reg-deref` 的 disp 位置）
  - 数字立即数，或
  - `(offset-of <struct-type> <field> ...)`。
- **访问**
  - `(reg-deref <reg> <offset>)`——`[reg + offset]`，offset 为数字或 `offset-of`。
  - `(deref (address <name>))`——rip-relative 读 label 内容。

## label 嵌套字段

```lisp
(mov (reg rax) (address my-rect))                          ;; rax = &my-rect
(mov (reg rbx) (reg-deref (reg rax)
                 (offset-of rect-t bottom-right x)))        ;; 读 my-rect.bottom-right.x
```

## 跨指针（消除魔法数字）

```lisp
(mov (reg rax) (address my-config))
(mov (reg rax) (reg-deref (reg rax) (offset-of config-t table)))  ;; 取 table 指针值
(mov (reg rbx) (reg-deref (reg rax) (offset-of entry-t value)))   ;; (*table).value
```

每个 `offset-of` 在单一 struct 内计算；跨指针由「offset-of + deref + offset-of」链式组合——
正是 GEP「不穿指针，穿指针需显式 load」的原则。

# 连锁含义

1. `computePathOffset` 的路径逻辑从 `address` 移除，**重生**为 `offset-of` 的求值
   （struct 类型 + field 序列 → `IntValue` 编译期常量）。
2. `(reg-deref …)` 的 disp 从「只接受数字」扩展为「接受编译期常量表达式」（数字或 `offset-of`），
   这是承载符号化偏移的关键。
3. **失去 label+offset 的一步 rip-relative 寻址**：原 `(deref (address my-rect bottom-right x))`
   一条指令读嵌套字段，现在变为「取 base 到 reg + `reg-deref (offset-of …)`」两条。这符合
   「正交优先、优化后置」——将来可加 peephole：`(mov r (address X))` 紧邻
   `(reg-deref r (offset-of …))` 时合成一条 `[rip + (X + const)]`。
4. 指针 opaque 后，`(pointer (struct entry-t …))` 的目标类型由 struct 字面量自带，
   emit/check 不再依赖 `(pointer-t T)` 的 `T`。

# 影响范围（供后续实现）

- parse：新增 `offset-of`；`address` 去掉字段路径；`reg-deref` 的 disp 收编译期常量表达式。
- operand / exp / value：`pointer-t` 去掉类型参数；`offset-of` 求值为 `IntValue`。
- evaluate：支持 `offset-of` 的编译期求值。
- assemble/layout：路径偏移逻辑 → `offset-of` 求值；emit/匿名 slot 用 struct 字面量类型。
- check：指针 opaque 化的相应校验调整。
- encode：disp 来源从数字字面量改为常量表达式求值结果。
- codegen（[meta-lisp.js] 的 X86CodegenPass）：用 `address` + `offset-of` 取代字段路径与手写偏移。
- `.x86.asm` fixture 迁移；更新设计文档。

# 留待后续

- **`string-t` 的形态**：opaque 世界里它 = `pointer-t` + define-data 的字符串字面量便利；
  保留为糖，还是拆成 `(pointer (string "…"))`。
- **原始类型符号性**（`int8-t` vs `uint8-t`）：按「整数符号性」类比，布局层只需大小，可考虑简化。
- label+offset 一步 rip-relative 寻址的 peephole 优化。
