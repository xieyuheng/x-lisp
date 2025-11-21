(import-all "with-default-argument")

(assert-equal 2 ((with-default-argument 1 (iadd 1))
                 null))
