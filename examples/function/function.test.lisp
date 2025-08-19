(assert (equal? (pipe/fn 0 []) 0))
(assert (equal? (pipe/fn 0 [(iadd 1)]) 1))
(assert (equal? (pipe/fn 0 [(iadd 1) (iadd 1)]) 2))
(assert (equal? (pipe/fn 0 [(iadd 1) (iadd 1) (iadd 1)]) 3))
