(import-all "int-product")

(assert-equal 1 (int-product []))
(assert-equal 6 (int-product [1 2 3]))
(assert-equal 24 (int-product [1 2 3 4]))
