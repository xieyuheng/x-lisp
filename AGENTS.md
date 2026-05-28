---
title: AI Agent 工作指南
---

# 前言

引用项目中 package 的名字时使用 `[package-name]` 格式。

例如：

- [helpers.js]
- [xvm.c]
- [meta-lisp.meta]

# 架构

两个语言生态 + `.meta` 自举：

**JS/TS monorepo**（`pnpm-workspace.yaml` — `packages/*.js`）：

- [helpers.js] — 基础库（无依赖）
- [cli.js] — CLI 框架，依赖 [helpers.js]
- [ppml.js] — 格式化打印，依赖 [helpers.js]
- [sexp.js] — S 表达式解析器，依赖 [helpers.js]
- [meta-lisp.js] — **引导编译器**，为 `.meta` package 提供 [meta-lisp.js] 二进制

**C packages**（共享 [c.make]/c.mk）：

- [helpers.c] — 基础库
- [cli.c] — CLI 库，依赖 [helpers.c]
- [xvm.c] — VM，依赖 [helpers.c] + [cli.c]

**`.meta` packages** — Meta-lisp 源码，通过 [meta-lisp.js] 构建/运行：

- [meta-builtin.meta] — 内置函数声明
- [meta-example.meta] — 测试/演示 package
- [meta-error.meta] — 错误模块测试（类型错误是预期输出）
- [meta-lisp.meta] — **自举编译器（WIP）**

# 依赖链

1. `pnpm install`（或 `scripts/prepare.sh`）
2. C：[helpers.c] → [cli.c] → [xvm.c]
3. JS：[helpers.js] → [cli.js]/[ppml.js]/[sexp.js] → [meta-lisp.js]
4. `.meta` 测试依赖 [meta-lisp.js] 二进制

顶层 `scripts/build.sh` 按正确顺序构建 JS 和 C，具体工作在各自 `scripts/` 中完成。

# 工作流

所有流程都通过脚本驱动。顶层 `scripts/` 编排所有 package，各 package 有自己的
`scripts/` 提供具体操作。

每个脚本都必须在 `scripts/` 所在目录执行（即顶层或对应 package 的根目录）。
**AI agent 应优先使用这些脚本**，避免手动拼命令。

从 repo 根目录：
```bash
./scripts/prepare.sh  # 安装 JS 依赖 (pnpm)
./scripts/clean.sh    # 清理所有 package
./scripts/format.sh   # 格式化 JS/TS 源码
./scripts/build.sh    # type-check JS + 编译 C
./scripts/test.sh     # 测试所有 package (JS + C + .meta)
./scripts/all.sh      # prepare → clean → format → build → test
```

所有 package 的脚本接口保持一致（check / build / test / clean），
上层编排脚本通过调用各 package 的对应脚本来实现。

## C 工作流

- 每个 C package 有**小写 `makefile`**（不是 `Makefile`），包含 [c.make]/c.mk
- 共享的 [c.make]/c.mk 需要 **GNU parallel** 来并行运行测试
- 三种测试文件后缀（约定，全部在 `src/` 下）：
  - `*.test.c` — 编译并作为测试运行
  - `*.snapshot.c` — 编译并运行，stdout 捕获到 `*.out`
  - `*.exe.c` — 编译为可执行文件但不运行
- 测试通过 `find src -name '*.test.c'` 查找——文件名很重要
- 构建产物（`.o`, `.test`, `.snapshot`, `.xexe` 等）已被 gitignore
- CMake 仅用于 Windows/IDE 环境；开发流程使用 `make`

每个 C package 提供（在 package 根目录执行）：
- `scripts/build.sh` — 编译 C 源码
- `scripts/clean.sh` — 清理构建产物
- `scripts/test.sh`  — 运行测试和 snapshot（GNU parallel 并行）

## JS/TS 工作流

- 测试：**Node 原生 test runner**（`node --test`）
- 测试文件：`src/**/*.test.ts`（在 package.json scripts 中配置）

每个 JS/TS package 提供（在 package 根目录执行）：
- `scripts/check.sh`  — TypeScript type-check
- `scripts/format.sh` — Prettier 格式化源码
- `scripts/test.sh`   — 运行测试（Node 原生 test runner）
- `scripts/watch.sh`  — watch 模式 type-check
- `scripts/clean.sh`  — 清理 snapshot 输出

## Meta-lisp 工作流

每个 `.meta` package 提供（在 package 根目录执行）：
- `scripts/check.sh` — type-check
- `scripts/clean.sh` — 清理 build 和 snapshot 产物
- `scripts/test.sh`  — type-check → build → test

标准流程：check → build → test

按 package 的额外脚本：
- [meta-lisp.meta]：
  - `scripts/build.sh`      — 编译为 xvm 汇编
  - `scripts/self-check.sh` — 用自编译的二进制对自己做 self-check
- [meta-example.meta]：
  - `scripts/test-cli.sh`   — calculator CLI 示例的集成测试

关于自举编译器的具体工作流见 [meta-lisp.meta]/AGENTS.md。

# 参考

- [语法参考](docs/en/reference/syntax.md) ([中文](docs/zh/reference/syntax.md))
- [内建函数](docs/en/reference/builtin/index.md) ([中文](docs/zh/reference/builtin/index.md))
- [FAQ](docs/en/faq/faq.md) ([中文](docs/zh/faq/faq.md))
