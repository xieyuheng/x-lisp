(import-all "index")

(assert-equal 1 (identity 1))
(assert-equal 1 ((specific identity int?) 1))

(assert-equal 1 (constant 1 "a"))
(assert-equal 1 ((specific constant int?) 1 "a"))

(assert-equal 1 (pipe 1 (identity-unless #f (iadd 1))))
(assert-equal 2 (pipe 1 (identity-unless #t (iadd 1))))
