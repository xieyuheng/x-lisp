(require "lambda.lisp")

(var-exp 'x)
(apply-exp (var-exp 'f) (var-exp 'x))
(lambda-exp 'x (apply-exp (var-exp 'f) (var-exp 'x)))

(begin
  (= exp (apply-exp (var-exp 'f) (var-exp 'x)))
  (assert (apply-exp? exp))
  (assert (equal? (apply-exp-target exp) (var-exp 'f)))
  (assert (equal? (apply-exp-arg exp) (var-exp 'x))))

(begin
  (= id-exp (lambda-exp 'x (var-exp 'x)))
  (= id-id-exp (apply-exp id-exp id-exp))
  (assert (equal? (eval id-exp empty-env)
                  (closure 'x (var-exp 'x) empty-env)))
  (assert (equal? (eval id-id-exp empty-env)
                  (closure 'x (var-exp 'x) empty-env)))  )
