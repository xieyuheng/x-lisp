(assert (equal? (pipe/fn 0 []) 0))
(assert (equal? (pipe/fn 0 [iadd]) 1))
(assert (equal? (pipe/fn 0 [iadd iadd]) 2))
(assert (equal? (pipe/fn 0 [iadd iadd iadd]) 3))
