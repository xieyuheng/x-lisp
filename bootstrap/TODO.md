# basic -- module

[basic] `load` -- handle `Import` and `Include` and `Export` -- setup `Mod`

[basic] `Mod` has `dependencies` -- `Map` of `Mod`
[basic] `load` -- take `dependencies` as argument
[basic] `load` -- handle `Import` and `Include` and `Export` -- recursive `load`

# basic -- bundling

[basic] `bundle` -- setup
[basic] `bundle` -- take `mod` and `loader`
[basic] `bundle` -- use `§` as prefix

# lang -- module

[lang] `Mod` has `dependencies`

[lang] [maybe] do side effect on passes -- to have a stable `Mod` reference

- `modUpdateDefinition` instead of `modMapDefinition`

  - remove `modFlatMapDefinitionEntry`

- reference to name in another module should be indirect,
  thus reference to `Definition` no need to be stable

[lang] `011-RevealFunctionPass` -- check imported names
[lang] `030-ExplicateControlPass` -- translate module statements

# machine

[machine] setup compiler/machine
[machine] no function just block

# compiler

[compiler] `compileToX86Assembly`
