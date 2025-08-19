(assert (equal? (pipe/fn 0 []) 0))
(assert (equal? (pipe/fn 0 [(iadd 1)]) 1))
(assert (equal? (pipe/fn 0 [(iadd 1) (iadd 1)]) 2))
(assert (equal? (pipe/fn 0 [(iadd 1) (iadd 1) (iadd 1)]) 3))

;; (assert (equal? (pipe 0) 0))
;; (assert (equal? (pipe 0 (iadd 1)) 1))
;; (assert (equal? (pipe 0 (iadd 1) (iadd 1)) 2))
;; (assert (equal? (pipe 0 (iadd 1) (iadd 1) (iadd 1)) 3))

(assert (equal? (compose/fn [] 0) 0))
(assert (equal? (compose/fn [(iadd 1)] 0) 1))
(assert (equal? (compose/fn [(iadd 1) (iadd 1)] 0) 2))
(assert (equal? (compose/fn [(iadd 1) (iadd 1) (iadd 1)] 0) 3))

(assert (equal? ((compose) 0) 0))
(assert (equal? ((compose (iadd 1)) 0) 1))
(assert (equal? ((compose (iadd 1) (iadd 1)) 0) 2))
(assert (equal? ((compose (iadd 1) (iadd 1) (iadd 1)) 0) 3))
