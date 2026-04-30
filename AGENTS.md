# 价值

我是一个 lisp / scheme 程序员。
x-lisp 项目是我计划设计的一些列类 lisp 语言的集合。

目前正在设计的是 meta-lisp，其首要目标是加快新语言开发的速度。
适合用来写新的解释器与编译器，以探索新的计算模型。

比如：

- interaction net
- pi-calculus
- rewrite system
- propagator model
- logic constraint programming
- reactive programming

之所以能加快新语言开发，假设是：
在 lisp 的语法框架内，可以更快地设计和迭代新语法，
从而加快新语言的开发速度。

次要目标：

- 方便用 C 扩展，可以作为用 C 实现的 library 和 app 的脚本语言。
- 尽量使实现独立，简化所依赖的技术栈。

# 范围

目前 x-lisp 的子项目：

- helpers.js -- 通用的 js/ts modules。
- cmd.js -- 用来实现命令行程序的 js/ts modules。
- ppml.js -- pretty print mark language，用来实现代码的 pretty print。
- sexp.js -- sexp parser。
- meta-lisp.js -- meta-lisp 的 bootstrap 编译器。
- c.make -- 专门用来构建 c 子项目的可被引用的通用 makefile。
- cmd.c -- 用来实现命令行程序的 c library。
- helpers.c -- 通用的 c modules，用 scalable-c 风格写成。
- stack-lisp.c -- stack VM 解释器。
- meta-builtin.meta -- meta-lisp 中 builtin 函数的声明，与简单 builtin 函数的实现。
- meta-examples.meta -- 测试用的 meta-lisp 项目。
- meta-lisp.meta -- meta-lisp 的 self-hosting 编译器（WIP）。

# 文档

- docs/design -- 我计划设计的新 lisp 语言。
- docs/diary -- 这个项目的编程日志，记录设计决策。
  在解决问题的过程中，你可以经常参考这个日志中的笔记。

# 任务

我会在 TODO.md 中记录我计划做的任务。

# 开发

测试：

- 每个 `projects/` 中的每个 project 都有 `scripts/`，
  其中包含测试脚本与其他工具脚本。

项目顶层的 `scripts/` 中包含：

- 清理：`sh scripts/clean.sh`
- 构建：`sh scripts/build.sh`
- 测试：`sh scripts/test.sh`
- 格式化：`sh scripts/format.sh`
- 完整流程：`sh scripts/all.sh`

注意事项：

- C 项目必须先于 JS 包构建（因为 JS 包可能依赖 C 项目生成的文件）。
- meta 项目不在 `pnpm run -r test` 覆盖范围内，需要单独运行。
- 快照文件在 `projects/*/snapshot/` 目录中。
- JS 包使用 `pnpm run test` 进行测试。
