# builders/make

共享的 C 构建系统（Makefile 片段）。

## 用法

```makefile
# std.c/makefile — 无依赖
include ../../builders/make/c.mk

# cli.c/makefile — 依赖 std.c
include ../../builders/make/c.mk
deps = ../std.c/src/index.o

# meta-runtime.c/makefile — 链式依赖
include ../../builders/make/c.mk
deps = ../std.c/src/index.o
deps += ../cli.c/src/index.o
```

## 目录结构

- `makefile`（小写）— 构建入口
- `src/` — 源码目录
- `scripts/build.sh` / `scripts/test.sh` / `scripts/clean.sh` — 标准脚本接口

## 构建机制

所有非测试 `.c` 文件编译为 `.o`，通过 `ld -r` 聚合为 `src/index.o`。测试和可执行文件链接 `src/index.o` + `$(deps)` 形成独立二进制。

## Make 目标

| 目标 | 说明 |
|---|---|
| `build` | 编译所有 `.exe.c`、`.test.c`、`.snapshot.c` |
| `test` | 运行所有 `.test.c` 二进制 + 生成 `.snapshot.out` |
| `clean` | 删除构建产物 |
| `dev` | clean → build → test 一键完成 |

## 测试文件

| 后缀 | 行为 |
|---|---|
| `*.test.c` | 编译为可执行文件并运行 |
| `*.snapshot.c` | 运行并将 stdout 写入 `*.out` |
| `*.exe.c` | 编译但不自动运行（供上层脚本使用） |

测试通过 `find src -name '*.test.c'` 自动发现，无需手动注册。

## 构建产物

产物与源码同目录（`src/` 下），已被项目 `.gitignore` 忽略：
`*.o`、`*.test`、`*.snapshot`、`*.out`、`*.exe`

## TSAN

```bash
TSAN=true make test    # 启用 ThreadSanitizer
```

## 需求

- GNU Make
- GNU parallel（运行测试必需）

## 标准脚本

| 脚本 | 等效命令 |
|---|---|
| `scripts/build.sh` | `make build -j` |
| `scripts/test.sh` | `make test` |
| `scripts/clean.sh` | `make clean` |
