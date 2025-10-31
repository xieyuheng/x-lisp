;; curried primitive function

(assert-equal (iadd 1) (iadd 1))
(assert-not-equal (iadd 1) (iadd 2))

;; curried lambda

(define (my-add x y) (iadd x y))

(assert-equal (my-add 1 2) 3)
(assert-equal (my-add 1) (my-add 1))
(assert-not-equal (my-add 1) (my-add 2))

;; curried data predicate

(define-data (either? L R)
  (left (value L))
  (right (value R)))

(assert ((either? int? symbol?) (left 1)))
(assert ((either? int? symbol?) (right 'a)))

(assert-equal (either? int?) (either? int?))

;; claimed value

(define (id x) x)

(assert-equal
  (the (-> int? int?) id)
  (the (-> int? int?) id))

(assert-not-equal
  (the (-> int? int?) id)
  (the (-> float? float?) id))
