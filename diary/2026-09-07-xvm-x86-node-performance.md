---
title: xvm x86 node 性能对比实验
author: deepseek
date: 2026-09-07
---

# 2026-09-07 / 2f3b51a9b

实验对象：

- 本次实验基于 commit `2f3b51a9b`，在性能较弱的笔记本电脑上测试。
- 测试例子为 `meta-lisp.meta` 的 `check` -- 自举编译器检查自身源码：
  - 用 `bin/meta-lisp.meta` 跑 xvm 编译器；
  - 用 `bin/meta-lisp.js` 跑 node.js 编译器。
- 实验方式 perf 硬件计数。

注意事项：

- [meta-lisp.js] 测试时，暂时注释调 LocatePass/CheckPass 这些 pass，
  因为 [meta-lisp.meta] 还未实现这些 pass。

实验结果：

| case          | 时间(中位) | IPC  | cache-misses | 峰值内存 |
|---------------|------------|------|--------------|----------|
| xvm（gc on）  | 11.90s     | 1.52 | 71.6%        | 556 MB   |
| xvm（gc off） | 8.14s      | 1.93 | 13.9%        | 3208 MB  |
| x86（no gc）  | 7.25s      | 1.95 | 15.2%        | 3439 MB  |
| node          | 6.37s      | 1.54 | 42-49%       | 323 MB   |

实验结论：

- xvm 的 GC（mark/sweep 全表遍历）
  既是时间（+46%）又是 cache（71.6%）的最大负担，
  是解释器端最有价值的研究方向。

# 2026-09-09 / c09cf9c2e

复现上面的实验，基于当前 master。

实验对象：

- 基于当前 master `c09cf9c2e`，比原实验基线 `2f3b51a9b` 晚 21 个 commit。
- 测试例子同为 `meta-lisp.meta` 的 `check`（自举编译器检查自身源码）：
  - `bin/meta-lisp.meta check` → xvm 后端；
  - `bin/x86 run build/main.x86.exe -- check` → x86 后端（无 GC）；
  - `bin/meta-lisp.js check` → node 后端。
- 按原实验注意事项，node 测试时注释掉 `LocatePass`/`CheckPass`
  （[meta-lisp.meta] 的 check-pipeline 只实现到 `100-qualify-pass`）。
- xvm（gc off）由临时把 [xvm.c] 的 `th_gc` 改为 no-op 得到，其余代码不变。

实验环境（与原实验不同）：

```text
$ fastfetch --logo none -s "Host:OS:Kernel:CPU"
Host: 21LE (ThinkBook 16 G6+ IMH)
OS: Void Linux x86_64
Kernel: Linux 7.2.2_1
CPU: Intel(R) Core(TM) Ultra 9 185H (12+8+2) @ 5.10 GHz
```

- CPU 为混合架构：P-core 0-11 / E-core 12-21。
- 所有 case 用 `taskset` 固定到 P-core 0。
- `perf stat` 只统计 user space（`perf_event_paranoid=2`，无 root，无法统计 kernel）。
- 每个 case 1 轮预热 + 9 轮测量，交错执行，取中位数。
- 峰值内存取 `wait4` 返回的 `ru_maxrss`。

实验结果：

| case                    | 时间(中位) | 时间(min/max) | IPC  | cache-misses | 峰值内存  |
|-------------------------|------------|---------------|------|--------------|-----------|
| xvm（gc on）            | 6.294s     | 6.260/6.391   | 1.42 | 81.7%        | 555.8 MB  |
| xvm（gc off）           | 3.122s     | 3.080/3.142   | 2.87 | 59.7%        | 3206.4 MB |
| x86（no gc）            | 2.750s     | 2.732/2.761   | 3.08 | 60.4%        | 3438.1 MB |
| node（passes off）      | 3.250s     | 3.220/3.294   | 1.66 | 67.9%        | 264.2 MB  |
| node（passes on，补充） | 3.888s     | 3.859/3.904   | 1.82 | 66.6%        | 300.9 MB  |

与原实验对比：

| case          | 原时间 | 新时间 | 原 IPC | 新 IPC | 原内存  | 新内存    |
|---------------|--------|--------|--------|--------|---------|-----------|
| xvm（gc on）  | 11.90s | 6.294s | 1.52   | 1.42   | 556 MB  | 555.8 MB  |
| xvm（gc off） | 8.14s  | 3.122s | 1.93   | 2.87   | 3208 MB | 3206.4 MB |
| x86（no gc）  | 7.25s  | 2.750s | 1.95   | 3.08   | 3439 MB | 3438.1 MB |
| node          | 6.37s  | 3.250s | 1.54   | 1.66   | 323 MB  | 264.2 MB  |

