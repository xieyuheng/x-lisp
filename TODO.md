[docs] [reference] builtin -- 我们在 [meta-builtin.meta] 中，还实现了那些新函数，没有被文档记录的？

帮我总结一下。

注意：

- 带有 `-with-location` 后缀的是内部函数，不需要文档。

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
