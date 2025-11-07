# basic -- module

[basic] `Definition` has reference to `mod`

[basic] `load` -- `stage2` -- handle `Import`
[basic] `load` -- `stage2` -- handle `Include`

[basic] `Mod` has `dependencies` -- `Map` of `Mod`
[basic] `load` -- take `dependencies` as argument

[basic] `load` -- `Include` recursive `load`
[basic] `load` -- `Import` recursive `load`

# basic -- bundling

[basic] `bundle` -- setup
[basic] `bundle` -- take `mod` and `loader`
[basic] `bundle` -- use `§` as prefix

[basic] always run module via `bundle`

# lang -- module

[lang] `Mod` has `dependencies`

[lang] do side effect on passes -- to have a stable `Mod` reference

- `modUpdateDefinition` instead of `modMapDefinition`

  - remove `modFlatMapDefinitionEntry`

[lang] reference to name in another module is direct via `Definition`

- thus reference to `Definition` also need to be stable

[lang] `011-RevealFunctionPass` -- check imported names
[lang] `030-ExplicateControlPass` -- translate module statements

# machine

[machine] setup compiler/machine
[machine] no function just block

# compiler

[compiler] `compileToX86Assembly`
