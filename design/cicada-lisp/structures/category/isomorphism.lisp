(import category-t "category.lisp")

;; Two objects have the same structure iff they are isomorphic,
;; and an "abstract object" is an isomorphism class of objects.

(define-class isomorphism-t ()
  (claim cat category-t)
  (claim dom cat:object-t)
  (claim cod cat:object-t)
  (claim morphism (cat:morphism-t dom cod))
  (claim inverse (cat:morphism-t cod dom))
  (claim inverse-left
    (equal-t (cat:morphism-t dom dom)
      (cat:compose morphism inverse)
      (cat:id dom)))
  (claim inverse-right
    (equal-t (cat:morphism-t cod cod)
      (cat:compose inverse morphism)
      (cat:id cod))))
