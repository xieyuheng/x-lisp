(import-all "negate")

(assert-not (negate string? "abc"))
(assert (negate string? 'abc))
