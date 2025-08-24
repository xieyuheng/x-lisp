3.14
0.0
-3.14

(fadd 3.14 -3.14)
(fadd 0.1 0.2)

(assert-equal (fneg 1.0) -1.0)
(assert-equal (fneg -1.0) 1.0)

(assert-equal (float-min 1.0 2.0) 1.0)
(assert-equal (float-max 1.0 2.0) 2.0)

(assert (float-larger? 2.0 1.0))
(assert (float-smaller? 1.0 2.0))

(assert (float-larger-or-equal? 2.0 1.0))
(assert (float-smaller-or-equal? 1.0 2.0))

(assert (float-larger-or-equal? 2.0 2.0))
(assert (float-smaller-or-equal? 1.0 1.0))
