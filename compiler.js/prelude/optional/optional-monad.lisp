(import-all "../function")

(export
  optional-lift
  optional-bind)

(claim optional-lift
  (polymorphic (A B)
    (-> (-> A (optional? B))
        (-> (optional? A) (optional? B)))))

(define (optional-lift f)
  (lambda (x)
    (if (null? x)
      null
      (f x))))

(define optional-bind (swap optional-lift))
