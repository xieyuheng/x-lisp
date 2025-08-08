;; curried primitive function

(assert (equal? (iadd 1) (iadd 1)))
(assert (not (equal? (iadd 1) (iadd 2))))

;; curried lambda

(define (my-iadd x y) (iadd x y))

(assert (equal? (my-iadd 1 2) 3))
(assert (equal? (my-iadd 1) (my-iadd 1)))
(assert (not (equal? (my-iadd 1) (my-iadd 2))))

;; curried data predicate

(define-data (either? L R)
  (left (value L))
  (right (value R)))

(assert ((either? int? symbol?) (left 1)))
(assert ((either? int? symbol?) (right 'a)))

(assert (equal? (either? int?) (either? int?)))
