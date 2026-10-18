---
title: give up script and REPL
author: xieyuheng
date: 2026-09-14
---

放弃单文件的 script 功能，
始终以 package 为单位来检查/编译/运行代码。

因为这样有 package 的 config 文件，
其中可以把很多原本需要约定的信息显式地写出，
比如 builtin package 的位置。

同样的原因，也放弃 REPL 功能。
