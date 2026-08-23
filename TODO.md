[x86] assembler 速度慢

现在 我们的汇编器速度非常慢：

  xyh@lattice /home/xyh/projects/xieyuheng/meta-lisp/packages/meta-pass-dump.meta (master) [1]
$ time ./meta-lisp.js assemble-x86 build/example.x86.asm build/example.x86.exe

________________________________________________________
Executed in    9.38 secs    fish           external
   usr time    5.25 secs    0.14 millis    5.25 secs
   sys time    4.58 secs    1.07 millis    4.58 secs

分析一下速度慢的原因


[x86] review assembler

- the dest operand of `shl shr sar` must be register
- `and` 也有问题：

  ```
  $ time ./meta-lisp.js assemble-x86 build/bundle.x86.asm build/bundle.x86.exe
  Error: [and] unsupported operands: dst=RegMemOperand src=ImmOperand
  ```

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
