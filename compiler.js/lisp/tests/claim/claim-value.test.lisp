(claim x int?)
(define x 1)

(assert-equal x 1)
(assert-equal (iadd x x) 2)
