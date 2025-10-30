(import category-t "category.lisp")

(define trivial-category
  (new category-t
    (define object-t trivial-t)
    (define morphism-t (lambda (dom cod) trivial-t))
    (define id (lambda (x) sole))
    (define compose (lambda (f g) sole))
    (define id-left (lambda (f) refl))
    (define id-right (lambda (f) refl))
    (define compose-associative (lambda (f g h) refl))))

(define trivial-category
  (new category-t
    (object-t trivial-t)
    (morphism-t (lambda (dom cod) trivial-t))
    (id (lambda (x) sole))
    (compose (lambda (f g) sole))
    (id-left (lambda (f) refl))
    (id-right (lambda (f) refl))
    (compose-associative (lambda (f g h) refl))))

(define trivial-category
  [:object-t trivial-t
   :morphism-t (lambda (dom cod) trivial-t)
   :id (lambda (x) sole)
   :compose (lambda (f g) sole)
   :id-left (lambda (f) refl)
   :id-right (lambda (f) refl)
   :compose-associative (lambda (f g h) refl)])
