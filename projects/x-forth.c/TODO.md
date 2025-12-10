# compile

[builtin] `x_define_variable`
[builtin] `x_define_function`

[builtin] `compile_token`

```ruby
1 @var x
2 @const n
@def square ( x )
  x x mul
@end
```

# placeholder

[lang] `placeholder_t`
[lang] `mod_t` -- has record of `placeholders`

[lang] extract `define`
[lang] `define` -- call `patch_definition`

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
