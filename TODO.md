rename project to meta-lisp

# docs

[docs] [guide] 删除 type-system.md，类型相关的所有语法都在 syntax.md 中介绍。

- 以 syntax.md 的风格和体例为主。
- 要介绍和类型有关的所有语法，比如 (->)。
- 在适当的章节，介绍所有内置类型。

# local (define)

[meta-lisp.js] support using `define` in function body -- use lambda lift

- support recursive and mutual recursive function

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
