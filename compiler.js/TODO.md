[frontend] be explicit about structural recursion in passes

# backend

[backend] `Tael` -- `Curry` follow the same logic

- need `ExposeAllocationPass` after `UnnestOperandPass`,
  or maybe we should call it `ExposeCollectionPass`,
  to hand literal collection-like data such as `@tael` and `@curry`.

# frontend

[frontend] `030-ExplicateControlPass`

# backend -- module

[backend] `Stmt` -- `Import`
[backend] `Stmt` -- `Include`

# backend -- bundling

[backend] `Mod` -- bundle

# compiler

[compiler] `compileMod`
