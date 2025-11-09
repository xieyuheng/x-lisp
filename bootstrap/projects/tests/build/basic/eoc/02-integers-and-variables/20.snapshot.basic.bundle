(define-function main
  (block entry
    (= _₁ (const (@function println-non-void 1)))
    (= x₁ (const 1))
    (= _₂ (const (@function iadd 2)))
    (= y₁ (const 5))
    (= _₃ (const (@function iadd 2)))
    (= x₂ (apply _₃ y₁ x₁))
    (= _₄ (const (@function iadd 2)))
    (= _₅ (const 100))
    (= _₆ (apply _₄ x₂ _₅))
    (= _₇ (apply _₂ x₁ _₆))
    (= _↩ (apply _₁ _₇))
    (return _↩)))