实验结论：

1. **workload 基本没变**：xvm（gc on）执行 39.49G 条 xvm 指令，原实验 39.7G
   （-0.5%）；三个 case 的峰值内存几乎逐字节吻合（555.8/556、3206/3208、
   3438/3439 MB）。复现的确是同一个 workload。

2. **GC 的代价比原实验更大**：本机 GC 让时间从 3.122s 涨到 6.294s
   （+102%，原实验 +46%），cache-miss 绝对次数从 1.54e7 涨到 3.58e8（23 倍），
   IPC 从 2.87 掉到 1.42。GC（mark/sweep）是内存带宽/延迟受限；本机主频与
   IPC 上限更高，内存墙相对更突出，所以 GC 的相对成本反而上升。

3. **关 GC 后 xvm 的 IPC（2.87）接近 x86（3.08）**，再次印证原结论：
   解释器调度本身不是瓶颈，绝大多数 cache-miss 由 GC 造成
   （原实验 71.6%，本机 81.7%）。

4. **x86 后端本次中位也超过 node**：2.750s vs 3.250s。原实验是 x86 中位
   7.25s 落后 node 6.37s，只有最优轮领先。xvm（gc off）3.122s 也快于 node
   3.250s。本机对「无 GC + 高 IPC」的负载更友好；node 的 V8 GC 与 xvm 的 GC
   一样受内存墙拖累。

补充：user / kernel 时间分布（GC 会复用内存，无 GC 会疯狂向内核要页）：

| case              | user  | sys   | sys%  |
|-------------------|-------|-------|-------|
| xvm（gc on）      | 6.06s | 0.18s | 3.0%  |
| xvm（gc off）     | 2.09s | 0.99s | 32.3% |
| x86（no gc）      | 1.65s | 1.05s | 39.0% |
| node（passes on） | 3.68s | 0.14s | 3.7%  |

注意事项：

- 机器不同，绝对时间不能与原实验直接比较。IPC 的差异主要来自微架构
  （本机 P-core 的 IPC 上限更高）。
- `cache-misses` / `cache-references` 是硬件通用事件，在不同微架构上映射到
  不同 PMU 事件（本机映射到 LLC）。因此 cache-miss 百分比跨机器不可比，
  但同一台机器内 gc on/off 的对比仍然有效；更能说明问题的是绝对次数
  （3.58e8 vs 1.54e7，GC 占约 96%）。
- 只统计了 user space。x86 / xvm（gc off）有 32-39% 时间在 kernel
  （3GB 以上内存分配的 page fault），这部分 cycle/instruction 未计入 IPC。
- 本实验按原 diary 的注意事项只关了 `LocatePass`/`CheckPass`；当前 master 的
  JS `CheckPipeline` 还多一个 `CheckReservedNamesPass`（[meta-lisp.meta] 也未
  实现），因为它只是线性扫描一遍语句、成本可忽略，故保留。

复现命令：

```sh
# 构建
./scripts/all.sh

# xvm（gc on）
(cd packages/meta-lisp.meta && ../../bin/meta-lisp.meta check)

# x86
(cd packages/meta-lisp.meta && ../../bin/x86 run build/main.x86.exe -- check)

# node：注释掉 packages/meta-lisp.js/src/meta/pipelines/CheckPipeline.ts
#   中的 M.LocatePass(pkg) 与 M.CheckPass(pkg) 之后
(cd packages/meta-lisp.meta && ../../bin/meta-lisp.js check)

# xvm（gc off）：把 packages/xvm.c/src/xvm/xvm.c 的
#   th_gc: xvm_gc_maybe_collect(xvm); ...
#   改成 th_gc: /* no-op */ ...，再 ./scripts/run-in.sh xvm.c build.sh

# 测量（固定 P-core 0，只统计 user space）
taskset -c 0 perf stat -e cpu_core/cycles/u,cpu_core/instructions/u,\
cpu_core/cache-references/u,cpu_core/cache-misses/u,\
cpu_core/branches/u,cpu_core/branch-misses/u -- <command>
```
