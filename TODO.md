[docs] [reference] syntax.md -- `local (define)` 章节的 assert-equal 改为用 ;; => 展示输出
[docs] [reference] syntax.md -- `local (define)` 章节的 顶层 define 改为 begin

[meta-lisp.js] desugarLetrecStar 在代码中给出翻译例子
[meta-lisp.js] 修复 letrec 的 desugarLetrec，在代码中给出翻译例子
[meta-lisp.js] 修复 letrec-sequential-binding-error.meta
[meta-lisp.js] 用 list-t 实现 box

- make-box
- box-put! box-get box-get-maybe

[meta-lisp.js] 可否先实现一个 `expIsCore` 函数来明确哪些是 desugar 之后的核心语法？
[meta-lisp.js] 实现一个 `expNaiveSubst` 不处理 capture avoidance，只处理 bound variable shadowing

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
