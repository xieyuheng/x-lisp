(assert-equal (if #t 1 2) 1)
(assert-equal (if #f 1 2) 2)

(assert (and #t #t #t))
(assert-not (and #t #t #f))

(assert (or #f #f #t))
(assert-not (or #f #f #f))
