(import-all "optional-monad")

(assert-equal null (optional-lift (iadd 1) null))
(assert-equal 2 (optional-lift (iadd 1) 1))

(assert-equal null (optional-bind null (iadd 1)))
(assert-equal 2 (optional-bind 1 (iadd 1)))
