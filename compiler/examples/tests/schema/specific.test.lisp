(claim my-append
  (polymorphic (A)
    (-> (list? A) (list? A)
        (list? A))))

(define (my-append left right)
  (list-append left right))

(assert-equal
  [1 2 3 4]
  ((specific my-append int?) [1 2] [3 4]))
