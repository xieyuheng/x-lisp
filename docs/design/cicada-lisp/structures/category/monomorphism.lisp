(import category-t "category.lisp")

(define-class monomorphism-t ()
  (claim cat category-t)
  (claim dom cat:object-t)
  (claim cod cat:object-t)
  (claim morphism (cat:morphism-t dom cod))

  (claim cancel-right
    (implicit ((x cat:object-t)
               (f (cat:morphism-t x dom))
               (g (cat:morphism-t x dom)))
      (-> (equal-t (cat:morphism-t x cod)
            (cat:compose f morphism)
            (cat:compose g morphism))
          (equal-t (cat:morphism-t x dom) f g)))))

;; NOTE Examples:
;;   (check mono (monomorphism-t cat x y))
;;   (check mono:morphism (mono:cat:morphism-t x y))
