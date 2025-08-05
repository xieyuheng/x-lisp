(assert (equal? (if #t 1 2) 1))
(assert (equal? (if #f 1 2) 2))

(assert (equal? (if (and #t #t #t) 1 2) 1))
(assert (equal? (if (and #t #t #f) 1 2) 2))

(assert (equal? (if (or #f #f #t) 1 2) 1))
(assert (equal? (if (or #f #f #f) 1 2) 2))
