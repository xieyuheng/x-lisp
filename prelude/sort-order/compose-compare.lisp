(export compose-compare)

(claim compose-compare
  (polymorphic (A)
    (*-> (-> A A sort-order?)
         (-> A A sort-order?))))

(define compose-compare
  (lambda fs
    (lambda (x y)
      (match fs
        ([] 0)
        ((cons f tail)
         (match (f x y)
           (-1 -1)
           (1 1)
           (0 ((apply compose-compare tail)
               x y))))))))
