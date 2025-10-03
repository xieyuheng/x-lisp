(assert-equal (fneg 1.0) -1.0)
(assert-equal (fneg -1.0) 1.0)

(assert-equal (fmul 2.0 3.0) 6.0)
(assert-equal (fmul 3.0 3.0) 9.0)
(assert-equal (fmul -3.0 3.0) -9.0)
(assert-equal (fmul -3.0 -3.0) 9.0)

(assert-equal (float-min 1.0 2.0) 1.0)
(assert-equal (float-max 1.0 2.0) 2.0)

(assert (float-larger? 2.0 1.0))
(assert (float-smaller? 1.0 2.0))

(assert (float-larger-or-equal? 2.0 1.0))
(assert (float-smaller-or-equal? 1.0 2.0))

(assert (float-larger-or-equal? 2.0 2.0))
(assert (float-smaller-or-equal? 1.0 1.0))

(assert (float-positive? 1.0))
(assert (not (float-positive? 0.0)))
(assert (not (float-positive? -1.0)))

(assert (float-non-negative? 1.0))
(assert (float-non-negative? 0.0))
(assert (not (float-non-negative? -1.0)))
