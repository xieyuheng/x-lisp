(import-all "float-product")

(assert-equal 1.0 (float-product []))
(assert-equal 6.0 (float-product [1.0 2.0 3.0]))
(assert-equal 24.0 (float-product [1.0 2.0 3.0 4.0]))
