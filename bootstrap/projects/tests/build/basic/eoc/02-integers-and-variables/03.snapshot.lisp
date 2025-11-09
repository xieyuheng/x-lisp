(define-function main
  (block entry
    (= _₁ (const (@function println-non-void 1)))
    (= x₁ (const 20))
    (= z₁ (const 22))
    (= _₂ (const (@function iadd 2)))
    (= y₁ (apply _₂ x₁ z₁))
    (= _↩ (apply _₁ y₁))
    (return _↩)))