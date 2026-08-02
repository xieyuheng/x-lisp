# 中文

[meta-builtin.meta] 值/atom-test.meta
[meta-builtin.meta] 值/format-test.meta
[meta-builtin.meta] 值/same-test.meta

[meta-builtin.meta] 整数对齐.meta -- 用 相等 修复

[meta-builtin.meta] int-product.meta -- 翻译
[meta-builtin.meta] int-sum.meta -- 翻译

[meta-builtin.meta] process.meta -- 翻译
[meta-builtin.meta] float.meta -- 翻译
[meta-builtin.meta] error.meta -- 翻译

[meta-builtin.meta] 真假测试.meta -- 用 打印行 修复
[meta-builtin.meta] 断言.meta -- 用 源码位置 修复 定位断言

[meta-math.meta] 翻译
[meta-example.meta] 翻译

# learn

快速看完 asm 的书，学习 c calling。
读 Wirth 的论文，学编程。
回顾 EOC 全书，用更合理的方式 比如 how-to-* 来总结编译器实现技巧。
学习 plan9 的编译器 loader 技术。
学习 chez-scheme 的可执行文件格式。

# xvm

xvm 优化，不要放弃这个后端

# lowerBuiltin

iadd isub imul 转化为 basic2 中的 op

# x86-64

review 200-AssignHomesPass.ts
review 210-PatchInstructionsPass.ts
review 220-PrologEpilogPass.ts

# loader

[xexe.c] review loader 的代码。

# native code generation

[meta-lisp.js] 190-SelectInstructionPass -- `selectInstr`

[meta-lisp.js] 190-SelectInstructionPass -- `selectDefinition` -- handle `StructDefinition`
[meta-lisp.js] 190-SelectInstructionPass -- `selectDefinition` -- handle `VariableDefinition`
[meta-lisp.js] 190-SelectInstructionPass -- `selectDefinition` -- handle `ExternFunctionDefinition`
[meta-lisp.js] 190-SelectInstructionPass -- `selectDefinition` -- handle `ExternVariableDefinition`

# learn

学习浮点数 asm 的书。
学习 llvm 的 talk。
学习 stack map 精确 gc：
- topics/computer-science/compiler/2002-engineering-a-compiler.pdf
- topics/computer-science/garbage-collection/2001-constant-time-root-scanning-for-deterministic-garbage-collection.pdf

# self-hosting

[meta-lisp.meta] [review] env.meta
[meta-lisp.meta] [review] apply.meta
[meta-lisp.meta] [review] evaluate.meta

[meta-lisp.meta] 110-locate-pass.meta
[meta-lisp.meta] 120-check-pass.meta
[meta-lisp.meta] 130-shrink-pass.meta
[meta-lisp.meta] 115-uniquify-pass.meta
[meta-lisp.meta] 150-lift-lambda-pass.meta
[meta-lisp.meta] 160-unnest-operand-pass.meta
[meta-lisp.meta] 170-explicate-control-pass.meta
[meta-lisp.meta] 180-codegen-pass.meta

# compile to native
# socket api and network programming
# http library
# write agent in meta-lisp
