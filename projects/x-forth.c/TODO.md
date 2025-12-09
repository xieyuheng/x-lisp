[builtin] complete current builtin

```c
value_t x_bool_p(value_t x);
value_t x_not(value_t x);

value_t x_null_p(value_t x);

value_t x_void_p(value_t x);

value_t x_anything_p(value_t x);
value_t x_same_p(value_t lhs, value_t rhs);
value_t x_equal_p(value_t lhs, value_t rhs);
```

[lang] `invoke` handle `VARIABLE_DEFINITION` & `CONSTANT_DEFINITION`

[builtin] define true and false as constant

# vm

[lang] `instr_t`

- there should be no value in `instr_t`,
  so that GC root scaning no need to scan instructions.

[lang] `instr_size(instr)`
[lang] `instr_encode(program)`
[lang] `instr_decode(program)`

[lang] [maybe] `placeholder_t`

- maybe we should setup a placeholder definition for every symbol that we meet
- [lang] `mod` -- have `placeholders` -- for patching undefined names

[lang] `invoke` handle `FUNCTION_DEFINITION`

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
