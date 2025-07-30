(assert-equal
  (lambda (x) x)
  (lambda (y) y))

(assert-equal
  (lambda (x y) (x y))
  (lambda (y x) (y x)))

(assert-not-equal
  (lambda (x y) (x y))
  (lambda (x y) (y x)))

(define (id1 x) x)
(define (id2 x) x)

(assert-equal id1 id1)
(assert-equal id2 id2)
(assert-not-equal id1 id2)

(assert-equal
  (lambda (x) (id2 x))
  (lambda (x) (id2 x)))

;; partial evaluation for unnamed lambda:
(assert-equal
  (lambda (x) ((lambda (x) (id2 x)) x))
  (lambda (x) (id2 x)))

(assert-not-equal
  id1
  (lambda (x) (id1 x)))

(assert-equal
  (lambda (x) (id2 x))
  (lambda (x) (id1 x)))
