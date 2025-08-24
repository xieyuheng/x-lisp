1
0
-1

(iadd 1)

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
