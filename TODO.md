parse `(compose)` & `(pipe)`

# maybe

`(include)` -- support `:only` -- `(include <path> :only [<name> ...])`
`(include)` -- support `:except` -- `(include <path> :except [<name> ...])`

`(require)` -- support `:only` and `:except`
- if `(include)` support them, so should `(require)`,
  but `(require :only)` is the same as `(import)`.
