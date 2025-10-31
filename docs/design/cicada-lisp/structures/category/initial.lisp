(import category-t "category.lisp")

(define-class initial-t ()
  (claim cat category-t)
  (claim object cat:object-t)
  (claim morphism
    (forall ((x cat:object-t))
      (cat:morphism-t object x)))
  (claim morphism-unique
    (implicit ((x cat:object-t))
      (forall ((f (cat:morphism-t object x)))
        (equal-t (cat:morphism-t object x)
          f (morphism x))))))
