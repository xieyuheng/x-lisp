更新 AGENTS.md 中的旧语法：(define-data) 和 (define-interface)。

- 改为新语法 (define-enum) 和 (define-struct)。
  - 并说明二者如何展开为更 explicit 的 (define-algebraic-type)。
- 说明语言已经没有子类型关系了。

# literal hash syntax

[meta-lisp.js] give `{}` sugar to `(@hash)` -- like clojure

# setup feedback loop

[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] `evaluate` -- handle type
[meta-lisp.meta] `evaluate` -- fix error report -- maybe need `buffer-t`

# local (define)

[meta-lisp.js] support using `define` in function body -- use lambda lift
- support recursive and mutual recursive function
