(define-function main
  (block entry
    (= _₁ (const (@function println-non-void 1)))
    (= x₂ (const 4))
    (= _₂ (const (@function iadd 2)))
    (= _₃ (const 1))
    (= x₁ (apply _₂ x₂ _₃))
    (= _₄ (const (@function iadd 2)))
    (= _₅ (const 2))
    (= _₆ (apply _₄ x₁ _₅))
    (= _↩ (apply _₁ _₆))
    (return _↩)))