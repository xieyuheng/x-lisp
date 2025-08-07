(require "lambda.lisp")

(var-exp "x")
(apply-exp (var-exp "f") (var-exp "x"))
(lambda-exp "x" (apply-exp (var-exp "f") (var-exp "x")))

(let ((exp (apply-exp (var-exp "f") (var-exp "x"))))
  (assert (apply-exp? exp))
  (assert (equal? (apply-exp-target exp) (var-exp "f")))
  (assert (equal? (apply-exp-arg exp) (var-exp "x"))))

(begin
  (= exp (apply-exp (var-exp "f") (var-exp "x")))
  (assert (apply-exp? exp))
  (assert (equal? (apply-exp-target exp) (var-exp "f")))
  (assert (equal? (apply-exp-arg exp) (var-exp "x"))))
