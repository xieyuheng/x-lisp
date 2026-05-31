# review

[meta-lisp.meta] [refactor] parse-exp.meta -- add @comment to parse-special-form-exp

[meta-lisp.meta] [refactor] parse-exp.meta -- parse-cond-clause 逻辑冗余

else 分支之后的两个分支（else 为假 和 symbol-sexp? 为假）代码完全一样。可简化成：

(if (and (symbol-sexp? (list-head elements))
         (equal? (symbol-sexp-content (list-head elements)) 'else))
  (make-cond-clause (qualified-var-exp 'meta-builtin 'builtin 'true location) ...)
  (make-cond-clause (parse-exp (list-head elements)) ...))


[meta-lisp.meta] [refactor] parse-binding 使用 (list-head (list-drop 1 elements)) 等价于 (list-get 1 elements)

[meta-lisp.meta] [review] parse-exp.meta

[meta-lisp.meta] [review] parse-stmt.meta
[meta-lisp.meta] [refactor] parse-stmt.meta -- add @comment to syntax of stmt

[meta-lisp.meta] [review] 010-expand-pass.meta

# self-hosting

[meta-lisp.meta] 020-module-prelude-pass.meta
[meta-lisp.meta] 030-module-analysis-pass.meta
[meta-lisp.meta] 040-algebraic-analysis-pass.meta
[meta-lisp.meta] 050-lower-match-pass.meta
[meta-lisp.meta] 060-desugar-pass.meta
[meta-lisp.meta] 070-module-import-pass.meta
[meta-lisp.meta] 080-execute-pass.meta
[meta-lisp.meta] 090-claim-pass.meta
[meta-lisp.meta] 100-qualify-pass.meta
[meta-lisp.meta] 110-check-pass.meta
[meta-lisp.meta] 120-locate-pass.meta
[meta-lisp.meta] 130-shrink-pass.meta
[meta-lisp.meta] 140-uniquify-pass.meta
[meta-lisp.meta] 150-lift-lambda-pass.meta
[meta-lisp.meta] 160-unnest-operand-pass.meta
[meta-lisp.meta] 170-explicate-control-pass.meta
[meta-lisp.meta] 180-codegen-pass.meta

# compile to native
# socket api and network programming
# http library
