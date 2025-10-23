---
title: database of instructions
date: 2025-10-23
---

在通过 plugin 扩展 instruction set 的时候，
我们可能需要一个类似 database of instructions 的东西，

因为我们不光需要知道简单的 instruction 类型。比如：

- pure -- 有返回值没有副作用
- effect -- 带有副作用没有返回值
- mixed -- 混合 pure 和 effect -- 是否应该完全禁止这种 instruction？
- terminator -- 作为 basic block 结尾的 control flow instruction
- SSA 相关的 instructions 比如 `put!` 和 `use`

还需要知道很多别的关于 instruction 的信息。比如：

- 在某些优化的 pass 需要知道 instruction 是否具有交换性。
