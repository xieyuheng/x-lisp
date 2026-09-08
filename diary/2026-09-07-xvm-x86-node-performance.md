---
title: xvm x86 node 性能对比实验
author: deepseek
date: 2026-09-07
---

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
