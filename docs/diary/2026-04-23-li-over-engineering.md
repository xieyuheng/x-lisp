---
title: li over-engineering
date: 2026-04-23
---

反思一下 li 的设计过程中的 over-engineering。

所需要的程序其实是一个汇编器，
汇编器更简洁的本质是 layout bytes。

但是对于 li 这个汇编器，我设计成了一个可嵌套的 kv 数据库。
其实只是因为我需要在 runtime 拿到一些 metadata：

- primitive function 和 function 的 arity。
- function 是否代表 variable。
- function 是否代表 test。

最直接的解决方案是，在汇编语言中设计特殊的语法来保存这些 metadata。

本质的问题在于，可否避免这些 metadata。

- function 的 arity 是为了让 runtime 的 apply 可以处理不同 value。
  可否完全避免在 runtime 的 apply 中做 dispatch？
- variable 可以用 variable setup function 来处理。

over-engineering 会让人忽略本质问题，
比如这里本质的问题是「可否在编译时处理 arity」。

over-engineering 会产生新的伪需求，
比如设计了数据库，就自然需要持久化。
