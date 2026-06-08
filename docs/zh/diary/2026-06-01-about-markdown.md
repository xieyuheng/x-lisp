---
title: about markdown
author: xieyuheng
date: 2026-06-01
---

# markdown 浏览器

- meta-lisp 解析 markdown，回归到我之前用 org mode 写代码的风格。
- 只需要解析 headline 的 tree。
- 通过扩展 headline 来制作 little books。
- headline 形成代码 tree，godot 游戏引擎也是代码 tree。
- 用 meta-lisp 写 markdown 的浏览器。被浏览的文档格式可以多种多样。

# 类似 emacs

[2026-06-08]

emacs 和 emacs-lisp 是非常适合 vibe coding 的，
因为 emacs 没有编辑器扩展接口，
可以写脚本调用所有 emacs 的函数，来扩展 emacs。

关于 markdown 的浏览器：

- 应该像 emacs 一样可扩展。
- 类似 terminal，有等宽字体限制，也就是有一个 grid UI 设计限制。
- 类似 browser，可以渲染 UI，然是不用 box 模型，而是直接渲染 pixel。

为了保持简单，只支持 bitmap 字体，从 unifont 开始。
