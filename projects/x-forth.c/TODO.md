# lang

[core] `definition_t`
[core] `function_definition_t`
[core] `primitive_function_definition_t`
[core] `variable_definition_t`
[core] `constant_definition_t`

[core] `make_mod` -- setup `definition_free`

[core] `placeholder_t`
[core] `mod` -- have `placeholders` -- for patching undefined names

# lang

[lang] vm byte code design
[lang] worker

# outer interpreter

[lexer] port the lexer of sexp.js

- has full context -- `text` and `path` (or `url`)
- support comment this time

[lang] `execute` -- support `primitive_function_definition_t` first

- `execute` -- call `in_mod`
- forth outer interpreter -- run builtin functions like a calculator
- design with repl in mind

# sexp

[sexp] port sexp.js

- support comment this time
- with router like api
