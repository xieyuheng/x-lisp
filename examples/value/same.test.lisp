(assert (same? 1 1))
(assert (not (same? 1 2)))

(assert (same? 'a 'a))
(assert (not (same? 'a 'b)))

(define abc '(a b c))
(assert (same? abc abc))
(assert (not (same? abc '(a b c))))
