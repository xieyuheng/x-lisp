[project] improve api

[machine] transpile -- callq-n -- take arity
[machine] transpile -- set-if -- take cc
[machine] transpile -- jmp-if -- take cc
[machine] transpile -- branch-if
[machine] transpile -- jmp-indirect
[machine] transpile -- jmp-indirect-if -- take cc

[runtime] value tag encoding -- copy from inet-lisp
[runtime] builtin
[runtime] GC

[basic] `010-SelectInstructionPass` -- `onInstr` -- fix tagged value encoding

[machine] `070-AssignHomePass`
[machine] `080-PatchInstructionPass`
[machine] `090-PrologAndEpilogPass`
