(import-all "int-sum")

(assert-equal 0 (int-sum []))
(assert-equal 6 (int-sum [1 2 3]))
(assert-equal 10 (int-sum [1 2 3 4]))
