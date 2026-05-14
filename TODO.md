# local (define)

[meta-example.meta] expSubst 处理 Assign 和 LocalDefine 的方式错了

和 desugarDefine 类似，Assign 和 LocalDefine 只能出现在 Begin 的 body 中。
需要有 substBegin 而不应该有对 Assign 和 LocalDefine 的直接 subst（遇到时报错）。

[docs] [reference] syntax.md -- 为 (letrec*) 和 local (define) 补充语法文档。

- 先不要写 (letrec) 的文档，因为 letrec-sequential-binding 的情况有 runtime error。
  其设计我还没有确定。

[meta-lisp.js] fix the problem of letrec-sequential-binding-error.meta

- 要么就放弃 letrec 这个语法。
- 要么给出更好的运行时报错。

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
