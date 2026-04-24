---
title: execution format
date: 2026-04-25
---

一般的汇编语言都要有 section 的功能，
来区分 code 和 data，或者保存 metadata。

因此，汇编语言会生成复杂的二进制可执行文件，比如：

- linux 的 ELF 格式。
- wasm 的 .wasm 格式。

复杂的二进制可执行文件格式能快速 load，
但是需要很多特殊的对格式的设计，
对于现阶段的 stack-lisp 来说，
现在固定这些设计显然是过早的。

有些极简的汇编语言，比如 uxn/tal，
可以做到汇编语言的职责只是单纯地「按顺序排布 bytes」。
如果以这个单纯职责为限制，
设计 stack-lisp 的 bytecode 格式也许是值得的。

但是现推迟二进制格式的设计，
使用纯文本的 sexp 格式的 .stack 文件。
这是最灵活的。
