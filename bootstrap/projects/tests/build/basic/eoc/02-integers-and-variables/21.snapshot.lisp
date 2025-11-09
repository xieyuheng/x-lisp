(define-function main
  (block entry
    (= _₁ (const (@function println-non-void 1)))
    (= y₁ (const 6))
    (= _₂ (const (@function ineg 1)))
    (= _₃ (const 42))
    (= y₂ (apply _₂ _₃))
    (= x₁ (call identity y₂))
    (= _₄ (const (@function iadd 2)))
    (= _₅ (apply _₄ x₁ y₁))
    (= _↩ (apply _₁ _₅))
    (return _↩)))