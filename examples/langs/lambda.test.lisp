(require "lambda.lisp")

(assert
  (equal?
   (eval (parse-exp
          '(lambda (x) x))
         empty-env)
   (closure 'x (var-exp 'x) empty-env)))

(assert
  (equal?
   (eval (parse-exp
          '((lambda (x) x) (lambda (x) x)))
         empty-env)
   (closure 'x (var-exp 'x) empty-env)))

;; (eval (parse-exp (parse-sexp (file-read "code")))
;;       empty-env)
