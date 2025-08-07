(define-data exp?
  (var-exp (name string?))
  (apply-exp (target exp?) (arg exp?))
  (lambda-exp (bound-name string?) (body exp?)))

(var-exp "x")
(apply-exp (var-exp "x") (var-exp "x"))
(lambda-exp "x" (apply-exp (var-exp "x") (var-exp "x")))
