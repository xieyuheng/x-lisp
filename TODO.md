[meta-builtin.meta] 把所有的 (claim <name> type-t) 改为 (claim-type <name>)
[meta-lisp.js] 把 `(define-type)` 语法改名为 `(define-type-alias)`
- 相应的 `DefineType` Stmt 也要改为 DefineTypeAlias

# (import-all) override

[meta-lisp.js] `ImportPass` -- `ImportAll` -- if name is already defined in the module, do not import

- module can override builtin names

[meta-examples.meta] test module can override builtin names

# syntax

[meta-lisp.js] give `{}` sugar to `(@hash)` -- like clojure

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`

# local (define)

[meta-lisp.js] support using `define` in function body -- use lambda lift
- support recursive and mutual recursive function
