(import group-t "group.lisp")
(import category-t "../category/index.lisp")
(import equal-swap equal-map equal-compose "../equality/index.lisp")

(define-class group-homomorphism-t ()
  (claim dom group-t)
  (claim cod group-t)
  (claim homo (-> (dom:element-t) (cod:element-t)))
  (claim homo-preserve-id
    (equal-t cod:element-t (homo dom:id) cod:id))
  (claim homo-preserve-compose
    (forall ((x dom:element-t)
             (y dom:element-t))
      (equal-t (cod:element-t)
        (homo (dom:compose x y))
        (cod:compose (homo x) (homo y))))))

(claim id-group-homomorphism
  (forall ((G group-t))
    (group-homomorphism-t :dom G :cod G)))
(define (id-group-homomorphism G)
  (new group-homomorphism-t
    (define dom G)
    (define cod G)
    (define homo (lambda (x) x))
    (define homo-preserve-id refl)
    (define homo-preserve-compose (lambda (x y) refl))))

(claim compose-group-homomorphism
  (implicit ((G group-t)
             (H group-t)
             (K group-t))
    (forall ((f (group-homomorphism-t G H))
             (g (group-homomorphism-t H K)))
      (group-homomorphism-t G K))))

(define (compose-group-homomorphism (implicit G H K) f g)
  (new group-homomorphism-t
    (define dom G)
    (define cod K)
    (define homo (forall ((x G:element-t)) (g:homo (f:homo x))))
    (define homo-preserve-id
      (equivalent
       :type K:element-t
       (g:homo (f:homo G:id))
       :by (equal-map g:homo f:homo-preserve-id)
       (g:homo H:id)
       :by g:homo-preserve-id
       K:id))
    (define (homo-preserve-compose x y)
      (equivalent
       :type K:element-t
       (g:homo (f:homo (G:compose x y)))
       :by (equal-map g:homo (f:homo-preserve-compose x y))
       (g:homo (H:compose (f:homo x) (f:homo y)))
       :by (g:homo-preserve-compose (f:homo x) (f:homo y))
       (K:compose (g:homo (f:homo x)) (g:homo (f:homo y)))))))
