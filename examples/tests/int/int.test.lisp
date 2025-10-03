(assert-equal ((iadd 1) 1) 2)

(assert-equal (iadd 1 1) 2)
(assert-equal (iadd 1 -1) 0)
(assert-equal (iadd 0 0) 0)
(assert-equal (iadd 1 0) 1)
(assert-equal (iadd 0 1) 1)

(assert-equal (iadd 1 (iadd 2 3)) 6)
(assert-equal (iadd (iadd 1 2) 3) 6)

(assert-equal (ineg 1) -1)
(assert-equal (ineg -1) 1)

(assert-equal (imul 2 3) 6)
(assert-equal (imul 3 3) 9)
(assert-equal (imul -3 3) -9)
(assert-equal (imul -3 -3) 9)

(assert-equal (int-min 1 2) 1)
(assert-equal (int-max 1 2) 2)

(assert (int-larger? 2 1))
(assert (int-smaller? 1 2))

(assert (int-larger-or-equal? 2 1))
(assert (int-smaller-or-equal? 1 2))

(assert (int-larger-or-equal? 2 2))
(assert (int-smaller-or-equal? 1 1))

(assert (int-positive? 1))
(assert (not (int-positive? 0)))
(assert (not (int-positive? -1)))

(assert (int-non-negative? 1))
(assert (int-non-negative? 0))
(assert (not (int-non-negative? -1)))
