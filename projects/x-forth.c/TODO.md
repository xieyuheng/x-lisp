# vm

[core] `primitive_free`

[core] `make_primitive_definition` -- has `primitive_t`

[core] vm byte code instruction design

[core] `instr_encode`
[core] `instr_decode`

[core] `placeholder_t`
[core] `mod` -- have `placeholders` -- for patching undefined names

# define

[core] `define_constant`
[core] `define_variable`
[core] `define_function`
[core] `define_primitive_fn`
[core] `define_primitive_fn_<n>` -- 0 to 6

# execute

[lexer] port the lexer of sexp.js

- has full context -- `text` and `path` (or `url`)
- support comment this time

[lang] `execute` -- support `primitive_definition_t` first

- `execute` -- call `in_mod`
- forth outer interpreter -- run builtin functions like a calculator
- design with repl in mind

[core] setup `commnads/`

# value

[value] fix `function_t` -- should be reference to `definition`

- maybe use `ref_t` instead of `function_t`
- `@ref` vs `@function`

[value] remove `address_t`

# define

[lang] `execute` -- call `in_define` on `@define`

# sexp

[sexp] port sexp.js

- support comment this time
- with router like api

# cicada-forth

x-forth with chinese syntax keywords
