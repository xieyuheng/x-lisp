(export
  sort-order?
  sort-order-before?
  sort-order-same?
  sort-order-after?
  sort-order-reverse
  sort-order-negate)

(define sort-order?
  (union
    sort-order-before?
    sort-order-same?
    sort-order-after?))

(define sort-order-before? (equal? -1))
(define sort-order-same? (equal? 0))
(define sort-order-after? (equal? 1))

(claim sort-order-reverse
  (polymorphic (A)
    (-> (-> A A sort-order?)
        (-> A A sort-order?))))

(define (sort-order-reverse compare x y)
  (sort-order-negate (compare x y)))

(claim sort-order-negate
  (-> sort-order?
      sort-order?))

(define sort-order-negate ineg)
