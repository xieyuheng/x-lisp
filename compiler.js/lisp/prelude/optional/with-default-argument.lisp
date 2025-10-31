(export with-default-argument)

(claim with-default-argument
  (polymorphic (A B)
    (-> A (-> A B)
        (-> (optional? A) B))))

(define (with-default-argument default f)
  (lambda (x)
    (if (null? x)
      (f default)
      (f x))))
