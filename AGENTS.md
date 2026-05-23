---
title: AI Agent Instructions
---

# 子项目

目前 meta-lisp 的子项目：

- helpers.js -- 通用的 js/ts modules。
- cmd.js -- 用来实现命令行程序的 js/ts modules。
- ppml.js -- pretty print mark language，用来实现代码的 pretty print。
- sexp.js -- sexp parser。
- meta-lisp.js -- meta-lisp 的 bootstrap 编译器。
- c.make -- 专门用来构建 c 子项目的可被引用的通用 makefile。
- cmd.c -- 用来实现命令行程序的 c library。
- helpers.c -- 通用的 c modules，用 scalable-c 风格写成。
- xvm.c -- VM。
- meta-builtin.meta -- meta-lisp 中 builtin 函数的声明，与简单 builtin 函数的实现。
- meta-example.meta -- 测试用的 meta-lisp 项目。
- meta-error.meta -- 错误模块测试项目。
- meta-lisp.meta -- meta-lisp 的 self-hosting 编译器（WIP）。

# 文档

- [语法参考](docs/zh/reference/syntax.md) ([en](docs/en/reference/syntax.md))
- [内置函数索引](docs/zh/reference/builtin/index.md) ([en](docs/en/reference/builtin/index.md))
- [FAQ](docs/zh/faq/faq.md) ([en](docs/en/faq/faq.md))

# 测试

项目顶层的 `scripts/` 中包含工具脚本：

```bash
sh scripts/clean.sh  # 清理
sh scripts/format.sh # 格式化
sh scripts/build.sh  # 构建
sh scripts/test.sh   # 测试
sh scripts/all.sh    # 完整流程
```

`projects/` 中的每个 project
都有类似的工具脚本文件夹 `scripts/`，
其中包含测试脚本与其他工具脚本。
