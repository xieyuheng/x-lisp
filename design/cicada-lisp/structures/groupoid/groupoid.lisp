(import category-t isomorphism-t "../category/index.lisp")

(define-class groupoid-t
  :inherit category-t
  (claim inverse
    (implicit ((x object-t)
               (y object-t))
      (-> (morphism-t x y)
          (morphism-t y x))))
  ;; NOTE The following use of `isomorphism`
  ;;   is an example of "partly fulfilled object construction".
  (claim inverse-iso
    (implicit ((x object-t)
               (y object-t))
      (forall (f (morphism-t x y))
        (isomorphism-t super x y f (inverse f))))))
