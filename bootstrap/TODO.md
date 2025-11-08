rename run-basic to basic:run
rename bundle-basic to basic:bundle

# basic -- bundle

[basic] refactor `bundle`

[basic] more tests about module

[basic] support `Comment` -- `Stmt`
[basic] `Mod` -- `CommentDefinition` to format with comment in order
[basic] `formatMod` -- support `Comment`
[basic] `bundle` -- save prefix map in `Comment`

# lang -- module

[lang] `Mod` has `dependencies`

[lang] do side effect on passes -- to have a stable `Mod` reference

- `modUpdateDefinition` instead of `modMapDefinition`

  - remove `modFlatMapDefinitionEntry`

[lang] reference to name in another module is direct via `Definition`

- thus reference to `Definition` also need to be stable

[lang] `011-RevealFunctionPass` -- check imported names
[lang] `030-ExplicateControlPass` -- translate module statements

[lang] `RunViaBasicCommand` -- use `bundle`

# machine

[machine] setup compiler/machine
[machine] no function just block

# compiler

[compiler] `compileToX86Assembly`
