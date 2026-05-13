# 快速开始

## 什么是 meta-lisp？

meta-lisp 是一个**静态类型**的 Lisp 方言，语法模仿 Scheme。它使用 Hindley-Milner 类型系统（类似 Haskell 和 ML），没有 TypeScript 那种 union/intersection 类型，也没有子类型关系。

## 环境要求

- [Node.js](https://nodejs.org/)（运行 bootstrap 编译器）

## 获取项目

```bash
git clone https://github.com/xieyuheng/x-lisp.git
cd x-lisp
```

## 运行 meta 项目

项目是检查（check）→ 编译（build）→ 测试（test）的工作流：

```bash
cd projects/meta-examples.meta

# 类型检查
./meta-lisp.js check

# 编译到 stack VM 指令
./meta-lisp.js build

# 运行测试（使用 stack-lisp 解释器）
./meta-lisp.js test --profile
```

输出示例：

```
check pass
check pass
test pass
```

### 命令说明

| 命令 | 作用 |
|---|---|
| `check` | 类型检查整个项目 |
| `build` | 编译为 stack VM 指令 |
| `test` | 运行 `define-test` 测试 |
| `test --profile --builtin` | 运行测试（含 builtin 测试） |

### 一次性运行所有项目

在项目根目录：

```bash
sh scripts/build.sh
sh scripts/test.sh
sh scripts/all.sh   # 清理 → 格式化 → 构建 → 测试
```

## 你的第一个项目

创建一个新的 meta-lisp 项目目录：

```
my-project/
├── project.json
└── src/
    └── hello.meta
```

### project.json

```json
{
  "name": "my-project",
  "version": "0.1.0",
  "build": {
    "source-directory": "src",
    "output-directory": "build",
    "snapshot-directory": "snapshot"
  }
}
```

### src/hello.meta

```scheme
(module hello)

(claim factorial (-> int-t int-t))

(define (factorial n)
  (if (int-less-or-equal? n 1)
    1
    (imul (factorial (isub n 1)) n)))

(define-test factorial-test
  (assert-equal 1 (factorial 0))
  (assert-equal 1 (factorial 1))
  (assert-equal 2 (factorial 2))
  (assert-equal 6 (factorial 3)))
```

### 运行

把你创建的的 `meta-lisp.js` 链接到项目目录中：

```bash
ln -s path/to/x-lisp/projects/meta-lisp.js/src/main.ts meta-lisp.js
```

或用 Node 直接运行：

```bash
node path/to/x-lisp/projects/meta-lisp.js/src/main.ts check
```

## 下一步

- [02-syntax.md](02-syntax.md) — 完整语法参考
- [03-type-system.md](03-type-system.md) — 类型系统详解
- [04-data-types.md](04-data-types.md) — 自定义数据类型
- [07-builtins.md](07-builtins.md) — 内置函数一览
