# basic -- module

[basic] `Ref` -- has `name` `from` `as`
[basic] `Mod` has `importedRefs` and `includedRefs` and `exportedNames`
[basic] `Mod` has `dependencies` -- `Map` of
[basic] `load` -- handle import and include statements

# basic -- bundling

[basic] `bundle` -- setup
[basic] `bundle` -- take `mod` and `loader`
[basic] `bundle` -- use `§` as prefix

# frontend -- module

[frontend] `Mod` has `dependencies`

[frontend] [maybe] do side effect on passes -- to have a stable `Mod` reference

- `modUpdateDefinition` instead of `modMapDefinition`

  - remove `modFlatMapDefinitionEntry`

- reference to name in another module should be indirect,
  thus reference to `Definition` no need to be stable

[frontend] `011-RevealFunctionPass` -- check imported names
[frontend] `030-ExplicateControlPass` -- translate module statements

# machine

[machine] setup compiler/machine
[machine] no function just block

# compiler

[compiler] `compileToX86Assembly`
