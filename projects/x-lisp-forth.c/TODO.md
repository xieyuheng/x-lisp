# module system

[lang] `load` -- extract `load_stage*`

[lang] `mod` -- `import_entry_t`
[lang] `make_import_entry` & `import_entry_free`

[lang] `mod_t` -- has `import_entries` -- array of `import_entry_t`
[lang] `mod_t` -- has `exported_names` -- set of names

[lang] `mod_import_by`

[lang] `load` -- `stage2` -- handle `import_entries`

[lang] `compile` -- @export
[lang] `compile` -- @import @import-all @import-except @import-as
[lang] `compile` -- @include @include-all @include-except @include-as
