(lambda (x) x)

(define invoke (lambda (f x) (f x)))
invoke
(invoke (lambda (x) x))
(invoke (lambda (x) x) (lambda (x) x))

;; quote in body

(lambda (x)
  (cons x '(a b c)))

;; quasiquote in body

(lambda (x)
  `(a b c ,x))
