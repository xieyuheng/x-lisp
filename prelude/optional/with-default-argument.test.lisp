(import-all "index")

(assert-equal 2 ((with-default-argument 1 (iadd 1))
                 null))
