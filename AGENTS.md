---
title: AI Agent 工作指南
---

**使用中文进行内部推理和思考。**

# 前言

引用 package 名时使用 `[package-name]` 格式（如 [std.js]、[xrt.c]、[meta-lisp.meta]）。

AI agent 应用中文回答用户的问题。

# 子项目

**JS/TS monorepo**（`pnpm-workspace.yaml` — `packages/*.js`）：

- [std.js] — 基础库（无依赖）
- [cli.js] — CLI 框架，依赖 [std.js]
- [ppml.js] — 格式化打印，依赖 [std.js]
- [sexp.js] — S 表达式解析器，依赖 [std.js]
- [meta-lisp.js] — **引导编译器**，为 `.meta` package 提供 `./meta-lisp.js` 编译器

**C packages**（共享 `builders/make/c.mk`）：

- [std.c] — 基础库
- [cli.c] — CLI 库，依赖 [std.c]
- [xrt.c] — 共享运行时（值类型、GC、解析器、内建函数），依赖 [std.c]
- [xvm.c] — XVM 虚拟机运行时 + 编译器，依赖 [xrt.c] + [std.c] + [cli.c]
- [xexe.c] — x86-64 可执行文件加载/运行，依赖 [xrt.c] + [std.c] + [cli.c]

**`.meta` packages** — meta-lisp 源码，通过 [meta-lisp.js] 构建/运行：

- [meta-builtin.meta] — 内置函数声明
- [meta-example.meta] — 测试/演示 package
- [meta-error.meta] — 错误模块测试（类型错误是预期输出）
- [meta-lisp.meta] — **自举编译器（WIP）**

# 依赖链

1. `pnpm install`（或 `scripts/prepare.sh`）
2. C：[std.c] → [cli.c] → [xrt.c] → [xvm.c] / [xexe.c]
3. JS：[std.js] → [cli.js]/[ppml.js]/[sexp.js] → [meta-lisp.js]
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

- 小写 `makefile`（不是 `Makefile`），包含 `builders/make/c.mk`
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

### 编码规范

- **禁止未初始化变量**。不用 `let x: Type` 声明后再在下文赋初值。
  有分支逻辑时，抽出小函数封装——始终用返回值给出初始化的结果：

  ```typescript
  // 不好 — let 先声明，分支里再赋值
  let pkgName: string
  let modName: string
  if (slashIndex !== -1) {
    pkgName = raw.slice(0, slashIndex)
    modName = raw.slice(slashIndex + 1)
  } else {
    pkgName = "self"
    modName = raw
  }

  // 好 — 抽纯函数，调用方拿到已初始化的结果
  function parse(raw: string): { pkgName: string; modName: string } {
    const i = raw.indexOf("/")
    if (i === -1) return { pkgName: "self", modName: raw }
    return { pkgName: raw.slice(0, i), modName: raw.slice(i + 1) }
  }
  const { pkgName, modName } = parse(stmt.modName)
  ```

## meta-lisp 工作流

- **meta-lisp 是一门新的 Lisp 方言**，有语法问题应先查阅[语法参考](docs/zh/meta-lisp/语法.md)，不要套用其他 Lisp（如 Scheme、Common Lisp）的语法约定
- 标准流程：check → build → test
- [meta-lisp.meta] 额外有 `scripts/build.sh`（编译为 xvm 汇编）和 `scripts/self-check.sh`（自举验证）
- **不要猜测 API 用法** — 优先使用 [meta-builtin.meta] 中已定义的内建函数，需要新函数时再到 `meta-builtin.meta/src/` 下查看声明
- `meta-error.meta` 的类型错误是**预期输出**，不要误判为 bug
- **变量名可以用完整单词如 `list`/`hash`/`set`** — meta-lisp 与 Scheme 一样是单一命名空间（Lisp-1），但容器通过 `(@list ...)` / `[...]`、`(@set ...)`、`(@hash ...)` 等 `@` 前缀特殊语法构造，而非函数作用（如 Scheme 的 `(list ...)`），因此这些名字作变量不会遮蔽任何内建构造器。禁止 `lst`/`acc` 等无意义缩写

每个 `.meta` package 提供：
- `scripts/check.sh` — type-check
- `scripts/clean.sh` — 清理 build 和 snapshot 产物
- `scripts/test.sh`  — type-check → build → test

# 完整测试

**改动完成后，必须在 repo 根目录运行 `./scripts/all.sh` 做完整测试**，涵盖 prepare → clean → format → build → test 全部环节。

不要只跑单个 package 的测试就认为改动完成——依赖链（C → JS → .meta）意味着一个 package 的改动可能影响下游。

# 技能指引

Agent 应在对应场景主动加载 skill：

| 场景 | 加载 Skill |
|---|---|
| 编写或修改 C 代码 | `scalable-c` |
| 重构、设计新模块 | `oop-thinking` |
| 解决复杂问题 | `how-to-solve-it` |
| 用户提出设计/实现需求 | `design-partner` |

# 设计原则

- **不求改动最小，求结构最优。**
  方案选择的标准是架构的清晰性、一致性和可扩展性。
  "改动小"不构成设计论据。实现成本在确定最优结构之后再考虑。

# 禁止事项

- **不要直接调用 `make`** — 用各 package 的 `scripts/`
- **不要跳过 `./scripts/all.sh`** — 改动完成后必须在 repo 根目录跑完整测试
- **不要用管道或截断方式运行全量测试** — 管道会掩盖退出码，无法判断成败；直接运行并检查退出码
- **不要主动提交代码** — 只有用户明确要求提交时才执行 `git commit`
- **C 代码不要直接 `#include "foo.h"`** — 始终 `#include "index.h"`

# 参考

- [语法参考](docs/en/meta-lisp/syntax.md) ([中文](docs/zh/meta-lisp/语法.md))
- [内建函数](docs/en/meta-lisp/builtin/index.md) ([中文](docs/zh/meta-lisp/内置/索引.md))
