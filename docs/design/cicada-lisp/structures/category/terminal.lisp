(import category-t "category.lisp")

(define-class terminal-t ()
  (claim cat category-t)
  (claim object cat:object-t)
  (claim morphism
    (forall ((x cat:object-t))
      (cat:morphism-t x object)))
  (claim morphism-unique
    (implicit ((x cat:object-t))
      (forall ((f (cat:morphism-t x object)))
        (equal-t (cat:morphism-t x object)
          f (morphism x))))))
