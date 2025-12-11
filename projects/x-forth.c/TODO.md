# compile
referred
[builtin] `compile_token` -- handle `@return` -- early return
[builtin] `compile_token` -- handle `@tail-call <name>` -- be explicit
[lang] `function_definition` -- has `local_indexes` record
[builtin] `compile_parameters` -- compile to local store
[builtin] `compile_local_stores` -- compile to local store
[builtin] `compile_token` -- handle local reference
[test] syntax/square.test.fth

```ruby
@def square [x]
  x x imul
@end
```

# placeholder

[lang] `placeholder_t` -- one placeholder many places to patch
[lang] `mod_t` -- has record of `placeholders`
[lang] `placeholder_patch`
[lang] `mod_define` -- call `placeholder_patch`
[lang] `OP_PLACEHOLDER` -- like `op_t` with `definition` field
[lang] `vm_execute_instr` -- report error on `OP_PLACEHOLDER` -- find placeholder in `vm->mod`

# later

[lang] `vm_execute_instr` -- `OP_LITERAL_STRING`
[lang] `vm_execute_instr` -- `OP_LITERAL_SYMBOL`
[lang] `vm_execute_instr` -- `OP_LITERAL_KEYWORD`

# ref as value

[value] fix `ref_t` -- should be reference to `definition`
[value] remove `function_t`
[value] remove `x_address`

# read-execute-loop

[lang] add `read-execute-loop` function to the bottom of the stack

- `read-execute-loop` must NOT be a primitive function

[lang] remove `vm_execute_until`
