---
title: How should I implement SSA?
date: 2025-11-03
---

要写 `030-ExplicateControlPass` 了，
但是我现在不确定我的 basic-lisp API 设计是否够好。
因此学一波 SSA。

在设计上，主要犹豫的地方是：

- 我不想在 basic-lisp 中，像 EOC 一样，继续使用 exp 的概念。

- 在 bril 的统一的 `Instr` 中，
  没有区分特殊的 control-flow instruction，
  与一般的只要给出 `PrimitiveFunction` 就能完全定义的简单 instruction。
  而我有必要做出区分。

  因为我的所有 primitive instruction 比如 iadd 都是要用 `call` 来表达的的。

- 是否像 bril 一样，让所有的 operand 都只能是 variable？

读了 Filip Pizlo 的
[How I implement SSA form](https://gist.github.com/pizlonator/cf1e72b8600b1437dda8153ea3fdb963)。

决定：

- 有必要像 bril 一样，让所有的 operand 都只能是 variable。

- instruction 要带有 uniform effect representation。

- 使用 attributes 相近的 AST 来实现 `Instr`，不用纯粹 generic 的 `Instr`。

  比如，所有 instruction 都带有可选的 dest。

  - 否则就要区分 `Assign` 和 `Effect`，
    而 `Assign` 的 rhs 可能是 `Call`。
    这样如果 `Assign` 是 instruction，
    那么 `Call` 就是比 instruction 次一级的概念了，
    比如 EOC 用了 `Exp` 来表示 `Call`。
