(import-all "lambda.lisp")

(eval (parse-exp '(lambda (x) x)) empty-env)
(eval (parse-exp '((lambda (x) x) (lambda (x) x))) empty-env)

(begin
  (= file (path-join [(current-module-directory) "example.lambda"]))
  (= sexp (parse-sexp (file-read file)))
  (eval (parse-exp sexp) empty-env))
