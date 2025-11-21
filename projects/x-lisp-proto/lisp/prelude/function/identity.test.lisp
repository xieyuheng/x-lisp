(import-all "pipe")
(import-all "identity")

(assert-equal 1 (identity 1))
(assert-equal 1 ((specific identity int?) 1))

(assert-equal 1 (pipe 1 (identity-unless #f (iadd 1))))
(assert-equal 2 (pipe 1 (identity-unless #t (iadd 1))))
