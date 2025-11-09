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

# project

[project] setup
[project] load project.json

# machine

[machine] setup compiler/machine
[machine] no function just block

# compiler

[compiler] `compileToX86Assembly`
