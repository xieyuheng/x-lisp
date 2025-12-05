# lang

> port inet-forth or inet-lisp

[vm] `mod_t` -- for the outer interpreter

[vm] `definition_t`
[vm] `function_definition_t`
[vm] `primitive_function_definition_t`
[vm] `variable_definition_t`
[vm] `constant_definition_t`

# lang

[lang] vm byte code design
[lang] worker

# outer interpreter

[lexer] port the lexer of sexp.js

- has full context -- `text` and `path` (or `url`)
- support comment this time

[interpreter] forth outer interpreter -- run builtin functions like a calculator

- design with repl in mind

# sexp

[sexp] port sexp.js

- support comment this time
- with router like api
