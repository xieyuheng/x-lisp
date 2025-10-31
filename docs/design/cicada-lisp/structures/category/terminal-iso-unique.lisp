(import category-t "category.lisp")
(import terminal-t "terminal.lisp")
(import isomorphism-t "isomorphism.lisp")
(import equal-swap equal-compose "../equality/index.lisp")

;; Terminal is an universal construction,
;; if a terminal object exists, it is unique up to unique isomorphism.
;; - https://github.com/xieyuheng/cat/blob/master/src/category.agda

(claim terminal-iso
  (forall ((cat category-t)
           (x (terminal-t cat))
           (y (terminal-t cat)))
    (isomorphism-t cat x:object y:object)))

(define (terminal-iso cat x y)
  (let ((f (x:morphism y:object))
        (g (y:morphism x:object)))
    (new isomorphism
      (export cat)
      (define dom x:object)
      (define cod y:object)
      (define morphism (y:morphism x:object))
      (define inverse (x:morphism y:object))
      (define inverse-left
        (equal-compose
         (x:morphism-unique (cat:compose g f))
         (equal-swap (x:morphism-unique (cat:id x:object)))))
      (define inverse-right
        (equal-compose
         (y:morphism-unique (cat:compose f g))
         (equal-swap (y:morphism-unique (cat:id y:object))))))))

(claim terminal-iso-unique
  (forall ((cat category-t)
           (x (terminal-t cat))
           (y (terminal-t cat))
           (f (isomorphism-t cat x:object y:object))
           (g (isomorphism-t cat x:object y:object)))
    (equal-t (isomorphism-t cat x:object y:object) f g)))

(define (terminal-iso-unique cat x y f g)
  TODO)
