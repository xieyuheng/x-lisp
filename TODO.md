[builtin] `aboutSchema` -- `valid?`
[builtin] `list?` -- call `isValid` instead of `apply`

```scheme
(the (list? (-> int? int?))
  [(iadd 1) (iadd 2) (iadd 3)])
```

> all polymorphic schema taken function should all `valid?` instead of `apply`

[builtin] `set?` -- call `isValid` instead of `apply`
[builtin] `record?` -- call `isValid` instead of `apply`
[builtin] `hash?` -- call `isValid` instead of `apply`
[builtin] `optional?` -- call `isValid` instead of `apply`

test my-list of arrow

# error report

fix (validation) error report -- be more clear about args

- index or count? it is not clear
- wrap in `(the)` is not clear
