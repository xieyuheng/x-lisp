(define-function main
  (block entry
    (= _₁ (const (@function println-non-void 1)))
    (= x₁ (const 4))
    (= _₂ (const (@function iadd 2)))
    (= _₃ (const 8))
    (= _₄ (apply _₂ _₃ x₁))
    (= _↩ (apply _₁ _₄))
    (return _↩)))