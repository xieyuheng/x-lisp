[stack-lisp.c] `format_source_location_report` 函数改名为 `format_message_with_source_location`

- 交换 location 与 message 的顺序。

[stack-lisp.c] 增加新的 builtin 函数 format-message-with-source-location

- 放在 sexp.c 和 sexp.h 中。
- format-message-with-source-location 的类型为：
  (claim format-message-with-source-location (-> string-t source-location-t string-t))

[meta-builtin.meta] format-message-with-source-location
[meta-builtin.meta] box -- 实现 box-get-with-location 类似 assert-with-location

- 在运行时报错的时候调用 format-message-with-source-location 来报错

[meta-lisp.js] desugarLetrecStar 在代码中给出翻译例子 -- 使用 box
[meta-lisp.js] 修复 letrec 的 desugarLetrec，在代码中给出翻译例子
[meta-lisp.js] 修复 letrec-sequential-binding-error.meta


[meta-lisp.js] 可否先实现一个 `expIsCore` 函数来明确哪些是 desugar 之后的核心语法？
[meta-lisp.js] 实现一个 `expNaiveSubst` 不处理 capture avoidance，只处理 bound variable shadowing

# setup feedback loop

[meta-lisp.meta] remove `env` `evaluate` and `value`
[meta-lisp.meta] `expand-pass`
[meta-lisp.meta] `mod-t` -- complete
[meta-lisp.meta] `definition-t` -- fix type of `(fn (-> (list-t value-t) value-t))`
[meta-lisp.meta] fix error report -- maybe need `buffer-t`
