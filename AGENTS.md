---
title: AI Agent 工作指南
---

# 前言

引用 package 名时使用 `[package-name]` 格式（如 [helpers.js]、[xvm.c]、[meta-lisp.meta]）。

# 架构

**JS/TS monorepo**（`pnpm-workspace.yaml` — `packages/*.js`）：

- [helpers.js] — 基础库（无依赖）
- [cli.js] — CLI 框架，依赖 [helpers.js]
- [ppml.js] — 格式化打印，依赖 [helpers.js]
- [sexp.js] — S 表达式解析器，依赖 [helpers.js]
- [meta-lisp.js] — **引导编译器**，为 `.meta` package 提供 `./meta-lisp.js` 编译器

**C packages**（共享 [c.make]/c.mk）：

- [helpers.c] — 基础库
- [cli.c] — CLI 库，依赖 [helpers.c]
- [xvm.c] — VM，依赖 [helpers.c] + [cli.c]

**`.meta` packages** — meta-lisp 源码，通过 [meta-lisp.js] 构建/运行：

- [meta-builtin.meta] — 内置函数声明
- [meta-example.meta] — 测试/演示 package
- [meta-error.meta] — 错误模块测试（类型错误是预期输出）
- [meta-lisp.meta] — **自举编译器（WIP）**

# 依赖链

1. `pnpm install`（或 `scripts/prepare.sh`）
2. C：[helpers.c] → [cli.c] → [xvm.c]
3. JS：[helpers.js] → [cli.js]/[ppml.js]/[sexp.js] → [meta-lisp.js]
4. `.meta` 测试依赖 [meta-lisp.js] 二进制

顶层 `scripts/build.sh` 按正确顺序构建。

# 工作流

所有流程通过脚本驱动。脚本必须在所在目录执行（顶层或 package 根目录）。
**AI agent 应优先使用脚本**，避免手拼命令。

所有 package 的脚本接口一致（check / build / test / clean）。

从 repo 根目录：
- `./scripts/prepare.sh` — 安装 JS 依赖
- `./scripts/clean.sh`   — 清理所有 package
- `./scripts/format.sh`  — 格式化 JS/TS
- `./scripts/build.sh`   — type-check JS + 编译 C
- `./scripts/test.sh`    — 测试所有 package
- `./scripts/all.sh`     — prepare → clean → format → build → test

## C 工作流

- 小写 `makefile`（不是 `Makefile`），包含 [c.make]/c.mk
- 需要 **GNU parallel**（缺它 `make test` 会失败）
- 三种测试后缀：`*.test.c`（运行）、`*.snapshot.c`（stdout → `*.out`）、`*.exe.c`（只编译不运行）
- 测试通过 `find src -name '*.test.c'` 自动发现
- 构建产物与源码同目录，已被 gitignore
- 始终 `#include "index.h"`，依赖通过 `deps.h` 声明
- **不要猜测 API 用法** — 先读对应 module 的 `*.h`，了解公开 API 后再编码
- **修改前应加载 `scalable-c` skill**

每个 C package 提供：
- `scripts/build.sh` — 编译 C 源码
- `scripts/clean.sh` — 清理构建产物
- `scripts/test.sh`  — 运行测试和 snapshot（GNU parallel 并行）

## JS/TS 工作流

- Node 原生 test runner（`node --test`），测试与源码同目录（`src/**/*.test.ts`）
- ESM only，相对 import 必须带 `.ts` 扩展名，Node 内置模块用 `node:` 前缀
- Prettier 格式化（配置内联在 `package.json`），无 ESLint

每个 JS/TS package 提供：
- `scripts/check.sh`  — TypeScript type-check
- `scripts/format.sh` — Prettier 格式化
- `scripts/test.sh`   — 运行测试（Node 原生 test runner）
- `scripts/clean.sh`  — 清理 snapshot 输出

## meta-lisp 工作流

- 标准流程：check → build → test
- [meta-lisp.meta] 额外有 `scripts/build.sh`（编译为 xvm 汇编）和 `scripts/self-check.sh`（自举验证）
- **修改前应加载 `lisp-brackets` skill**，改后运行 `python3 .agents/skills/lisp-brackets/check-brackets.py <file.meta>`
- `meta-error.meta` 的类型错误是**预期输出**，不要误判为 bug

每个 `.meta` package 提供：
- `scripts/check.sh` — type-check
- `scripts/clean.sh` — 清理 build 和 snapshot 产物
- `scripts/test.sh`  — type-check → build → test

# 自举循环

项目的核心架构：**JS 编译器引导 .meta 编译器，.meta 编译器最终编译自身**。

```
[meta-lisp.js]（引导编译器，JS 实现）
        │
        │ 编译
        ▼
[meta-lisp.meta]（自举编译器，.meta 实现）
        │
        │ 自编译（self-hosting）
        ▼
[meta-lisp.meta]（即使用自己编译自己）
```

**修改 [meta-lisp.js] 时必须做的事：**
1. `packages/meta-lisp.js/scripts/test.sh` — JS 自身测试
2. `packages/meta-lisp.meta/scripts/test.sh` — 用 JS 编译器编译 .meta 编译器
3. `packages/meta-lisp.meta/scripts/self-check.sh` — 验证自举

任何一环失败视为修改不完整。

# 技能指引

Agent 应在对应场景主动加载 skill：

| 场景 | 加载 Skill |
|---|---|
| 编写或修改 C 代码 | `scalable-c` |
| 编写或修改 `.meta` 代码 | `lisp-brackets` |
| 重构、设计新模块 | `oop-thinking` |
| 解决复杂问题 | `how-to-solve-it` |

# 禁止事项

- **不要直接调用 `make`** — 用各 package 的 `scripts/`
- **不要跳过 `scripts/check.sh`** — type-check 是修改的必备步骤
- **改 [meta-lisp.js] 后不能只跑 JS 测试** — 必须完成自举循环验证
- **C 代码不要直接 `#include "foo.h"`** — 始终 `#include "index.h"`

# 参考

- [语法参考](docs/en/reference/syntax.md) ([中文](docs/zh/reference/syntax.md))
- [内建函数](docs/en/reference/builtin/index.md) ([中文](docs/zh/reference/builtin/index.md))
- [FAQ](docs/en/faq/faq.md) ([中文](docs/zh/faq/faq.md))
