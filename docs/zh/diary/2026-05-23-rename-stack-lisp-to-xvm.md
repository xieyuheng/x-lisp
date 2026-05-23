---
title: rename stack-lisp to xvm
author: xieyuheng
date: 2026-05-23
---

将 stack-lisp 改名为 xvm。

之前叫做 stack-lisp 是因为要模仿 forth 的运行时设计，
即用一个独立的 `value_stack` 传递参数。

现在不想再受限于这个设计。
