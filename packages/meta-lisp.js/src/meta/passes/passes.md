---
title: passes
---

# 引子

编译器在于弥合语言之间的差异。

这里的工序（pass）在于弥合 meta-lisp 和 basic-lisp 之间的差异。

- basic-lisp 是 SSA 中间语言。
  SSA 对语言的重要限制有：

  - 所谓 SSA（static single assignment），
    就是说如果只看静态的代码，
    每个变量只能赋值一次。

    - 在运行时对同一个变量的多次赋值是可以的。

  - 没有嵌套的表达式。
  - 控制流通过 basic block 之间的 goto 来表达。
  - 当多个 block 汇聚到一个 block 时，
    如果要传递数据（或者说传递状态），
    需要用 phi 函数，或者使用类似的 SSU（static single use）机制。

- meta-lisp 带有高级语言的功能，
  需要在 meta-lisp 之内被简化，
  然后才能翻译到 SSA。
  高级功能包括：

  - Hindley-Milner 类型系统，
    即参数多态类型推导系统（Parametric Polymorphic Type Inference System）。
  - 代数数据类型与模式匹配。

- meta-lisp 有套件（package）管理系统，以及模块系统。
  一个套件内有多个模块，一个模块内有多个定义。
  为了保持简单 basic-lisp 没有套件与模块的概念，
  因此在从 meta-lisp 转换到 basic-lisp 时，
  要解析跨模块与跨套件的定义引用，
  并且把所有定义的名字唯一化，
  然后打包成一份 basic-lisp 代码。

# ExpandPass
# ModulePreludePass
# ModuleAnalysisPass
# AlgebraicAnalysisPass
# LowerMatchPass
# DesugarPass
# ModuleImportPass
# SetupPass
# ClaimPass
# QualifyPass
# LocatePass
# UniquifyPass
# CheckPass
# ConvertClosurePass
# LimitArityPass
# UnnestOperandPass
