(import category-t "category.lisp")

;; To any natural construction on structures of one species,
;; yielding structures of another species,
;; there corresponds a functor
;; from the category of the first species
;; to the category of the second.

;; For example, in the category of types in a programming language,
;; type constructors are endo-functors,
;; and endo-functors are often containers.

;; Functor can also be called natural-construction,
;; which will let the term `natural-transformation` make sense.

(define-class functor-t ()
  (claim dom category-t)
  (claim cod category-t)
  (claim map (-> dom:object-t cod:object-t))
  (claim fmap (implicit ((x dom:object-t)
                         (y dom:object-t))
                (forall ((f (dom:morphism-t x y)))
                  (cod:morphism-t (map x) (map y)))))
  (claim fmap-preserve-compose
    (implicit ((x dom:object-t)
               (y dom:object-t)
               (z dom:object-t))
      (forall ((f (dom:morphism-t x y))
               (g (dom:morphism-t y z)))
        (equal-t (cod:morphism-t (map x) (map z))
          (fmap (dom:compose f g))
          (cod:compose (fmap f) (fmap g))))))
  (claim fmap-preserve-id
    (forall ((x dom:object-t))
      (equal-t (cod:morphism-t (map x) (map x))
        (fmap (dom:id x))
        (cod:id (map x))))))

(define-class functor-t ()
  (claim dom category-t)
  (claim cod category-t)
  (claim map (-> (category-object-t dom) (category-object-t cod)))
  (claim fmap (implicit ((x (category-object-t dom))
                         (y (category-object-t dom)))
                (forall ((f (category-morphism-t dom x y)))
                  (category-morphism-t cod (map x) (map y)))))
  (claim fmap-preserve-compose
    (implicit ((x (category-object-t dom))
               (y (category-object-t dom))
               (z (category-object-t dom)))
      (forall ((f (category-morphism-t dom x y))
               (g (category-morphism-t dom y z)))
        (equal-t (category-morphism-t cod (map x) (map z))
          (fmap (category-compose dom f g))
          (category-compose cod (fmap f) (fmap g))))))
  (claim fmap-preserve-id
    (forall ((x (category-object-t dom)))
      (equal-t (category-morphism-t cod (map x) (map x))
        (fmap (category-id dom x))
        (category-id cod (map x))))))

(define-class functor-t ()
  (dom category-t)
  (cod category-t)
  (map (-> (category-object-t dom) (category-object-t cod)))
  (fmap (implicit ((x (category-object-t dom))
                   (y (category-object-t dom)))
          (forall ((f (category-morphism-t dom x y)))
            (category-morphism-t cod (map x) (map y)))))
  (fmap-preserve-compose
   (implicit ((x (category-object-t dom))
              (y (category-object-t dom))
              (z (category-object-t dom)))
     (forall ((f (category-morphism-t dom x y))
              (g (category-morphism-t dom y z)))
       (equal-t (category-morphism-t cod (map x) (map z))
         (fmap (category-compose dom f g))
         (category-compose cod (fmap f) (fmap g))))))
  (fmap-preserve-id
   (forall ((x (category-object-t dom)))
     (equal-t (category-morphism-t cod (map x) (map x))
       (fmap (category-id dom x))
       (category-id cod (map x))))))
