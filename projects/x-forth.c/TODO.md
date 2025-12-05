# mod & definition

[core] `make_variable_definition` -- has value
[core] `make_constant_definition` -- has value
[core] `make_function_definition` -- has code

[core] `primitive_function_t`
[core] `make_primitive_function_definition` -- has `primitive_function_t`

[core] `make_mod` -- setup `definition_free`

[core] `placeholder_t`
[core] `mod` -- have `placeholders` -- for patching undefined names

# execute

[lexer] port the lexer of sexp.js

- has full context -- `text` and `path` (or `url`)
- support comment this time

[lang] `execute` -- support `primitive_function_definition_t` first

- `execute` -- call `in_mod`
- forth outer interpreter -- run builtin functions like a calculator
- design with repl in mind

# vm

[core] vm byte code design
[core] `vm_t`
[core] `make_vm`
[core] `vm_free`

# define

[lang] `execute` -- call `in_define` on `@define`

# vm

do not compile to bytecode file yet,
but keep it possible (with the helpa of placeholder).

# sexp

[sexp] port sexp.js

- support comment this time
- with router like api
