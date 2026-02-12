# claim

[lisp] `Arrow` as `Exp` -- `evaluate` to `[#-> <arg-schemas> <ret-schema>]`

[lisp] `x_the` -- if schema is arrow, return `[#the <schema> <target>]`

- `apply` handle `[#the <schema> <target>]` as target

[lisp] `expandClaim` -- test by `my-string-repeat`
[pass] `ElaborateClaimed` -- before `ShrinkPass`

# later

[lisp] `expandClaim` -- handle `(polymorphic)`
[lisp] `Specific` as `Exp` -- like `Apply`

# pattern match

# later

[pass] `desugarCond` -- report `error` about mismatch -- instead of `assert`
