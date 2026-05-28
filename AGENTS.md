---
title: AI Agent 工作指南
---

# 前言

引用项目中 package 的名字时使用 `[package-name]` 格式。

例如：

- [helpers.c]
- [xvm.c]
- [helpers.js]
- [meta-lisp.js]
- [meta-lisp.meta]

# 目录速查

| 路径        | 内容                                 |
|-------------|--------------------------------------|
| `packages/` | 所有 package 源码（JS/TS、C、.meta） |
| `scripts/`  | 顶层编排脚本                         |
| `docs/`     | 文档（语法参考、内建函数、FAQ）      |
| `.agents/`  | AI agent 专属资源（skills）          |
| `editors/`  | 编辑器集成                           |

# 环境依赖

- **Node.js**（运行 JS/TS package）
- **pnpm**（monorepo 包管理，`scripts/prepare.sh` 安装依赖）
- **GCC**（编译 C package，`-std=c23`）
- **GNU Make**（C 构建）
- **GNU parallel**（C 测试并行执行 — 无此工具 `make test` 会失败）

# 架构

**JS/TS monorepo**（`pnpm-workspace.yaml` — `packages/*.js`）：

- [helpers.js] — 基础库（无依赖）
- [cli.js] — CLI 框架，依赖 [helpers.js]
- [ppml.js] — 格式化打印，依赖 [helpers.js]
- [sexp.js] — S 表达式解析器，依赖 [helpers.js]
- [meta-lisp.js] — **引导编译器**，为 `.meta` package 提供 `./meta-lisp.js` 编译器

JS/TS package 目录结构（以 [helpers.js] 为例）：

```
helpers.js/
  package.json       # "type": "module", Prettier 配置内联
  tsconfig.json      # strict: true, module: nodenext, outDir: dist
  scripts/           # check / test / clean / format / watch
  src/
    index.ts         # barrel: export * from "./module/index.ts"
    module/
      index.ts       # barrel
      feature.ts
      feature.test.ts  # 测试与源码同目录
```

**C packages**（共享 [c.make]/c.mk）：

- [helpers.c] — 基础库
- [cli.c] — CLI 库，依赖 [helpers.c]
- [xvm.c] — VM，依赖 [helpers.c] + [cli.c]

C package 目录结构（以 [helpers.c] 为例）：

```
helpers.c/
  makefile           # include ../c.make/c.mk
  scripts/           # build / clean / test
  .gitignore         # *.o *.test *.snapshot *.exe
  src/
    index.h          # 聚合所有模块的 index.h
    module/
      deps.h         # 本模块依赖（标准库 + 其他模块 index.h）
      types.h        # 前置声明、typedef
      index.h        # 模块入口（include deps.h → types.h → 各 .h）
      module.h       # 公开 API
      module.c       # 实现（仅 include "index.h"）
      module.test.c  # 测试（编译为二进制，exit 0 = pass）
```

**`.meta` packages** — meta-lisp 源码，通过 [meta-lisp.js] 构建/运行：

- [meta-builtin.meta] — 内置函数声明
- [meta-example.meta] — 测试/演示 package
- [meta-error.meta] — 错误模块测试（类型错误是预期输出）
- [meta-lisp.meta] — **自举编译器（WIP）**

.meta package 目录结构（以 [meta-example.meta] 为例）：

```
meta-example.meta/
  meta-package.json  # entry, build config
  meta-lisp.js       # 薄 wrapper: node ../meta-lisp.js/src/main.ts $@
  scripts/           # check / build / test / clean
  .gitignore         # build/ *.o *.x86
  src/
    example.meta     # 以 (module <name>) 开头；多文件可共享同一模块名
    nat.meta
  build/
    bundle.xasm      # 编译产物：类 x86-64 汇编
    bundle.xexe      # 链接后的可执行文件
  snapshot/          # 测试输出快照（*.out 文件，需提交）
```

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
- `./scripts/prepare.sh` — 安装 JS 依赖 (pnpm)
- `./scripts/clean.sh`   — 清理所有 package
- `./scripts/format.sh`  — 格式化 JS/TS 源码
- `./scripts/build.sh`   — type-check JS + 编译 C
- `./scripts/test.sh`    — 测试所有 package (JS + C + .meta)
- `./scripts/all.sh`     — prepare → clean → format → build → test

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
- 构建产物（`.o`, `.test`, `.snapshot`, `.xexe` 等）已被 gitignore，**产物与源码同目录**
- CMake 仅用于 Windows/IDE 环境；开发流程使用 `make`

