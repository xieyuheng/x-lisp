(assert-equal 3 (apply iadd [1 2]))
(assert-equal 3 (apply (apply iadd [1]) [2]))
