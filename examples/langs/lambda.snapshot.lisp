(import-all "lambda.lisp")

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

(begin
  (= file (path-join [(current-module-directory) "example.lambda"]))
  (= exp (parse-sexp (file-read file)))
  (eval (parse-exp exp) empty-env))
