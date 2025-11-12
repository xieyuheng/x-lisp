[machine] fix `transpileIdentifier` -- should take `parts` and add `_` in the front

[machine] `Stmt` -- `DefineData`
[machine] `parseStmt` -- `define-data`

[machine] use instruction database to support pseudo instruction

- jmp-indirect
- jmp-if -- cc as operand
- jmp-indirect-if -- cc as operand
- branch-if

# compiler

[compiler] `compileToX86Assembly`
