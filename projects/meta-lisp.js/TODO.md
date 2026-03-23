# record syntax

parse `(extend)`

`evaluate` -- `Extend`
`typeInfer` -- `Extend`

test `(extend)` edge case:

```caml
\r → if True then {x = 2 | r} else {y = 2 | r}
```

`Update` & `UpdateMut` -- as `Exp`
parse `(update)` `(update!)`
test `(update)` `(update!)`

# basic-lisp

bring basic-lisp back

# stack-lisp

design stack-lisp -- stack-lisp.c

# later

rename .lisp to .meta
rename .lisp in design/
