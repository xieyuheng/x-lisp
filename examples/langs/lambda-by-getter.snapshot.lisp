(require "lambda-by-getter.lisp")

(var-exp 'x)
(apply-exp (var-exp 'f) (var-exp 'x))
(lambda-exp 'x (apply-exp (var-exp 'f) (var-exp 'x)))
