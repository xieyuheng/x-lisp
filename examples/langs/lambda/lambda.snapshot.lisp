(import-all "lambda.lisp")

(define (run-exp sexp)
  (eval (parse-exp sexp) empty-env))

(run-exp '(lambda (x) x))
(run-exp '((lambda (x) x) (lambda (x) x)))

(begin
  (= file (path-join [(current-module-directory) "example.lambda"]))
  (= sexp (parse-sexp (file-read file)))
  (run-exp sexp))
