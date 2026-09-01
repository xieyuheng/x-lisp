# xvm2

[xvm2] 删除 `default-entry`
[xvm2] rename ©main to main, ©test to test

[xvm2] syntax 文档草稿转正 -- 语法结构分析是否合理？

[xvm2] executable 文档草稿
[xvm2] instructions 文档草稿

[xvm2] `xvm_t`
[xvm2] .xvm.exe loader -- use TLV
[xvm2] 实验 direct threaded code，看看是否比平凡的 switch 速度快

[meta-lisp.js] assemble basic-lisp to .xvm.exe
[meta-lisp.js] remove `xvm/`

# x86

[x86] review loader
[x86] review assembler

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
