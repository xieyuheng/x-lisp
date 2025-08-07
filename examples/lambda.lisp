(define-data exp?
  (var-exp (name string?))
  (apply-exp (target exp?) (arg exp?))
  (lambda-exp (bound-name string?) (body exp?)))
