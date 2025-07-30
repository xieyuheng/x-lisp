;; If lazy evaluation is supported:

;; (define (Y f)
;;   ((lambda (x) (f (x x)))
;;    (lambda (x) (f (x x)))))

;; If lazy evaluation is NOT supported:

(define (Y f)
  ((lambda (u) (u u))
   (lambda (x) (f (lambda (t) ((x x) t))))))
