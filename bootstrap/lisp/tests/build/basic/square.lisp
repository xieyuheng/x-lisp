(export square)

(define-function square
  (block entry
    (= x (argument 0))
    (= _₁ (const (@function imul 2)))
    (= _↩ (apply _₁ x x))
    (return _↩)))