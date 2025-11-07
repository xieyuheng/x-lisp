(import-all "float-sum")

(assert-equal 0.0 (float-sum []))
(assert-equal 6.0 (float-sum [1.0 2.0 3.0]))
(assert-equal 10.0 (float-sum [1.0 2.0 3.0 4.0]))
