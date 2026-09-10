---
title: xvm direct threading 改为 indirect threading 的性能对比
author: claude
date: 2026-09-10
---

# 背景

commit `d5e5f62f6` 把 [xvm.c] 的 threaded code 从

- direct threading：`handler | op | operands`，`goto *((void **)(pc - 8))[0]`

改为

- indirect threading：`op | operands`，`goto *dispatch_table[op]`

净删 243 行，顺带消除了 handler 指针未对齐的 UB。

本文用数据回答一个问题：**改完之后有没有性能损失？**

# 方法

- direct 由 `244ccc546` 现场构建，indirect 由 `d5e5f62f6` 构建，
  同一 `./scripts/build.sh`（`-O3 -flto`）。
- 同一份 bytecode；固定 P-core 0；只统计 user space。
- 每个配置 1 轮预热 + N 轮测量，**direct/indirect 交错执行**，取中位数，
  并逐轮配对求时间比（消除轮间漂移）。
- 峰值内存取 `ru_maxrss`。

| workload  | 说明                                                             | 轮数 |
|-----------|------------------------------------------------------------------|------|
| self-check| `meta-lisp.meta check`（自举编译器检查自身源码）                 | 15   |
| fib(40)   | `meta-math.meta`，临时取消注释 `(println (fibonacci 40))`        | 21   |

# 结果

| workload   | direct | indirect | ind/dir | indirect 更快 | IPC           | 峰值内存        |
|------------|--------|----------|---------|---------------|---------------|-----------------|
| self-check | 5.815s | 5.692s   | 0.979   | 13/15 轮      | 1.415 → 1.478 | 532.6 → 531.3 MB|
| fib(40)    | 5.438s | 5.117s   | 0.941   | 19/21 轮      | 2.817 → 3.307 | 11.2 → 11.2 MB  |

两个 workload 上 indirect 都没有变慢，反而略快；峰值内存持平或略降。

# 注意事项：fib 的「快」不必当真

computed-goto 的性能对 handler 地址布局敏感。用 `-falign-labels=8/32/128`
重编译同一份代码后：

| 布局 | self ind/dir | fib ind/dir |
|------|--------------|-------------|
| a8   | 0.989        | 1.020       |
| a32  | 1.002        | 1.052       |
| a128 | 0.994        | 0.949       |

fib 的胜负随布局翻转（±5%），说明「indirect 在 fib 上快 5%」主要是布局运气，
不是设计优势。但 **self-check 跨布局都在 1.00 附近（0.99–1.00）**，
所以「没有性能损失」是稳的。

# 结论

从 direct 改为 indirect：

1. **没有性能回退**：self-check 上与 direct 持平或略快，跨布局也稳定在 1.00 附近。
2. 顺带收益：xvm.c 净删 243 行；消除 handler 指针未对齐的 UB；峰值内存略降。
3. 解释器真正的成本仍然是 GC：关掉 GC 后 self-check 快 2.15 倍
   （GC 占约 66% 的 cycles），所以 dispatch 层面的差异总是很小。
