1
0
-1

(iadd 1 1)
(iadd 1 -1)
(iadd 0 0)
(iadd 1 0)
(iadd 0 1)

(iadd 1 (iadd 2 3))
(iadd (iadd 1 2) 3)

(iadd 1)
((iadd 1) 1)

(assert-equal (ineg 1) -1)
(assert-equal (ineg -1) 1)
