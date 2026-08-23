[x86] assembler 目前有一些指令模式还不支持：

- the dest operand of `shl shr sar` must be register
- `and` 也有问题 `Error: [and] unsupported operands: dst=RegMemOperand src=ImmOperand`

分析一下这些问题是 x86 的局限，还是 我们的汇编器的 bug。
应该如何解决？

[x86] review assembler
[x86] review loader

# native code generation

[meta-lisp.js] 190-SelectInstructionPass -- `selectInstr`

[meta-lisp.js] 190-SelectInstructionPass -- `selectDefinition` -- handle `StructDefinition`
[meta-lisp.js] 190-SelectInstructionPass -- `selectDefinition` -- handle `VariableDefinition`
[meta-lisp.js] 190-SelectInstructionPass -- `selectDefinition` -- handle `ExternFunctionDefinition`
[meta-lisp.js] 190-SelectInstructionPass -- `selectDefinition` -- handle `ExternVariableDefinition`

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
