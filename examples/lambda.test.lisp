(import "lambda.lisp"
  var-exp
  var-exp?
  var-exp-name
  apply-exp
  apply-exp?
  apply-exp-target
  apply-exp-arg
  lambda-exp
  lambda-exp?
  lambda-exp-bound-name
  lambda-exp-body)

(var-exp "x")
(apply-exp (var-exp "f") (var-exp "x"))
(lambda-exp "x" (apply-exp (var-exp "f") (var-exp "x")))

(let ((exp (apply-exp (var-exp "f") (var-exp "x"))))
  (assert (apply-exp? exp))
  (assert (equal? (apply-exp-target exp) (var-exp "f")))
  (assert (equal? (apply-exp-arg exp) (var-exp "x"))))
