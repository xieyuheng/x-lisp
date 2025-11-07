(assert-equal (fneg 1.0) -1.0)
(assert-equal (fneg -1.0) 1.0)

(assert-equal (fmul 2.0 3.0) 6.0)
(assert-equal (fmul 3.0 3.0) 9.0)
(assert-equal (fmul -3.0 3.0) -9.0)
(assert-equal (fmul -3.0 -3.0) 9.0)

(assert-equal (float-min 1.0 2.0) 1.0)
(assert-equal (float-max 1.0 2.0) 2.0)

(assert (float-greater? 2.0 1.0))
(assert (float-less? 1.0 2.0))

(assert (float-greater-equal? 2.0 1.0))
(assert (float-less-equal? 1.0 2.0))

(assert (float-greater-equal? 2.0 2.0))
(assert (float-less-equal? 1.0 1.0))

(assert (float-positive? 1.0))
(assert (not (float-positive? 0.0)))
(assert (not (float-positive? -1.0)))

(assert (float-non-negative? 1.0))
(assert (float-non-negative? 0.0))
(assert (not (float-non-negative? -1.0)))
