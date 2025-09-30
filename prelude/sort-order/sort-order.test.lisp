(import-all "sort-order")

(assert (sort-order? -1))
(assert (sort-order? 0))
(assert (sort-order? 1))

(assert-not (sort-order? -1.0))
(assert-not (sort-order? 0.0))
(assert-not (sort-order? 1.0))

(assert (sort-order-before? -1))
(assert (sort-order-same? 0))
(assert (sort-order-after? 1))

(assert-equal 1 (sort-order-negate -1))
(assert-equal 0 (sort-order-negate 0))
(assert-equal -1 (sort-order-negate 1))

(assert-equal [1 2 3] (list-sort int-compare/ascending [2 3 1]))
(assert-equal [3 2 1] (list-sort (sort-order-reverse int-compare/ascending) [2 3 1]))
