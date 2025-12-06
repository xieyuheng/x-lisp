# vm

[core] `make_vm`
[core] `vm_free`

[core] `vm_t` -- has `tokens` (`array_t`)

[core] `frame_t` -- has `definition` (`function_definition`) and `pc`
[core] `make_frame`
[core] `frame_free`

[core] vm byte code instruction design

[core] `instr_encode`
[core] `instr_decode`

# mod & definition

[core] `make_function_definition` -- has `code` and `code_size` -- no abstraction for code

[core] `primitive_function_t`
[core] `make_primitive_function_definition` -- has `primitive_function_t`

[core] `make_mod` -- setup `definition_free`

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

[lang] `execute` -- support `primitive_function_definition_t` first

- `execute` -- call `in_mod`
- forth outer interpreter -- run builtin functions like a calculator
- design with repl in mind

# define

[lang] `execute` -- call `in_define` on `@define`

# vm

do not compile to bytecode file yet,
but keep it possible (with the helpa of placeholder).

# sexp

[sexp] port sexp.js

- support comment this time
- with router like api

# cicada-forth

x-forth with chinese syntax keywords
