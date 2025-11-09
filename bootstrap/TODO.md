# lang -- module

[lang] remove `modFlatMapDefinitionEntry`
[lang] `compile` -- no need to update `mod` variable
[lang] `onDefinition` update definition inplace

- reference to name in another module is direct via `Definition`,
  thus reference to `Definition` also need to be stable.

[lang] `011-RevealFunctionPass` -- check imported names
[lang] `030-ExplicateControlPass` -- translate module statements

[lang] `RunViaBasicCommand` -- use `bundle`

# machine

[machine] setup compiler/machine
[machine] no function just block

# compiler

[compiler] `compileToX86Assembly`
