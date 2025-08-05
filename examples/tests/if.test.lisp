(assert (equal? (if #t 1 2) 1))
(assert (equal? (if #f 1 2) 2))

(assert (equal? (and #t #t #t) #t))
(assert (equal? (and #t #t #f) #f))

(assert (equal? (or #f #f #t) #t))
(assert (equal? (or #f #f #f) #f))
