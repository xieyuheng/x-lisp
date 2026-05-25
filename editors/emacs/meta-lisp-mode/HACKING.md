---
title: hacking notes
author: opencode/deepseek-v4-pro
---

## 我写 meta-lisp-mode 用到的库

全部是 Emacs 内置的，没有外部依赖：

| 库                    | 用途                                                                       |
|-----------------------|----------------------------------------------------------------------------|
| `define-derived-mode` | 派生 `prog-mode` 作为模式入口                                              |
| `font-lock`           | 语法高亮（`font-lock-defaults`、`font-lock-keywords`、`font-lock-ensure`） |
| `syntax-ppss`         | 解析当前点的 S-expression 嵌套状态，用于缩进计算                           |
| `ert`                 | Emacs 内置测试框架（`ert-deftest`、`ert-run-tests-batch-and-exit`）        |
| `cl-lib`              | 轻微使用（`cl-lib` 的 `dotimes`）                                          |

关键 API 就这些：**syntax table** 管字符分类（括号、注释、字符串、符号构成）、**font-lock** 管颜色、**syntax-ppss** 管缩进时的包含 sexp 查找。三块独立，很好理解。

## 学习资源推荐

### 必读（官方）

- **An Introduction to Programming in Emacs Lisp** — Emacs 自带（`C-h i m eintr RET`），最友好的入门书
- **GNU Emacs Lisp Reference Manual** — `C-h i m elisp RET`，写 mode 时重点读「Major Modes」一章

### 网站

- [**Mastering Emacs**](https://www.masteringemacs.org/) — modern blog，有写 major mode 的专题文章
- **EmacsWiki — Writing Major Modes** — 社区总结的模式编写技巧

### 读源码

- Emacs 自带的 `lisp-mode.el`、`python.el` — 看真正 mode 怎么写 `define-derived-mode`、syntax table、font-lock
- `racket-mode`、`clojure-mode` — 非 lisp-mode 派生的独立实现，和我们同路

### 调试技巧

写 mode 时最有用的：
- `M-: (syntax-ppss)` — 查看当前点的 parse state
- `M-x describe-face` — 查看某个 face 的外观
- `C-u C-x =` — 查看当前字符的 text properties（face 等）
- `M-x ert RET test-name RET` — 交互式运行单个测试
