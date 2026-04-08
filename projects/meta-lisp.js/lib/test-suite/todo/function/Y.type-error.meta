(claim Y
  (polymorphic (A)
    (-> (-> A A) A)))

(define (Y f)
  ((lambda (u) (u u))
   (lambda (x) (f (lambda (t) ((x x) t))))))
