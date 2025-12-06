# lexer

[lexer] extract `span`
[lexer] `position_forward_char`
[lexer] `span_union`

[lexer] `lexer_lex`

# execute

[lang] `execute_token` -- call `call` on `primitive_definition_t`
[lang] `call`

# command

[helpers.c] port command.js
setup `commands/`
`cmd_run`

# vm

[core] `instr_t`

- there should be no value in `instr_t`,
  so that GC root scaning no need to scan instructions.

[core] `instr_size(instr)`
[core] `instr_encode(program)`
[core] `instr_decode(program)`

[core] `placeholder_t`
[core] `mod` -- have `placeholders` -- for patching undefined names

# value

[value] fix `function_t` -- should be reference to `definition`

- maybe use `ref_t` instead of `function_t`
- `@ref` vs `@function`

[value] remove `address_t`

# define

[lang] `execute_token` -- dispatch to keyword `@define`

# sexp

[sexp] port sexp.js

- support comment this time
- with router like api

# cicada-forth

x-forth with chinese syntax keywords
