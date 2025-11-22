(import-all "constant")

(assert-equal 1 (constant 1 "a"))
(assert-equal 1 ((specific constant int?) 1 "a"))