每个 C package 提供（在 package 根目录执行）：
- `scripts/build.sh` — 编译 C 源码
- `scripts/clean.sh` — 清理构建产物
- `scripts/test.sh`  — 运行测试和 snapshot（GNU parallel 并行）

**修改 C 代码前应先加载 `scalable-c` skill**，它定义了 class 结构、命名约定、
`self` 参数、内存分配、错误处理、迭代器、测试等全套约定。

## JS/TS 工作流

- 测试：**Node 原生 test runner**（`node --test`）
- 测试文件：`src/**/*.test.ts`（在 package.json scripts 中配置）
- 测试与源码同目录（colocated）
- 格式化：Prettier（配置内联在 `package.json`；无 ESLint）
- 模块系统：ESM only（`"type": "module"`）
- 相对 import 必须带 `.ts` 扩展名（`nodenext` 要求）
- Node 内置模块使用 `node:` 前缀

每个 JS/TS package 提供（在 package 根目录执行）：
- `scripts/check.sh`  — TypeScript type-check
- `scripts/format.sh` — Prettier 格式化源码
- `scripts/test.sh`   — 运行测试（Node 原生 test runner）
- `scripts/watch.sh`  — watch 模式 type-check
- `scripts/clean.sh`  — 清理 snapshot 输出

## meta-lisp 工作流

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

**修改 `.meta` 代码前应先加载 `lisp-brackets` skill**，修改后运行验证：
```bash
python3 .agents/skills/lisp-brackets/check-brackets.py <file.meta>
```

# 自举循环

这是项目的核心架构：**JS 编译器引导 .meta 编译器，.meta 编译器最终编译自身**。

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

**自举的正确性验证流程：**

1. 修改 [meta-lisp.meta] 源码
2. 用 [meta-lisp.js] 编译 [meta-lisp.meta]：`./scripts/build.sh`
3. 用编译产物自编译：`./scripts/self-check.sh`
4. 两次编译结果必须语义等价（WIP）

**修改 [meta-lisp.js] 时必须做的事：**
1. 跑自身的测试：`packages/meta-lisp.js/scripts/test.sh`
2. 用它编译 [meta-lisp.meta]：`packages/meta-lisp.meta/scripts/test.sh`
3. 验证 [meta-lisp.meta] 仍能自举：`packages/meta-lisp.meta/scripts/self-check.sh`

任何一环失败都应视为修改不完整。

# AI Agent 技能指引

项目在 `.agents/skills/` 下提供了 4 个 skill。Agent 应在对应场景主动加载：

| 场景                         | 加载 Skill        |
|------------------------------|-------------------|
| 编写或修改 C 代码            | `scalable-c`      |
| 编写或修改 `.meta` 代码      | `lisp-brackets`   |
| 重构、设计新模块（OOP 思想） | `oop-thinking`    |
| 解决复杂问题、排查 bug       | `how-to-solve-it` |

**注意：**
- `lisp-brackets` skill 提供了 `check-brackets.py` 验证脚本，修改 `.meta` 后必须运行
- `scalable-c` skill 定义了 class 结构模板、命名约定、deps.h → types.h → index.h 链——偏离这些约定的代码不会被接受

# 禁止事项

- **不要直接调用 `make`** — 优先使用各 package 的 `scripts/build.sh` / `scripts/test.sh`
- **不要跳过 `scripts/check.sh`** — type-check 是修改的必备步骤
- **改 [meta-lisp.js] 后不能只跑 JS 测试** — 必须完成自举循环验证（见自举循环章节）
- **C 代码不要直接 `#include "foo.h"`** — 始终 `#include "index.h"`，依赖通过 `deps.h` 声明
- **不要猜测 API 用法** — 先读对应 module 的 `*.h`（C），了解公开 API 后再编码

# 参考

- [语法参考](docs/en/reference/syntax.md) ([中文](docs/zh/reference/syntax.md))
- [内建函数](docs/en/reference/builtin/index.md) ([中文](docs/zh/reference/builtin/index.md))
- [FAQ](docs/en/faq/faq.md) ([中文](docs/zh/faq/faq.md))
