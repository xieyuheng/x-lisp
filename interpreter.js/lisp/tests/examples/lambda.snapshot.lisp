(import-all "lambda")

(define (run-exp sexp)
  (eval (parse-exp sexp) empty-env))

(run-exp '(lambda (x) x))
(run-exp '((lambda (x) x) (lambda (x) x)))

(begin
  (= path (path-join [(current-module-directory) "example.lambda"]))
  (= sexp (parse-sexp (file-load path)))
  (run-exp sexp))
