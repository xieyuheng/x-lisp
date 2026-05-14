# docs

[docs] [reference] 编写 builtin/index.md，分类介绍所有 builtin 函数，并带有链接可以跳转到所有 builtin 函数。

要求：

- 逐个函数地，精心编写。禁止用脚本批量生成。

# local (define)

[meta-lisp.js] support using `define` in function body -- use lambda lift

- support recursive and mutual recursive function

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
