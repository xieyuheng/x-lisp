---
title: AI Agent Instructions
---

# 子项目

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

# meta-lisp 语言简介

meta-lisp 是一个静态类型的 lisp 方言，语法设计模仿 scheme。

## 语法特性

- S-expression 语法：`(function arg1 arg2 ...)`
- 类型声明使用 `claim`：`(claim function-name (-> arg-type ... ret-type))`
- 函数定义使用 `define`：`(define (function-name arg ...) body)`
- 匿名函数：`(lambda (arg ...) body)`

## 类型系统

类型：

- 基础类型：`int-t`, `float-t`, `string-t`, `symbol-t`, `keyword-t`, `bool-t`, `void-t`
- 复合类型：`(list-t E)`, `(set-t E)`, `(hash-t K V)`
- 函数类型：`(-> arg-type ... ret-type)`
- 多态类型：`(polymorphic (A B ...) type)`

注意 meta-lisp 类型系统与 TypeScript 的差异：

- meta-lisp 有类似 Haskell 和 ML 的 Hindley-Milner 类型系统。
- 没有 TypeScript 的 union 和 intersection type。

## 控制流

关于局部变量：

- 在 meta-lisp 中：

  ```scheme
  (let ((x ...))
    ...)
  ```

  等价于

  ```scheme
  (begin
   (= x ...)
   ...)
  ```

  而在函数体中，可以省略 `(begin)`。
  因此，你可以用 `(=)` 语法来代替嵌套的 `(let)` 来节省缩进。

关于循环：

- meta-lisp 中没有「循环」相关控制流，需要用尾部递归函数实现「循环」。

## 记录类型（行多态）

```lisp
(define-interface point-t :x int-t :y int-t)
(@record :x 1 :y 2)
(extend point :color "red")
```

## 代数数据类型与模式匹配

```lisp
(define-data exp-t
  (var-exp (name symbol-t))
  (lambda-exp (parameter symbol-t) (body exp-t)))

(match exp
  ((var-exp name) ...)
  ((lambda-exp parameter body) ...))
```

## 模块系统

- `(module name)` 声明模块
- `(import-as mod-name alias)` 更换模具名字前缀
- `(import mod-name name ...)` 从模块导入名字
- `(import-all mod-name)` 导入模块中的所有名字
- 限定变量：`mod-name/name`
- 内置函数为 `builtin/` 前缀：`(builtin/string-length "abc")`

## 项目组件

- `meta-lisp.js` -- bootstrap 编译器（TypeScript 实现）
- `meta-lisp.meta` -- self-hosting 编译器（meta-lisp 实现，WIP）
- `meta-builtin.meta` -- builtin 函数声明与简单实现
- `meta-examples.meta` -- 测试用的 meta-lisp 项目

## 内置函数声明

在 `meta-builtin.meta/src/` 中，每个类型有独立目录：
- `int/`, `float/`, `string/`, `list/`, `hash/`, `set/`, `record/` 等
- 使用 `(declare-primitive-function name arity)` 声明
- 使用 `(claim name type)` 指定类型

# 文档

- docs/design -- 我计划设计的新 lisp 语言。
- docs/diary -- 这个项目的编程日志，记录设计决策。
  在解决问题的过程中，你可以经常参考这个日志中的笔记。

# 开发

任务：

- 我会在 TODO.md 中记录我计划做的任务。

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
